---
title: "n8n Self-Hosting Guide: Complete Setup Tutorial for 2025"
description: "Step-by-step guide to self-host n8n with Docker. Covers setup, docker-compose, reverse proxy, SSL, backups, security, and cloud comparison."
date: "2026-05-05"
category: "how-to"
tags: ["n8n", "self-hosting", "Docker", "server setup", "DevOps"]
keywords: ["n8n self hosting", "self host n8n", "n8n docker setup", "n8n server installation"]
featured: false
---

n8n is one of the most powerful workflow automation platforms available, and one of its biggest advantages is the ability to self-host it on your own infrastructure. Self-hosting gives you full control over your data, eliminates per-workflow pricing, and lets you run unlimited executions without worrying about plan limits.

But setting up a self-hosted instance properly requires more than just running a Docker command. You need to configure persistent storage, set up a reverse proxy with SSL, handle backups, and secure the installation against unauthorized access.

This guide walks you through the complete process of self-hosting n8n, from initial server setup to production-ready deployment. Whether you are a solo freelancer looking to save on subscription costs or a team that needs data sovereignty, this tutorial has you covered.

## Why Self-Host n8n

Before investing time in a self-hosted setup, it is worth understanding what you gain and what you trade off compared to n8n Cloud.

### Advantages of Self-Hosting

**No execution limits.** n8n Cloud plans cap the number of workflow executions per month. Self-hosted n8n has no limits. You can run as many workflows as your server can handle.

**Data privacy.** Your workflow data, credentials, and execution logs stay on your own infrastructure. For businesses handling sensitive data, regulated industries, or GDPR compliance requirements, this is often a hard requirement.

**Cost savings at scale.** n8n Cloud pricing is reasonable for small operations, but costs grow with usage. Self-hosting on a $10-20/month VPS gives you unlimited capacity. For teams running dozens of workflows with thousands of executions, the savings are substantial.

**Customization.** Self-hosting lets you install custom nodes, modify configuration parameters not exposed in the cloud interface, and integrate with internal services that are not accessible from the public internet.

**No vendor lock-in.** Your data and workflows are stored locally. You can export, back up, and migrate at will without depending on a third-party service.

### Trade-Offs to Consider

**You handle maintenance.** Updates, backups, monitoring, and troubleshooting are your responsibility. n8n Cloud handles all of this for you.

**Uptime depends on you.** If your server goes down, your workflows stop running. You need to set up monitoring and potentially high-availability configurations.

**Initial setup time.** Getting a production-ready installation takes a few hours. n8n Cloud is ready in minutes.

For most automation use cases, the benefits of self-hosting outweigh the trade-offs, especially if you are already comfortable with basic server administration. For those exploring their options, our [comparison of n8n vs Zapier](/blog/n8n-vs-zapier) explains why n8n's self-hosting option is a major differentiator.

## Server Requirements

n8n is lightweight and runs comfortably on modest hardware.

### Minimum Requirements

- **CPU:** 1 vCPU
- **RAM:** 1 GB (2 GB recommended)
- **Storage:** 20 GB SSD
- **OS:** Ubuntu 22.04 LTS, Debian 12, or any Linux distribution that supports Docker
- **Network:** Static IP address or a domain name pointing to your server

### Recommended Setup for Production

- **CPU:** 2 vCPUs
- **RAM:** 4 GB
- **Storage:** 40 GB SSD
- **Database:** PostgreSQL (instead of the default SQLite) for better performance and reliability
- **Backup storage:** Separate volume or external backup service

### Cloud Provider Options

Any VPS provider works. Popular choices include DigitalOcean Droplets starting at $6/month, Hetzner Cloud from around $4/month with excellent European hosting, Linode with plans from $5/month, AWS EC2 or Lightsail, and Oracle Cloud which has a generous free tier.

For this guide, we will assume you have a fresh Ubuntu 22.04 server with SSH access and a domain name (like `n8n.yourdomain.com`) pointing to the server's IP address.

## Installing Docker and Docker Compose

Docker is the recommended way to run n8n because it simplifies installation, updates, and dependency management.

### Step 1: Update Your System

Connect to your server via SSH and update all packages:

```bash
sudo apt update && sudo apt upgrade -y
```

### Step 2: Install Docker

Install Docker using the official convenience script:

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Add your user to the Docker group so you can run Docker commands without sudo:

```bash
sudo usermod -aG docker $USER
```

Log out and log back in for the group change to take effect.

### Step 3: Install Docker Compose

Docker Compose comes bundled with modern Docker installations. Verify it is available:

```bash
docker compose version
```

You should see version 2.x or later. If not, install it separately:

```bash
sudo apt install docker-compose-plugin
```

## Setting Up n8n with Docker Compose

While you can run n8n with a single Docker command, Docker Compose is better for production because it manages configuration, networking, and dependencies in a single file.

### Step 1: Create the Project Directory

```bash
mkdir -p /opt/n8n && cd /opt/n8n
```

### Step 2: Create the Docker Compose File

