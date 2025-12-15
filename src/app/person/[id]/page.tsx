import Image from "next/image";
import { notFound } from "next/navigation";
import {
  TMDBCredit,
  TMDBPersonDetails,
  getPersonDetails,
  getYearFromDate,
  tmdbImagePath,
} from "../../../lib/tmdb";

interface PersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function PersonPage({ params }: PersonPageProps) {
  const { id } = await params;

  let person: TMDBPersonDetails & {
    combined_credits: { cast: TMDBCredit[]; crew: TMDBCredit[] };
  };

  try {
    person = await getPersonDetails(id);
  } catch {
    notFound();
  }

  const profileUrl = tmdbImagePath(person.profile_path, "w500");

  const credits = [...(person.combined_credits.cast ?? []), ...(person.combined_credits.crew ?? [])];

  const deduped = dedupeCredits(credits).sort((a, b) => {
    const aDate = a.release_date || a.first_air_date || "";
    const bDate = b.release_date || b.first_air_date || "";
    return (bDate || "").localeCompare(aDate || "");
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="flex flex-col gap-6 md:flex-row">
        <div className="relative mx-auto h-72 w-56 overflow-hidden rounded-md border border-zinc-900 bg-zinc-900 shadow-md shadow-black/60 md:mx-0 md:h-80 md:w-64">
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={person.name}
              fill
              sizes="(max-width: 768px) 60vw, 256px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-600">
              No profile image
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {person.name}
          </h1>
          <p className="text-sm text-zinc-400">
            {person.known_for_department || "Biography"}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
            {person.birthday && (
              <span>
                Born:{" "}
                <span className="text-zinc-200">
                  {person.birthday}
                  {person.place_of_birth
                    ? ` • ${person.place_of_birth}`
                    : ""}
                </span>
              </span>
            )}
            {person.deathday && (
              <span>
                Died: <span className="text-zinc-200">{person.deathday}</span>
              </span>
            )}
          </div>
          {person.biography && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
              {person.biography}
            </p>
          )}
        </div>
      </section>

      {deduped.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Filmography</h2>
          <div className="space-y-2 text-xs text-zinc-300">
            {deduped.map((credit) => {
              const isMovie = credit.media_type === "movie";
              const isTv = credit.media_type === "tv";
              const href = isMovie
                ? `/movie/${credit.id}`
                : isTv
                ? `/tv/${credit.id}`
                : "#";
              const title = isMovie
                ? credit.title
                : isTv
                ? credit.name
                : credit.title || credit.name;
              const year = isMovie
                ? getYearFromDate(credit.release_date)
                : getYearFromDate(credit.first_air_date);
              const role = credit.character || credit.job || "";

              const poster = tmdbImagePath(credit.poster_path ?? null, "w92");

              return (
                <a
                  key={`${credit.media_type}-${credit.id}-${credit.job ?? credit.character ?? ""}`}
                  href={href}
                  className="flex items-center gap-3 rounded-md border border-zinc-900 bg-zinc-950/70 px-2 py-2 transition hover:border-zinc-700 hover:bg-zinc-900/70"
                >
                  <div className="relative h-14 w-10 overflow-hidden rounded bg-zinc-900">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={title ?? "Title"}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[0.6rem] text-zinc-600">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[0.8rem] font-medium text-zinc-100">
                        {title}
                      </span>
                      {year && (
                        <span className="text-[0.7rem] text-zinc-500">
                          {year}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[0.7rem] text-zinc-400">
                        {role || "—"}
                      </span>
                      <span className="text-[0.7rem] uppercase text-zinc-500">
                        {credit.media_type}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function dedupeCredits(credits: TMDBCredit[]): TMDBCredit[] {
  const seen = new Map<string, TMDBCredit>();
  for (const credit of credits) {
    const key = `${credit.media_type}-${credit.id}`;
    if (!seen.has(key)) {
      seen.set(key, credit);
    }
  }
  return Array.from(seen.values());
}


