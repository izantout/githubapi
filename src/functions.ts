"use client";

export class APIHandler {

/**
 * Gets general public data about a GitHub user by their username
 * Filters and returns only string or number fields in a flat object map
 * 
 * @param {string} username - The GitHub username to search for
 * @returns {Promise<Record<string, string | number>>} - A map of user details
 */
  async searchForUser(
    username: string
  ): Promise<Record<string, string | number>> {
    const res = await fetch(`https://api.github.com/users/${username}`);
    console.log(res);
    if (!res.ok) {
      throw new Error(
        `HTTP error! status: ${res.status} for fetching general data`
      );
    }

    const data = await res.json();
    const generalMap: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string" || typeof value === "number") {
        generalMap[key] = value;
      }
    }

    return generalMap;
  }

/**
 * Fetches repository data for a user using their `repos_url` from generalMap
 * Filters and returns an array of simplified repo objects with only string/number fields
 * 
 * @param {Record<string, string | number>} generalMap - The general user data containing the `repos_url`
 * @returns {Promise<Record<string, string | number>[]>} - An array of cleaned-up repo objects
 */
  async getRepos(
    generalMap: Record<string, string | number>
  ): Promise<Record<string, string | number>[]> {
    const repRes = await fetch(generalMap.repos_url as string);
    if (!repRes.ok) {
      throw new Error(
        `HTTP error! status: ${repRes.status} for fetching repo data`
      );
    }

    const repData = await repRes.json();
    const repoMap: Record<string, string | number>[] = [];

    for (const item of repData) {
      if (typeof item === "object" && item !== null) {
        const map: Record<string, string | number> = {};
        for (const [key, value] of Object.entries(item)) {
          if (typeof value === "string" || typeof value === "number") {
            map[key] = value;
          }
        }
        repoMap.push(map);
      }
    }
    return repoMap;
  }

/**
 * Formats a raw string response from the HuggingFace LLM to be more readable
 * Adds line breaks, bolds section headers, and highlights list items and summaries
 * 
 * @param {string} text - The raw text output from the HuggingFace LLM
 * @returns {string} - A cleaned and structured version of the text
 */
  beautifyLLMResponse(text: string) {
    if (!text || typeof text !== "string") return "";

    const lines = text
      .replace(/([.?!])\s+(?=[A-Z])/g, "$1\n")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const formattedLines = lines.map((line) => {
      if (
        /^(In summary|Summary|Conclusion|Overall|In terms of|Comparison|Final thoughts|Key points)/i.test(
          line
        )
      ) {
        return `\n**${line}**`;
      }

      if (/^\d+[\).]/.test(line)) {
        return `\n${line}`;
      }

      if (/^[-*]\s/.test(line)) {
        return `- ${line.replace(/^[-*]\s*/, "")}`;
      }

      if (/:\s/.test(line) && line.length < 150) {
        const [label, rest] = line.split(/:\s(.+)/);
        return `- **${label.trim()}**: ${rest.trim()}`;
      }

      return `${line}`;
    });

    return formattedLines.join("\n").trim();
  }
}
