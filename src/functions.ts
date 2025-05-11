"use client";

export class APIHandler {
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

  async getRepos(
    generalMap: Record<string, string | number>
  ) : Promise<Record<string, string | number>[]> {
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
}
