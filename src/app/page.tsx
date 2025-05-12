"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import Repo from "@/components/repo";
import { APIHandler } from "@/functions";
import CustomerComparison from "@/components/comparison_table";
import Avatar from "@/components/avatar";
import GeneralButton from "@/components/generalButton";

// Component for searching and comparing GitHub users
export default function SearchPage() {
  const [activeTab, setActiveTab] = useState("tab1"); // Tracks current active tab
  const apiHandler = new APIHandler();

  // Input fields for usernames
  const [input, setInput] = useState("");
  const [input2, setInput2] = useState("");

  // UI and loading state management
  const [loading, setLoading] = useState(false);
  const [showData, setShowData] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [showAICompare, setShowAICompare] = useState(false);
  const [AILoading, setAILoading] = useState(false);
  const [AIData, setAIData] = useState(false);

  // Data for displaying user and repo info
  const [genData, setGenData] = useState<Record<string, string | number>>({});
  const [repData, setRepData] = useState<Record<string, string | number>[]>([]);
  const [user1, setUser1] = useState<Record<string, string | number>>({});
  const [user2, setUser2] = useState<Record<string, string | number>>({});
  const [AIOutput, setOutput] = useState("");

  // Fetch and display data for a single user
  const handleSearch = async (username: string) => {
    setLoading(true);
    try {
      const generalMap = await apiHandler.searchForUser(username);
      setGenData(generalMap);

      const repoMap = await apiHandler.getRepos(generalMap);
      setRepData(repoMap);

      setShowData(true);
      setShowSearch(false);
    } catch (err) {
      console.error(err);
      alert(
        "ERROR: Fetch failed! Please make sure the username is written correctly"
      );
      setInput("");
    } finally {
      setLoading(false);
    }
  };

  // Fetch and display data for comparing two users
  const handleCompare = async (username1: string, username2: string) => {
    setLoading(true);
    try {
      const firstUser = await apiHandler.searchForUser(username1);
      const secondUser = await apiHandler.searchForUser(username2);

      setUser1(firstUser);
      setUser2(secondUser);
      setShowData(true);
      setShowAICompare(true);
      setShowSearch(false);
    } catch (err) {
      console.error(err);
      alert(
        "ERROR: Fetch failed! Please make sure the username is written correctly"
      );
      setInput("");
      setInput2("");
    } finally {
      setLoading(false);
    }
  };

  // Initiates AI-based comparison of two users
  const handleAICompare = async (
    user1: Record<string, string | number>,
    user2: Record<string, string | number>
  ) => {
    const prompt =
      "Please compare these 2 users and give me a summary of their profile. Please go into their repos and calculate the commit frequency. Please make the comparison easy to read on a readers eye";

    const formData = new FormData();
    formData.append("user1", JSON.stringify(user1));
    formData.append("user2", JSON.stringify(user2));
    formData.append("prompt", prompt);

    try {
      const res = await fetch("/api/hf?type=compare", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Compare API response:", data);

      if (!res.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      const formatted = apiHandler.beautifyLLMResponse(data.message);
      setOutput(formatted || "No output from model.");
      setAIData(true);
    } catch (err) {
      console.error("Request failed:", err);
      alert("Something went wrong while contacting the AI.");
    } finally {
      setAILoading(false);
    }
  };

  // Reset state for a new search
  const handleNewSearch = () => {
    setInput("");
    setInput2("");
    setShowSearch(true);
    setShowData(false);
    setAIData(false);
    setAILoading(false);
    setShowAICompare(false);
  };

  return (
    <div className="bg-gray-100">
      {/* Tabs clicker */}
      <div className="flex space-x-2 rounded-lg p-1 w-fit">
        <button
          onClick={() => {
            setShowData(false);
            setShowSearch(true);
            setInput("");
            setInput2("");
            setAIData(false);
            setAILoading(false);
            setShowAICompare(false);
            setActiveTab("tab1");
          }}
          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeTab === "tab1"
              ? "bg-white shadow text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          Find user
        </button>
        <button
          onClick={() => {
            setShowData(false);
            setShowSearch(true);
            setInput("");
            setInput2("");
            setAIData(false);
            setAILoading(false);
            setShowAICompare(false);
            setActiveTab("tab2");
          }}
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
            {/* Username input field */}
            {showSearch && (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter the username"
                className="w-full max-w-md border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-black"
              />
            )}

            {/* Search button */}
            {showSearch && (
              <GeneralButton
                text="Search"
                onClick={() => handleSearch(input)}
              />
            )}

            {/* New Search button */}
            {!showSearch && (
              <GeneralButton
                text="New Search"
                onClick={() => handleNewSearch()}
              />
            )}

            {/* Main Data Block */}
            {showData && (
              <div className="w-full max-w-6xl mx-auto bg-[#0D0F14] rounded-2xl shadow-lg overflow-hidden p-6 md:p-10 space-y-6 text-white">
                <div className="flex flex-col md:flex-row gap-10">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:w-1/3">
                    {/* Picture */}
                    <Avatar
                      src={genData.avatar_url as string}
                      alt="User Avatar"
                    />
                    {/* Name and Username */}
                    <div>
                      <p className="text-2xl font-bold">{genData.name}</p>
                      <p className="text-gray-400 text-lg">{genData.login}</p>
                    </div>

                    {/* Bio */}
                    <p className="text-gray-300 text-sm">{genData.bio}</p>

                    {/* Followers + Following + Public Repo */}
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm text-gray-300">
                      <div className="flex items-center space-x-1">

                        {/* Logo */}
                        <Users className="w-4 h-4 text-gray-400" />

                        {/* Followers */}
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

                      {/* Following */}
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

                      {/* Public Repos */}
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

                  {/* All public repos */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:w-[80%] overflow-y-auto max-h-[70vh] pr-2">
                    {repData.map((item, index) => (
                      <Repo key={index} information={item} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading Icon */}
            {loading && (
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600" />
            )}
          </div>
        )}

        {/* Tab 2 Compare users */}
        {activeTab === "tab2" && (
          <div className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-100 px-4 p-10">
            
            {/* Username 1 Input */}
            {showSearch && (
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter username 1"
                className="w-full max-w-md border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-black"
              />
            )}

            {/* Username 2 Input */}
            {showSearch && (
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                placeholder="Enter username 2"
                className="w-full max-w-md border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500 text-black"
              />
            )}

            {/* Compare Button */}
            {showSearch && (
              <GeneralButton
                text="Compare"
                onClick={() => handleCompare(input, input2)}
              />
            )}

            {/* New Search Button */}
            {!showSearch && (
              <GeneralButton
                text="New Search"
                onClick={() => handleNewSearch()}
              />
            )}

            {/* AI Compare Button */}
            {showAICompare && (
              <GeneralButton
                text="AI Compare"
                onClick={() => {
                  setShowData(false);
                  setShowAICompare(false);
                  setAILoading(true);
                  handleAICompare(user1, user2);
                }}
              />
            )}

            {/* AI result Note */}
            {AILoading && (
              <div className="flex flex-col items-center space-y-4 mt-4">
                <p className="text-center text-sm text-gray-600">
                  Please wait! I&apos;m using a free AI model. It can take
                  between 1 and 3 minutes. If it fails, its because of vercel
                  time constraint of 60 seconds. Please try again for it to
                  work!
                </p>
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600" />
              </div>
            )}

            {/* AI Data Section */}
            {AIData && (
              <div className="text-black whitespace-pre-line font-mono text-sm">
                {AIOutput}
              </div>
            )}

            {/* User Comparison Section */}
            {showData && <CustomerComparison user1={user1} user2={user2} />}
          </div>
        )}
      </div>
    </div>
  );
}
