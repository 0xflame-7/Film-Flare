"use client";

import { useEffect, useState, useRef } from "react";
import type { Movie } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import MovieCard from "@/components/movie/movie-card";
import { Link } from "wouter";
import MovieDetails from "../models/movie-details";
import useAuth from "@/hooks/use-auth";
import { toast } from "sonner";

export default function TopRated({ genre }: { genre: string[] }) {
  const auth = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!auth) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { isAuth } = auth;

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        setLoading(true);
        const qParam = genre.length > 0 ? `?q=${genre.join(",")}` : "";
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/movies/top_rated${qParam}`
        );
        if (!res.ok) throw new Error("Failed to fetch top rated movies");
        const data = await res.json();
        setMovies(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, [genre]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      console.log("Wheel delta:", e.deltaY);
      e.preventDefault();
      container.scrollLeft += e.deltaY / 3;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [movies]);

  const handleOpenMovie = (movie: Movie) => {
    if (isAuth) {
      setSelectedMovie(movie);
      setIsOpen(true);
    } else {
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
    }
  };

  return (
    <>
      <section className="px-5 py-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-3xl">Top Rated</h2>
          <Link
            href={`/movie?type=top_rated${
              genre.length ? `&genres=${genre.join(",")}` : ""
            }`}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            See more →
          </Link>
        </div>
        <hr className="border-border" />

        {/* Content */}
        {loading ? (
          <div className="flex gap-4 overflow-hidden p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-[230px] h-[340px] rounded-xl flex-shrink-0"
              />
            ))}
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto w-full  p-2"
          >
            {movies.slice(0, 20).map((movie) => (
              <div
                key={movie.id}
                className="flex-shrink-0 w-[230px] transition-transform hover:scale-[1.02]"
              >
                <MovieCard
                  movie={movie}
                  onOpen={() => {
                    handleOpenMovie(movie);
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          isOpen={isOpen}
          onClose={() => {
            setIsOpen(false);
            setSelectedMovie(null);
          }}
          onMovieSelect={setSelectedMovie}
        />
      )}
    </>
  );
}
