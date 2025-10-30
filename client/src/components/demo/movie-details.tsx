import type { Movie } from "@/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MovieDetailsProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export default function MovieDetails({
  isOpen,
  onClose,
  movie,
}: MovieDetailsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-4xl p-8 rounded-xl shadow-lg bg-white">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster + Price + Buy */}
          <div className="flex flex-col items-center md:items-start">
            <img
              src={movie.poster_path}
              alt={movie.title}
              className="w-52 h-72 object-cover rounded-md shadow-md"
            />

            <div className="mt-4 text-center md:text-left space-y-2">
              <p className="font-semibold text-lg">$19.00</p>
              <Button
                variant="outline"
                className="rounded-full px-6 py-1 border-2 border-black hover:bg-black hover:text-white transition"
              >
                BUY
              </Button>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-semibold text-black">
                  {movie.title}
                </h2>
                <p className="text-blue-600 text-sm font-medium mt-1">
                  {movie.genres?.join(" | ") ?? "Action & Adventure"}
                </p>
              </div>

              <p className="text-blue-700 font-semibold text-sm">
                {movie.rating_avg.toFixed(1)}{" "}
                <span className="text-black">/ 10</span>
              </p>
            </div>

            {/* Overview */}
            <div className="mt-5">
              <p className="font-semibold text-black">About the Movie</p>
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                {movie.overview}
              </p>
            </div>

            {/* Crew Section */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-6 text-sm">
              <div>
                <p className="font-semibold text-black">Actors</p>
                {movie.actors?.slice(0, 5).map((actor, i) => (
                  <p
                    key={i}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {actor}
                  </p>
                ))}
                {movie.actors?.length > 5 && (
                  <p className="text-blue-500 hover:underline cursor-pointer">
                    More
                  </p>
                )}
              </div>

              {/* <div>
                <p className="font-semibold text-black">Director</p>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  {movie.director}
                </p>
              </div> */}

              <div>
                <p className="font-semibold text-black">Producers</p>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  Kathleen Kennedy
                </p>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  Ram Bergman
                </p>
              </div>

              <div>
                <p className="font-semibold text-black">Screenwriter</p>
                <p className="text-blue-600 hover:underline cursor-pointer">
                  Rian Johnson
                </p>
              </div>
            </div>

            {/* Watch Trailer */}
            <div className="flex justify-end mt-6">
              <Button
                variant="default"
                className="rounded-full bg-black text-white px-5 py-2 flex items-center gap-2 hover:bg-gray-800 transition"
                onClick={() =>
                  window.open(
                    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                    "_blank"
                  )
                }
              >
                ▶ WATCH TRAILER
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
