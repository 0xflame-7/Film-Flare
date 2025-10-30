import FilterButton from "@/components/layout/filterButton";
import TopRated from "@/components/layout/topRated";
import Trending from "@/components/layout/trending";
import { useState } from "react";

export default function HomePage() {
  const [filter, setFilter] = useState<string[]>([]);

  return (
    <>
      <div className="flex flex-col gap-8 p-4">
        <Trending />
      </div>
      <FilterButton setFilter={setFilter} />
      <TopRated genre={filter} />
    </>
  );
}
