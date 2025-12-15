const TMDB_API_BASE = "https://api.themoviedb.org/3";

const IMAGE_BASE =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p";

type TMDBMediaType = "movie" | "tv" | "person";

export type TMDBSearchResult =
  | (TMDBMovieSummary & { media_type: "movie" })
  | (TMDBTvSummary & { media_type: "tv" })
  | (TMDBPersonSummary & { media_type: "person" });

export interface TMDBMovieSummary {
  id: number;
  title: string;
  release_date?: string;
  poster_path?: string | null;
  overview?: string;
}

export interface TMDBTvSummary {
  id: number;
  name: string;
  first_air_date?: string;
  poster_path?: string | null;
  overview?: string;
}

export interface TMDBPersonSummary {
  id: number;
  name: string;
  profile_path?: string | null;
  known_for_department?: string;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  profile_path?: string | null;
  character?: string;
  roles?: { character: string; episode_count: number }[];
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  profile_path?: string | null;
  job?: string;
  department?: string;
}

export interface TMDBMovieDetails extends TMDBMovieSummary {
  genres?: { id: number; name: string }[];
  runtime?: number;
  videos?: {
    results: {
      id: string;
      name: string;
      key: string;
      site: string;
      type: string;
      official: boolean;
    }[];
  };
}

export interface TMDBTvDetails extends TMDBTvSummary {
  genres?: { id: number; name: string }[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface TMDBPersonDetails extends TMDBPersonSummary {
  biography?: string;
  birthday?: string;
  deathday?: string | null;
  place_of_birth?: string | null;
}

export interface TMDBCredit {
  id: number;
  media_type?: TMDBMediaType;
  title?: string;
  name?: string;
  character?: string;
  job?: string;
  release_date?: string;
  first_air_date?: string;
  poster_path?: string | null;
}

interface TMDBPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

async function tmdbFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const v4Token = process.env.TMDB_READ_ACCESS_TOKEN;
  const v3Key = process.env.TMDB_API_KEY;

  if (!v4Token && !v3Key) {
    throw new Error(
      "TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY must be set in the environment"
    );
  }

  // Ensure we always hit the `/3/...` API path. Using the WHATWG URL(base, path)
  // constructor with a leading slash in `path` would drop the `/3` segment, so
  // we build the URL manually instead.
  const url = new URL(
    path.startsWith("/") ? `${TMDB_API_BASE}${path}` : `${TMDB_API_BASE}/${path}`
  );

  // Attach v3 API key as a query param if present.
  if (v3Key) {
    url.searchParams.set("api_key", v3Key);
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      accept: "application/json",
      ...(v4Token
        ? {
            Authorization: `Bearer ${v4Token}`,
          }
        : {}),
    },
    // Cache on the server a bit; TMDb data is not hyper-volatile for our use.
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    // Try to surface TMDb error for easier debugging.
    let message = `TMDb request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data?.status_message) {
        message += ` - ${data.status_message}`;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function searchMulti(query: string) {
  if (!query.trim()) return [];

  const data = await tmdbFetch<TMDBPaginatedResponse<TMDBSearchResult>>(
    `/search/multi?query=${encodeURIComponent(query)}&include_adult=false`
  );
  return data.results;
}

export async function getMovieDetails(id: string | number) {
  return tmdbFetch<
    TMDBMovieDetails & {
      credits: { cast: TMDBCastMember[]; crew: TMDBCrewMember[] };
      similar: { results: TMDBMovieSummary[] };
    }
  >(
    `/movie/${id}?append_to_response=credits,similar,videos`
  );
}

export async function getTvDetails(id: string | number) {
  return tmdbFetch<TMDBTvDetails & { credits: { cast: TMDBCastMember[]; crew: TMDBCrewMember[] }; similar: { results: TMDBTvSummary[] } }>(
    `/tv/${id}?append_to_response=credits,similar`
  );
}

export async function getPersonDetails(id: string | number) {
  return tmdbFetch<TMDBPersonDetails & { combined_credits: { cast: TMDBCredit[]; crew: TMDBCredit[] } }>(
    `/person/${id}?append_to_response=combined_credits`
  );
}

export function tmdbImagePath(path: string | null | undefined, size: "w45" | "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w500") {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function getYearFromDate(date?: string) {
  if (!date) return "";
  return date.slice(0, 4);
}


