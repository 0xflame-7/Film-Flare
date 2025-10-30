import { useCallback, useEffect, useRef, useState } from "react";
import MovieDetails from "@/components/models/movie-details";
import MovieCard from "@/components/movie/movie-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Movie } from "@/types";
import { useSearch, Link } from "wouter";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

export default function MoviePage() {
  const auth = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const isInitialRef = useRef(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const fetchMoviesRef = useRef<(() => Promise<void>) | undefined>(undefined);

  const search = useSearch();
  const params = new URLSearchParams(search);
  const query = params.get("search");
  console.log("🎬 Current query param:", query);
  const type = params.get("type") ?? "top_rated";
  const genres = params.get("genres");

  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { isAuth } = auth;

  const fetchMovies = useCallback(async () => {
    if (isFetchingRef.current || !hasMoreRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const limit = isInitialRef.current ? 20 : 5;
      let url = `${import.meta.env.VITE_API_URL}/movies`;
      if (query) {
        url += `/search?q=${query}&limit=${limit}&offset=${offsetRef.current}`;
      } else if (type === "top_rated") {
        url += `/top_rated?limit=${limit}&offset=${offsetRef.current}`;
        if (genres) url += `&q=${genres}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        hasMoreRef.current = false;
        return;
      }

      setMovies((prev) => [
        ...prev,
        ...data.filter((m: Movie) => !prev.some((p) => p.id === m.id)),
      ]);

      offsetRef.current += limit;
      console.log("Fetched:", data.length, "New Offset:", offsetRef.current);
      isInitialRef.current = false;
    } catch (err) {
      console.error("Error fetching Movies:", err);
      hasMoreRef.current = false;
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, [query, type, genres]);

  useEffect(() => {
    console.log("Reset triggered due to query/type/genres change");
    setMovies([]);
    hasMoreRef.current = true;
    offsetRef.current = 0;
    isInitialRef.current = true;
    fetchMovies();
  }, [query, type, genres, fetchMovies]);

  useEffect(() => {
    fetchMoviesRef.current = fetchMovies;
  }, [fetchMovies]);

  useEffect(() => {
    if (!sentinelRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && fetchMoviesRef.current) {
          fetchMoviesRef.current();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(sentinelRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleCardOpen = (movie: Movie) => {
    if (!isAuth) {
      toast.error("Please login first", {
        description: (
          <Link
            href="/auth/login"
            className="text-primary underline hover:text-primary/80 dark:text-accent"
          >
            Go to Login →
          </Link>
        ),
        duration: 4000,
      });
    } else {
      setSelectedMovie(movie);
      setOpenDialog(true);
    }
  };

  return (
    <>
      <div className="flex-1 w-full h-full overflow-hidden box-border p-4 pb-0">
        <div className="w-full h-full overflow-y-auto p-4 mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <MovieCard movie={movie} onOpen={() => handleCardOpen(movie)} />
              </div>
            ))}

            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-[230px] h-[340px] rounded-2xl" />
              ))}
          </div>

          <div ref={sentinelRef} className="h-10" />
        </div>
      </div>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isOpen={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedMovie(null);
          }}
          onMovieSelect={setSelectedMovie}
        />
      )}
    </>
  );
}
