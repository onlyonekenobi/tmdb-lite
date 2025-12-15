"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const params = new URLSearchParams(searchParams ?? undefined);
    params.set("q", trimmed);
    router.push(`/search?${params.toString()}`);
  };

  const showPlaceholder =
    pathname === "/" ? "Search movies, TV, and people" : "Search again";

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-xl items-center gap-2">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={showPlaceholder}
        className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400"
      />
      <button
        type="submit"
        className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-400"
      >
        Search
      </button>
    </form>
  );
}


