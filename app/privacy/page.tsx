import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE.name}. Learn how we collect, use, and protect your information.`,
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <h1 className="mt-6 font-display text-3xl font-bold text-text sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        Last updated: June 9, 2026
      </p>

      <div className="prose mt-8">
        <p>
          At {SITE.name} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;),
          we are committed to protecting your privacy. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your
          information when you visit our website{" "}
          <strong>{SITE.url}</strong> (the &quot;Site&quot;).
        </p>

        <h2>Information We Collect</h2>

        <h3>Automatically Collected Information</h3>
        <p>
          When you visit our Site, we may automatically collect certain
          information about your device and usage patterns, including:
        </p>
        <ul>
          <li>IP address and approximate geographic location</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Referring URLs and exit pages</li>
          <li>Pages viewed and time spent on each page</li>
          <li>Date and time of visits</li>
          <li>Device type (desktop, mobile, tablet)</li>
        </ul>
        <p>
          This information is collected through Google Analytics and similar
          analytics tools to help us understand how visitors use our Site and
          improve the user experience.
        </p>

        <h3>Information You Provide</h3>
        <p>
          We may collect information that you voluntarily provide to us,
          including:
        </p>
        <ul>
          <li>
            Email address (when you subscribe to our newsletter)
          </li>
          <li>
            Any information you include in communications with us
          </li>
        </ul>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Operate, maintain, and improve our Site</li>
          <li>
            Send you newsletters and updates (only if you have opted in)
          </li>
          <li>Analyze usage trends and user behavior</li>
          <li>
            Display relevant advertisements through third-party ad networks
          </li>
          <li>Prevent fraud and ensure the security of our Site</li>
        </ul>

        <h2>Cookies and Tracking Technologies</h2>
        <p>
          Our Site uses cookies and similar tracking technologies to enhance
          your browsing experience. Cookies are small data files stored on
          your device.
        </p>

        <h3>Types of Cookies We Use</h3>
        <ul>
          <li>
            <strong>Essential Cookies:</strong> Required for the Site to
            function properly
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how
            visitors interact with our Site (Google Analytics)
          </li>
          <li>
            <strong>Advertising Cookies:</strong> Used by third-party ad
            networks (such as Google AdSense) to display relevant
            advertisements
          </li>
        </ul>
        <p>
          You can control cookies through your browser settings. Note that
          disabling certain cookies may affect the functionality of the Site.
        </p>

        <h2>Third-Party Advertising</h2>
        <p>
          We use third-party advertising companies, including Google AdSense,
          to serve ads when you visit our Site. These companies may use
          cookies and similar technologies to collect information about your
          visits to this and other websites in order to provide relevant
          advertisements about goods and services that may interest you.
        </p>
        <p>
          Google&apos;s use of advertising cookies enables it and its partners
          to serve ads based on your visit to our Site and/or other sites on
          the Internet. You may opt out of personalized advertising by
          visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </p>

        <h2>Affiliate Links</h2>
        <p>
          Some of the links on our Site are affiliate links. This means that
          if you click on a link and make a purchase, we may receive a
          commission at no additional cost to you. We only recommend products
          and services that we believe provide value to our readers. Our
          editorial content is not influenced by affiliate partnerships.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          Our Site may contain links to third-party websites and services. We
          are not responsible for the privacy practices or content of these
          third-party sites. We encourage you to review the privacy policies
          of any third-party sites you visit.
        </p>

        <h2>Data Retention</h2>
        <p>
          We retain your personal information only for as long as necessary
          to fulfill the purposes outlined in this Privacy Policy, unless a
          longer retention period is required or permitted by law. Analytics
          data is retained according to the default retention settings of our
          analytics provider.
        </p>

        <h2>Your Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of marketing communications</li>
          <li>Opt out of personalized advertising</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us using the
          information provided below.
        </p>

        <h2>Children&apos;s Privacy</h2>
        <p>
          Our Site is not intended for children under the age of 13. We do
          not knowingly collect personal information from children under 13.
          If we become aware that we have collected personal information from
          a child under 13, we will take steps to delete such information.
        </p>

        <h2>Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new Privacy Policy on this page
          and updating the &quot;Last updated&quot; date. You are advised to
          review this Privacy Policy periodically for any changes.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us at:
        </p>
        <ul>
          <li>
            <strong>Email:</strong> contact@automatewise.com
          </li>
          <li>
            <strong>Website:</strong> {SITE.url}
          </li>
        </ul>
      </div>
    </div>
  );
}
