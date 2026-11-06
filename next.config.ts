import type { NextConfig } from "next";
import articleRedirects from "./content/redirects.json";

/**
 * Articles that were merged into a stronger page or retired. Each old URL
 * permanently redirects to the article that absorbed its content, so any
 * links and ranking signals it earned carry over.
 *
 * Add an entry here whenever an article is removed or renamed; never just
 * delete the markdown file.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return Object.entries(articleRedirects as Record<string, string>).map(
      ([from, to]) => ({
        source: `/blog/${from}`,
        destination: `/blog/${to}`,
        permanent: true,
      })
    );
  },
};

export default nextConfig;
