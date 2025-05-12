"use client";

import { DataMap } from "@/models/dataMap";

type RepoProp = {
  information: DataMap;
};

const getDaysAgo = (updatedAt: string): string => {
  const updatedDate = new Date(updatedAt);
  const now = new Date();
  const diffMs = now.getTime() - updatedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return `Updated ${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
};

export default function Repo({ information }: RepoProp) {
  return (
    <div className="p-4 border border-gray-700 rounded-md bg-[#0D1117] hover:border-gray-500 transition duration-200 w-76 mt-2">
      <div className="flex justify-between items-start">
        <div>
          {/* Repo clickable name */}
          <a
            href={String(information.html_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 font-semibold text-base hover:underline cursor-pointer"
          >
            {information.name}
          </a>

          {/* Repo Description */}
          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
            {information.description}
          </p>
        </div>
        {/* Only showing public repos so just a public tag */}
        <span className="text-xs text-gray-500">Public</span>
      </div>

      <div className="flex items-center text-xs text-gray-500 mt-3 space-x-4">
        <div className="flex items-center space-x-1">
          
          {/* Yellow bubble next to language */}
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />

          {/* Repo Language */}
          <span>{information.language}</span>
        </div>

        {/* How many people starred this repo */}
        <div>★ {information.stargazers_count}</div>

        {/* Last commit */}
        <div>{getDaysAgo(information.updated_at as string)}</div>
      </div>
    </div>
  );
}
