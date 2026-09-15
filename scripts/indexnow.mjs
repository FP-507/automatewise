#!/usr/bin/env node
/**
 * Submits every URL in the live sitemap to IndexNow.
 *
 * IndexNow is a push protocol: instead of waiting for a crawler to rediscover
 * a page, you tell the engine the URL changed. Bing, Yandex, Naver, Seznam and
 * Yep (DuckDuckGo's index) consume it.
 *
 * Google does NOT participate and has never adopted it, so this does nothing
 * for Google rankings. Google indexing is accelerated only through Search
 * Console's URL Inspection tool and through inbound links.
 *
 * Usage:
 *   node scripts/indexnow.mjs           submit every sitemap URL
 *   node scripts/indexnow.mjs --dry-run show what would be submitted
 */

const KEY = "8bf3a12d7ade080f09a04cdb1d285d96";
const HOST = "automatewise-six.vercel.app";
const ORIGIN = `https://${HOST}`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 10_000; // protocol maximum per request

const dryRun = process.argv.includes("--dry-run");

async function readSitemapUrls() {
  const res = await fetch(`${ORIGIN}/sitemap.xml`);
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: HTTP ${res.status}`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urls.length === 0) {
    throw new Error("Sitemap contained no <loc> entries");
  }
  return urls;
}

async function verifyKeyIsReachable() {
  const url = `${ORIGIN}/${KEY}.txt`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Key file not reachable at ${url} (HTTP ${res.status}). ` +
        `Deploy public/${KEY}.txt before submitting, or IndexNow rejects the request.`
    );
  }
  const body = (await res.text()).trim();
  if (body !== KEY) {
    throw new Error(`Key file content mismatch at ${url}. Expected "${KEY}".`);
  }
}

async function submit(urlList) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `${ORIGIN}/${KEY}.txt`,
      urlList,
    }),
  });

  // 200 accepted, 202 accepted pending key validation. Both are success.
  const meaning =
    {
      200: "accepted",
      202: "accepted, key validation pending",
      400: "bad request (malformed URLs or payload)",
      403: "key not valid for this host",
      422: "URLs do not belong to the host, or key mismatch",
      429: "rate limited, too many requests",
    }[res.status] ?? "unexpected response";

  return { status: res.status, meaning, ok: res.status === 200 || res.status === 202 };
}

async function main() {
  const urls = await readSitemapUrls();
  console.log(`Sitemap: ${urls.length} URLs`);

  if (dryRun) {
    console.log("--dry-run, nothing submitted. First 5:");
    urls.slice(0, 5).forEach((u) => console.log(`  ${u}`));
    return;
  }

  await verifyKeyIsReachable();
  console.log(`Key verified at ${ORIGIN}/${KEY}.txt`);

  let failed = false;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const { status, meaning, ok } = await submit(batch);
    console.log(`Submitted ${batch.length} URLs -> HTTP ${status} (${meaning})`);
    if (!ok) failed = true;
  }

  console.log(
    failed
      ? "Finished with errors. Nothing was sent to Google either way; Google does not support IndexNow."
      : "Done. Bing, Yandex, Naver, Seznam and Yep have been notified. Google has not, by design."
  );
  if (failed) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`IndexNow failed: ${err.message}`);
  process.exitCode = 1;
});
