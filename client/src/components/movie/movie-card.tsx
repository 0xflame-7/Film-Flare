import { Card } from "@/components/ui/card";
import type { Movie } from "@/types";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

interface MovieCardProps {
  movie: Movie;
  onOpen: () => void;
}

export default function MovieCard({ movie, onOpen }: MovieCardProps) {
  const [showButton, setShowButton] = useState<boolean>(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerZoneX = rect.width * 0.25;
    const centerZoneY = rect.height * 0.25;

    const inCenter =
      x > centerZoneX &&
      x < rect.width - centerZoneX &&
      y > centerZoneY &&
      y < rect.height - centerZoneY;

    if (inCenter) {
      if (!hoverTimer.current) {
        hoverTimer.current = setTimeout(() => setShowButton(true), 350);
      }
    } else {
      clearHoverTimer();
    }
  };

  const clearHoverTimer = () => {
    if (hoverTimer.current) {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = null;
    }
    setTimeout(() => setShowButton(false), 100);
  };

  useEffect(() => {
    return () => clearHoverTimer();
  }, []);

  // 232 × 342
  return (
    <Card
      className="relative min-w-[230px] min-h-[340px] overflow-hidden rounded-2xl shadow-md group"
      onMouseMove={handleMouseMove}
      onMouseLeave={clearHoverTimer}
      onClick={onOpen}
    >
      {/* Poster Image */}
      <img
        src={movie.poster_path}
        alt={movie.original_title}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
          showButton ? "scale-105 brightness-50" : "brightness-100"
        }`}
        loading="lazy"
      />

      {/* Overlay (gradient + info) */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          showButton ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span className="text-xs text-foreground font-semibold">
            {movie.avg_rating.toFixed(2)}
          </span>
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 w-full p-4 text-white z-10">
          <h2 className="text-base font-semibold truncate max-w-[150px]">
            {movie.original_title}
          </h2>
          <p className="text-xs text-gray-300 line-clamp-2 mt-1 leading-snug">
            {movie.overview}
          </p>
        </div>
      </div>

      {/* Hover Button */}
      <div
        className={`absolute inset-0 flex items-center justify-center z-20 transition-all duration-500 ${
          showButton
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <Button
          size="sm"
          className="px-4 py-1 transition-transform duration-300 hover:border-2"
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
}