Create a `docker-compose.yml` file with the following configuration:

```yaml
version: "3.8"

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=n8n.yourdomain.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.yourdomain.com/
      - GENERIC_TIMEZONE=America/New_York
      - TZ=America/New_York
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=your_secure_password_here
      - N8N_ENCRYPTION_KEY=your_random_encryption_key_here
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    image: postgres:15
    container_name: n8n-postgres
    restart: always
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=your_secure_password_here
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U n8n"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  n8n_data:
  postgres_data:
```

Replace `n8n.yourdomain.com` with your actual domain, `your_secure_password_here` with a strong password, and `your_random_encryption_key_here` with a random string (generate one with `openssl rand -hex 32`). The encryption key is critical because it encrypts stored credentials. If you lose it, you will need to re-enter all credentials.

### Step 3: Start the Services

```bash
docker compose up -d
```

Docker will pull the n8n and PostgreSQL images, create the containers, and start both services. Verify everything is running:

```bash
docker compose ps
```

Both services should show a status of "Up." At this point, n8n is accessible on port 5678 of your server, but we need to set up a reverse proxy with SSL before exposing it to the internet.

## Setting Up a Reverse Proxy with SSL

A reverse proxy serves two purposes: it provides SSL encryption for secure access, and it lets you use a clean domain name instead of an IP address with a port number.

### Option 1: Caddy (Recommended for Simplicity)

Caddy is the easiest reverse proxy to set up because it handles SSL certificates automatically.

Add Caddy to your `docker-compose.yml`:

```yaml
  caddy:
    image: caddy:latest
    container_name: caddy
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
```

Add the Caddy volumes to the volumes section:

```yaml
volumes:
  n8n_data:
  postgres_data:
  caddy_data:
  caddy_config:
```

Create a `Caddyfile` in the same directory:

```
n8n.yourdomain.com {
    reverse_proxy n8n:5678
}
```

That is the entire Caddy configuration. Caddy automatically obtains and renews Let's Encrypt SSL certificates.

Remove the ports mapping from the n8n service (since Caddy will handle external access) and restart:

```bash
docker compose down && docker compose up -d
```

### Option 2: Nginx with Certbot

If you prefer Nginx, the setup is more involved but gives you more control.

Add Nginx to your Docker Compose setup or install it directly on the server. Create an Nginx configuration file for your n8n domain that includes a proxy pass to the n8n container on port 5678, WebSocket support headers, and SSL configuration managed by Certbot.

Then install Certbot and run it for your domain to obtain free SSL certificates with automatic renewal.

Both options work well. Caddy is recommended for most users due to its minimal configuration.

## Essential Environment Variables

n8n's behavior is controlled through environment variables. Here are the most important ones beyond the basics already in the Docker Compose file.

### Security Variables

```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=secure_password
```

Note: On newer versions of n8n, user management replaces basic auth. On first launch, you will create an owner account through the web interface.

### Execution Settings

```
EXECUTIONS_DATA_SAVE_ON_ERROR=all
EXECUTIONS_DATA_SAVE_ON_SUCCESS=all
EXECUTIONS_DATA_SAVE_MANUAL_EXECUTIONS=true
EXECUTIONS_DATA_MAX_AGE=168
```

The `MAX_AGE` setting controls how long execution data is retained (in hours). 168 hours equals 7 days. Adjust this based on your storage capacity and debugging needs.

### Webhook Configuration

```
WEBHOOK_URL=https://n8n.yourdomain.com/
N8N_EDITOR_BASE_URL=https://n8n.yourdomain.com/
```

These must be set correctly for webhook-based triggers to work. The URL should match your domain with HTTPS.

### Email Notifications

```
N8N_EMAIL_MODE=smtp
N8N_SMTP_HOST=smtp.gmail.com
N8N_SMTP_PORT=465
N8N_SMTP_USER=your@email.com
N8N_SMTP_PASS=your_app_password
N8N_SMTP_SSL=true
```

Configuring email lets n8n send error notifications and user management emails.

## Backup Strategy

Self-hosting means backups are your responsibility. Losing your n8n data means losing all workflows, credentials, and execution history.

### What to Back Up

1. **PostgreSQL database.** Contains all workflows, credentials (encrypted), execution data, and user accounts.
2. **n8n data volume.** Contains encryption keys and any files uploaded through workflows.
3. **Docker Compose and configuration files.** Your `docker-compose.yml`, `Caddyfile`, and any custom configuration.

### Automated Backup Script

