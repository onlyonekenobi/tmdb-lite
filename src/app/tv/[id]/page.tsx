import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TMDBCastMember,
  TMDBCrewMember,
  TMDBTvDetails,
  getTvDetails,
  getYearFromDate,
  tmdbImagePath,
} from "../../../lib/tmdb";

interface TvPageProps {
  params: Promise<{ id: string }>;
}

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;

  let tv: TMDBTvDetails & {
    credits: { cast: TMDBCastMember[]; crew: TMDBCrewMember[] };
    similar: { results: TMDBTvDetails[] };
  };

  try {
    tv = await getTvDetails(id);
  } catch {
    notFound();
  }

  const posterUrl = tmdbImagePath(tv.poster_path, "w500");

  const cast = tv.credits?.cast?.slice(0, 16) ?? [];
  const crew = tv.credits?.crew ?? [];

  const mainCrew = crew
    .filter(
      (c) =>
        c.department === "Directing" ||
        c.department === "Writing" ||
        c.department === "Production"
    )
    .slice(0, 16);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <section className="flex flex-col gap-6 md:flex-row">
        <div className="relative mx-auto h-72 w-48 overflow-hidden rounded-md border border-zinc-900 bg-zinc-900 shadow-md shadow-black/60 md:mx-0 md:h-80 md:w-56">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={tv.name}
              fill
              sizes="(max-width: 768px) 50vw, 256px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-600">
              No poster
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3">
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            {tv.name}{" "}
            {tv.first_air_date && (
              <span className="text-zinc-500">
                ({getYearFromDate(tv.first_air_date)})
              </span>
            )}
          </h1>
          {tv.genres && tv.genres.length > 0 && (
            <p className="text-sm text-zinc-400">
              {tv.genres.map((g) => g.name).join(" • ")}
            </p>
          )}
          {tv.number_of_seasons != null && (
            <p className="text-sm text-zinc-300">
              {tv.number_of_seasons} season
              {tv.number_of_seasons === 1 ? "" : "s"} •{" "}
              {tv.number_of_episodes ?? 0} episodes
            </p>
          )}
          {tv.overview && (
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">
              {tv.overview}
            </p>
          )}
        </div>
      </section>

      {cast.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Cast</h2>
          <div className="overflow-x-auto rounded-md border border-zinc-900 bg-zinc-950/80">
            <table className="min-w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-[0.7rem] uppercase text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Actor</th>
                  <th className="px-3 py-2">Role</th>
                  <th className="px-3 py-2">Episodes</th>
                </tr>
              </thead>
              <tbody>
                {cast.map((member) => {
                  const role =
                    member.roles && member.roles.length > 0
                      ? member.roles[0]
                      : undefined;
                  return (
                    <tr
                      key={member.id}
                      className="border-t border-zinc-900/60 odd:bg-zinc-950/60 even:bg-zinc-950/40"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/person/${member.id}`}
                            className="flex items-center gap-2 hover:text-zinc-50"
                          >
                            <ProfileThumb
                              name={member.name}
                              path={member.profile_path}
                            />
                            <span className="text-xs font-medium text-zinc-100 underline-offset-2 group-hover:underline">
                              {member.name}
                            </span>
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-300">
                        {role?.character || member.character || "—"}
                      </td>
                      <td className="px-3 py-2 text-xs text-zinc-400">
                        {role?.episode_count ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {mainCrew.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Crew</h2>
          <div className="overflow-x-auto rounded-md border border-zinc-900 bg-zinc-950/80">
            <table className="min-w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 text-[0.7rem] uppercase text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Job</th>
                  <th className="px-3 py-2">Department</th>
                </tr>
              </thead>
              <tbody>
                {mainCrew.map((member) => (
                  <tr
                    key={`${member.id}-${member.job}`}
                    className="border-t border-zinc-900/60 odd:bg-zinc-950/60 even:bg-zinc-950/40"
                  >
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/person/${member.id}`}
                          className="flex items-center gap-2 hover:text-zinc-50"
                        >
                          <ProfileThumb
                            name={member.name}
                            path={member.profile_path}
                          />
                          <span className="text-xs font-medium text-zinc-100 underline-offset-2 group-hover:underline">
                            {member.name}
                          </span>
                        </Link>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-300">
                      {member.job || "—"}
                    </td>
                    <td className="px-3 py-2 text-xs text-zinc-400">
                      {member.department || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tv.similar?.results && tv.similar.results.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold">Similar shows</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {tv.similar.results.slice(0, 12).map((similar) => {
              const simPoster = tmdbImagePath(similar.poster_path, "w342");
              return (
                <a
                  key={similar.id}
                  href={`/tv/${similar.id}`}
                  className="group flex flex-col overflow-hidden rounded-md border border-zinc-900 bg-zinc-950/60 text-xs shadow-sm shadow-black/40 transition hover:border-zinc-700 hover:bg-zinc-900/60"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
                    {simPoster ? (
                      <Image
                        src={simPoster}
                        alt={similar.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[0.65rem] text-zinc-600">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 p-2">
                    <span className="line-clamp-2 text-[0.7rem] font-medium text-zinc-100">
                      {similar.name}
                    </span>
                    {similar.first_air_date && (
                      <span className="text-[0.65rem] text-zinc-500">
                        {getYearFromDate(similar.first_air_date)}
                      </span>
                    )}
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

function ProfileThumb({ name, path }: { name: string; path?: string | null }) {
  const url = tmdbImagePath(path ?? null, "w92");
  if (!url) {
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-[0.6rem] text-zinc-300">
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>
    );
  }
  return (
    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-zinc-900">
      <Image src={url} alt={name} fill sizes="32px" className="object-cover" />
    </div>
  );
}


