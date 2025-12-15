import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center sm:items-start sm:text-left">
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          TMDB<span className="text-zinc-400">Lite</span>
        </h1>
        <p className="max-w-xl text-sm text-zinc-400 sm:text-base">
          A super lightweight, ad-free companion for movies, TV shows, and
          people. Use the search above to find titles, cast, crew, and
          filmographies—fast and distraction-free.
        </p>
      </div>
      <div className="space-y-2 text-xs text-zinc-500 sm:text-sm">
        <p>
          Start typing in the search bar to query TMDb&apos;s{" "}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-[0.7rem]">
            /search/multi
          </code>{" "}
          endpoint.
        </p>
        <p>
          You can open movie, TV, and person detail pages via clean URLs like{" "}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-[0.7rem]">
            /movie/123
          </code>
          ,{" "}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-[0.7rem]">
            /tv/456
          </code>{" "}
          or{" "}
          <code className="rounded bg-zinc-900 px-1 py-0.5 text-[0.7rem]">
            /person/789
          </code>
          .
        </p>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
          No ads
        </span>
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
          No tracking
        </span>
        <span className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1">
          Server-side TMDb API
        </span>
      </div>
      <Link
        href="/search?q=blade%20runner"
        className="text-xs text-zinc-400 underline underline-offset-4 hover:text-zinc-200"
      >
        Try an example search: &ldquo;Blade Runner&rdquo;
      </Link>
    </div>
  );
}

