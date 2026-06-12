import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-32 text-center">
      <div className="relative">
        <span className="font-display text-[8rem] font-bold leading-none gradient-text">
          404
        </span>
        <div className="absolute inset-0 bg-accent/10 blur-[60px] rounded-full" />
      </div>
      <h1 className="mt-2 font-display text-2xl font-bold text-text">
        Page Not Found
      </h1>
      <p className="mt-3 text-text-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-semibold text-background"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
            <path d="M8.354 1.146a.5.5 0 00-.708 0l-6 6A.5.5 0 001.5 7.5v7a.5.5 0 00.5.5h4.5a.5.5 0 00.5-.5v-4h2v4a.5.5 0 00.5.5H14a.5.5 0 00.5-.5v-7a.5.5 0 00-.146-.354L8.354 1.146z" />
          </svg>
          Go Home
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-border px-6 py-3 font-medium text-text transition-all duration-200 hover:bg-surface hover:border-text-muted"
        >
          Browse Articles
        </Link>
      </div>
    </div>
  );
}
