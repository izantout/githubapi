"use client";

import { useState } from "react";

export default function SearchPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState("");
  const [showData, setShowData] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  /*
  When pressed:
    - show the loading icon
    - set data and show it after 2s
    - dont show the laoding icon after 2s
    - dont show the search after 2s
  */
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setData("This works!");
      setLoading(false);
      setShowData(true);
      setShowSearch(false);
    }, 2000);
  };

  /*
  When pressed:
    - show the search input field 
    - dont show the old search data 
    - dont show the loading icon
  */
  const handleNewSearch = () => {
    setShowSearch(true);
    setShowData(false);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-100 px-4">
      {/* Input field */}
      {showSearch && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter the username"
          className="w-full max-w-md border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
        />
      )}

      {/* Search Button */}
      {showSearch && (
        <button
          onClick={handleSearch}
          className="w-full max-w-md bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          Search
        </button>
      )}

      {/* New Search Button */}
      {!showSearch && (
        <button
          onClick={handleNewSearch}
          className="w-full max-w-md bg-blue-600 text-white px-4 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          New Search
        </button>
      )}

      {/* Loading Icon */}
      {loading && (
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600" />
      )}
      {showData && <div className="text-black">{data}</div>}
    </div>
  );
}
