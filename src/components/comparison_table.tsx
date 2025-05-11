import React from "react";
import Avatar from "./avatar";

type Props = {
  user1: Record<string, string | number>;
  user2: Record<string, string | number>;
};

export default function CustomerComparison({ user1, user2 }: Props) {
  const data = [
    {
      data: "Public Repos",
      user1: user1.public_repos,
      user2: user2.public_repos,
    },
    {
      data: "Commits",
      user1: user1.public_repos,
      user2: user2.public_repos,
    },
    {
      data: "test",
      user1: user1.public_repos,
      user2: user2.public_repos,
    },
    
  ];
  return (
    <div className="bg-[#0d1117] text-white p-6 rounded-xl shadow-lg w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">
        Github user comparison
      </h2>

      {/* Top Section - Avatars and Names */}
      <div className="grid grid-cols-2 gap-8 items-center mb-10">
        <div className="flex flex-col items-center">
          <Avatar src={user1.avatar_url as string} alt="User 1 Avatar" />
          <span className="text-lg font-semibold text-center">
            {user1.name}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <Avatar src={user2.avatar_url as string} alt="User 2 Avatar" />
          <span className="text-lg font-semibold text-center">
            {user2.name}
          </span>
        </div>
      </div>

      {/* Bottom Section - Yearly Data Comparison */}
      <div className="grid grid-cols-3 gap-6 text-sm font-medium">
        {data.map((item) => (
          <React.Fragment key={item.data}>
            {/* Company A Bar */}
            <div className="flex items-center justify-end gap-2">
              <div className="w-full bg-[#30363d] h-4 rounded-full overflow-hidden">
                <div
                  className="bg-[#238636] h-full"
                  style={{ width: `${item.user1}*10%` }}
                />
              </div>
              <span className="text-sm">{item.user1}</span>
            </div>

            {/* Year */}
            <div className="flex items-center justify-center text-white font-semibold">
              {item.data}
            </div>

            {/* Company B Bar */}
            <div className="flex items-center justify-start gap-2">
              <span className="text-sm">{item.user2}%</span>
              <div className="w-full bg-[#30363d] h-4 rounded-full overflow-hidden">
                <div
                  className="bg-[#1f6feb] h-full"
                  style={{ width: `${item.user2}*10%` }}
                />
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
