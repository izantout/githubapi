"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import Repo from "@/components/repo";
import { APIHandler } from "@/functions";
import CustomerComparison from "@/components/comparison_table";
import Avatar from "@/components/avatar";
import GeneralButton from "@/components/generalButton";

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("tab1");
  const apiHandler = new APIHandler();
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");
  const [loading, setLoading] = useState(false);
  const [user1, setUser1] = useState<Record<string, string | number>>({});
  const [user2, setUser2] = useState<Record<string, string | number>>({});
  const [genData, setGenData] = useState<Record<string, string | number>>({});
  const [repoData, setRepoData] = useState<Record<string, string | number>[]>(
    []
  );
  const [showData, setShowData] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      const generalMap: Record<string, string | number> =
        await apiHandler.searchForUser(username);
      setGenData(generalMap);

      const repoMap: Record<string, string | number>[] =
        await apiHandler.getRepos(generalMap);
      setRepoData(repoMap);

      setShowData(true);
      setShowSearch(false);
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert(
        `ERROR: Fetch failed! Please make sure the username is written correctly`
      );
      setInput("");
      setLoading(false);
    }
  };

  const handleCompare = async (username1: string, username2: string) => {
    setLoading(true);
    try {
      const firstUser: Record<string, string | number> =
        await apiHandler.searchForUser(username1);
      const secondUser: Record<string, string | number> =
        await apiHandler.searchForUser(username2);

      setUser1(firstUser);
      setUser2(secondUser);
      setShowData(true);
    } catch (err) {
      console.log(err);
      alert(
        `ERROR: Fetch failed! Please make sure the username is written correctly`
      );
      setInput("");
      setInput2("");
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setInput("");
    setShowSearch(true);
    setShowData(false);
    setLoading(false);
  };

  return (
    <div className="bg-gray-100">
      {/* Tabs clicker */}
      <div className="flex space-x-2 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("tab1")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === "tab1"
              ? "bg-white shadow text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Find user
        </button>
        <button
          onClick={() => setActiveTab("tab2")}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === "tab2"
              ? "bg-white shadow text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Compare users
        </button>
      </div>

      <div className="mt-6">
        {/* Tab 1 Find user */}
        {activeTab === "tab1" && (
          <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-100 px-4 p-10">
            {showSearch && (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter the username"
                className="w-full max-w-md border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-black"
              />
            )}

            {showSearch && (
              <GeneralButton
              text="Search"
              onClick={() => handleSearch(input)}
              />
            )}

            {!showSearch && (
              <GeneralButton
              text="New Search"
              onClick={() => handleNewSearch()}
              />
            )}

            {showData && (
              <div className="w-full max-w-6xl mx-auto bg-[#0D0F14] rounded-2xl shadow-lg overflow-hidden p-6 md:p-10 space-y-6 text-white">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:w-1/3">
                    <Avatar
                      src={genData.avatar_url as string}
                      alt="User Avatar"
                    />
                    <div>
                      <p className="text-2xl font-bold">{genData.name}</p>
                      <p className="text-gray-400 text-lg">{genData.login}</p>
                    </div>
                    <p className="text-gray-300 text-sm">{genData.bio}</p>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <a
                          href={String(genData.followers_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-semibold text-white"
                        >
                          {genData.followers}
                        </a>
                        <span>followers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a
                          href={String(genData.following_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-semibold text-white"
                        >
                          {genData.following}
                        </a>
                        <span>following</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <a
                          href={String(genData.repos_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline font-semibold text-white"
                        >
                          {genData.public_repos}
                        </a>
                        <span>repos</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-[80%] overflow-y-auto max-h-[70vh] pr-2">
                    {repoData.map((item, index) => (
                      <Repo key={index} information={item} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600" />
            )}
          </div>
        )}
        {/* Tab 2 Compare users */}
        {activeTab === "tab2" && (
          <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-100 px-4 p-10">
            {showSearch && (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter username 1"
                className="w-full max-w-md border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-black"
              />
            )}

            {showSearch && (
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Enter username 2"
                className="w-full max-w-md border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-black"
              />
            )}

            {showSearch && (
              <GeneralButton
                text="Compare"
                onClick={() => handleCompare(input, input2)}
              />
            )}

            {!showSearch && (
              <GeneralButton
                text="New Search"
                onClick={() => handleNewSearch()}
              />
            )}

            {showData && <CustomerComparison user1={user1} user2={user2} />}
          </div>
        )}
      </div>
    </div>
  );
}
