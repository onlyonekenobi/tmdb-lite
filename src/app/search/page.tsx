import Image from "next/image";
import Link from "next/link";
import {
  TMDBSearchResult,
  getYearFromDate,
  searchMulti,
  tmdbImagePath,
} from "../../lib/tmdb";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  let results: TMDBSearchResult[] = [];

  if (query) {
    results = await searchMulti(query);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header className="space-y-2">
        <h1 className="text-xl font-semibold tracking-tight">
          Search results
        </h1>
        <p className="text-sm text-zinc-400">
          {query
            ? `Showing matches for “${query}”`
            : "Type in the search bar above to find movies, TV shows, and people."}
        </p>
      </header>

      {query && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {results.length === 0 && (
            <p className="col-span-full text-sm text-zinc-500">
              No results. Try a different title, name, or spelling.
            </p>
          )}
          {results.map((item) => (
            <SearchCard key={`${item.media_type}-${item.id}`} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}

function SearchCard({ item }: { item: TMDBSearchResult }) {
  const isMovie = item.media_type === "movie";
  const isTv = item.media_type === "tv";
  const isPerson = item.media_type === "person";

  const href = isMovie
    ? `/movie/${item.id}`
    : isTv
    ? `/tv/${item.id}`
    : `/person/${item.id}`;

  const title =
    (isMovie ? item.title : isTv ? item.name : item.name) ?? "Untitled";

  const year = isMovie
    ? getYearFromDate(item.release_date)
    : isTv
    ? getYearFromDate(item.first_air_date)
    : "";

  const posterPath =
    isPerson && item.profile_path
      ? item.profile_path
      : !isPerson && item.poster_path
      ? item.poster_path
      : null;

  const imageUrl = tmdbImagePath(posterPath, "w342");

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-md border border-zinc-900 bg-zinc-950/60 shadow-sm shadow-black/50 transition hover:border-zinc-700 hover:bg-zinc-900/60"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-600">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-2">
        <div className="truncate text-xs font-medium text-zinc-100">
          {title}
        </div>
        <div className="flex items-center justify-between text-[0.7rem] text-zinc-500">
          <span className="uppercase">
            {isMovie ? "Movie" : isTv ? "TV" : "Person"}
          </span>
          {year && <span>{year}</span>}
        </div>
      </div>
    </Link>
  );
}


