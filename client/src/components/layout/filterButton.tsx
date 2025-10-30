import { useEffect, useState, useRef } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { X } from "lucide-react";

interface FilterButtonProps {
  setFilter: (filters: string[]) => void;
}

export default function FilterButton({ setFilter }: FilterButtonProps) {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/movies/genres`
        );
        const data = await res.json();
        console.log(data);
        setGenres(data.sort());
      } catch (error) {
        console.error("Failed to fetch genres", error);
      }
    };
    fetchGenres();
  }, []);

  // Horizontal scroll with mouse wheel
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current) {
        e.preventDefault();
        scrollContainerRef.current.scrollLeft += e.deltaY / 3;
      }
    };
    const container = scrollContainerRef.current;
    if (container)
      container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container?.removeEventListener("wheel", handleWheel);
  }, []);

  const handleToggle = (value: string[]) => {
    setSelectedGenres(value);
    setFilter(value);
  };

  // Sort so selected appear first
  const sortedGenres = [...genres].sort((a, b) => {
    const aSelected = selectedGenres.includes(a) ? -1 : 1;
    const bSelected = selectedGenres.includes(b) ? -1 : 1;
    if (aSelected !== bSelected) return aSelected - bSelected;
    return a.localeCompare(b);
  });

  return (
    <div className="p-4">
      <ToggleGroup
        type="multiple"
        value={selectedGenres}
        onValueChange={handleToggle}
        className="flex gap-2 overflow-x-auto w-full"
        ref={scrollContainerRef}
      >
        {sortedGenres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          return (
            <ToggleGroupItem
              key={genre}
              value={genre}
              className={`px-4 py-2 rounded-lg border whitespace-nowrap flex items-center gap-2 flex-shrink-0 transition-colors ${
                isSelected ? "bg-primary text-primary-foreground" : ""
              }`}
            >
              {isSelected && (
                <X size={16} className="ml-1 opacity-80 hover:opacity-100" />
              )}
              {genre}
            </ToggleGroupItem>
          );
        })}
      </ToggleGroup>
    </div>
  );
}