Create a backup script at `/opt/n8n/backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/opt/n8n/backups"
DATE=$(date +%Y-%m-%d_%H-%M)
mkdir -p $BACKUP_DIR

# Database backup
docker exec n8n-postgres pg_dump -U n8n n8n | gzip > "$BACKUP_DIR/n8n-db-$DATE.sql.gz"

# Configuration backup
tar -czf "$BACKUP_DIR/n8n-config-$DATE.tar.gz" /opt/n8n/docker-compose.yml /opt/n8n/Caddyfile

# Cleanup backups older than 30 days
find $BACKUP_DIR -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

Make it executable and add it to cron:

```bash
chmod +x /opt/n8n/backup.sh
crontab -e
```

Add this line to run the backup daily at 3 AM:

```
0 3 * * * /opt/n8n/backup.sh >> /opt/n8n/backups/backup.log 2>&1
```

For additional safety, copy backups to an offsite location using rsync, rclone (for cloud storage like S3), or a dedicated backup service. This same principle applies to any self-hosted service and is something we recommend in our guide to the [best automation tools for small business](/blog/best-automation-tools-small-business).

## Updating n8n

Keeping n8n updated is important for security fixes, bug fixes, and new features.

### Update Process

```bash
cd /opt/n8n

# Pull the latest image
docker compose pull

# Restart with the new image
docker compose up -d

# Verify the update
docker compose logs -f n8n
```

Watch the logs for any migration messages or errors. n8n automatically runs database migrations when starting a new version.

### Best Practices for Updates

- **Back up before updating.** Always run your backup script before pulling a new version.
- **Read the changelog.** Check n8n's release notes for breaking changes before updating.
- **Test in staging first.** If you run critical workflows, consider maintaining a staging instance where you test updates before applying them to production.
- **Pin versions for stability.** Instead of using `n8nio/n8n:latest`, pin to a specific version like `n8nio/n8n:1.30.0` in production. Update deliberately rather than automatically.

## Security Hardening

A self-hosted n8n instance is exposed to the internet, so security is essential.

### Firewall Configuration

Use UFW (Uncomplicated Firewall) to restrict access:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

This blocks all incoming traffic except SSH, HTTP, and HTTPS.

### SSH Security

- Disable password authentication and use SSH keys only
- Change the default SSH port from 22 to a non-standard port
- Install fail2ban to block brute-force attempts

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### n8n Security Settings

- Use strong passwords for both the n8n user account and the database
- Set the `N8N_ENCRYPTION_KEY` and keep it safe. Without it, encrypted credentials cannot be decrypted
- Restrict access by IP if n8n is only used by your team
- Enable two-factor authentication through a reverse proxy or SSO integration
- Regularly audit workflow permissions and shared credentials

### Docker Security

- Run containers as non-root users when possible
- Keep Docker and all images updated
- Limit container resources with memory and CPU limits in Docker Compose
- Use Docker secrets instead of plain text passwords in production environments

## Cloud vs Self-Hosted Comparison

Here is a practical comparison to help you decide.

| Factor | n8n Cloud | Self-Hosted |
|--------|-----------|-------------|
| Setup time | Minutes | 2-4 hours |
| Monthly cost | $20-$299+ depending on plan | $5-$20 for VPS |
| Execution limits | Plan-dependent | Unlimited |
| Data location | n8n's servers (EU) | Your infrastructure |
| Maintenance | Handled by n8n | Your responsibility |
| Updates | Automatic | Manual |
| Custom nodes | Limited | Full support |
| Support | Included in paid plans | Community only |
| Uptime guarantee | SLA on paid plans | Depends on your setup |
| Scalability | Upgrade plan | Upgrade server |

**Choose n8n Cloud if** you want zero maintenance, need guaranteed uptime, and your usage fits within a plan's limits.

**Choose self-hosting if** you need data privacy, want unlimited executions, or run many workflows that would make cloud pricing expensive.

Both options use the same n8n interface and features. You can start with cloud and migrate to self-hosted later, or vice versa, by exporting and importing workflows. For more context on choosing the right tool, our [n8n vs Make comparison](/blog/n8n-vs-make) discusses how self-hosting factors into the broader tool selection decision.

## Monitoring Your Instance

Once your self-hosted n8n is running, monitor it to catch problems early.

### Health Checks

Set up a simple monitoring service like UptimeRobot or Uptime Kuma to check your n8n URL every five minutes and alert you if it goes down.

### Resource Monitoring

Monitor CPU, RAM, and disk usage on your server. Tools like htop, Netdata, or Grafana with Prometheus give you visibility into resource consumption. Watch for workflows that consume excessive memory or database growth that could fill your disk.

### Execution Monitoring

Periodically review the n8n execution log for failed workflows. Build a monitoring workflow within n8n itself that checks for failed executions daily and sends you a summary via [Slack notifications](/blog/automate-slack-notifications) or email.

## Conclusion

Self-hosting n8n is one of the best investments you can make in your automation infrastructure. It gives you unlimited workflow executions, full data control, and the flexibility to customize your installation to your exact needs, all for the cost of a small VPS.

The setup process takes a few hours if you follow this guide step by step: install Docker, configure Docker Compose with PostgreSQL, set up a reverse proxy with automatic SSL, implement backups, and harden security. Once running, maintenance is minimal, just periodic updates and backup verification.

Whether you are a freelancer automating client work, a startup building internal tools, or an enterprise team with data sovereignty requirements, self-hosted n8n provides a robust, cost-effective automation platform that scales with your needs.
