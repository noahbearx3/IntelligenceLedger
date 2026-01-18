// Mock analyst data for social features

export const ANALYSTS = [
  {
    id: "analyst-001",
    username: "sharpside",
    displayName: "SharpSide",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SS&backgroundColor=F5A623",
    bio: "Former Vegas oddsmaker. NFL & NBA specialist. Data-driven picks only.",
    joinedAt: "2024-03-15",
    isVerified: true,
    stats: {
      followers: 2847,
      following: 12,
      totalPicks: 342,
      winRate: 58.2,
      roi: 12.4,
      currentStreak: 4, // positive = wins, negative = losses
      last30Days: { wins: 18, losses: 12 },
    },
    specialties: ["NFL", "NBA", "Spreads"],
    endorsements: ["analyst-002", "analyst-004"],
    recentPicks: [
      { id: "p1", pick: "Bills -6.5", odds: -110, units: 2, result: "W", date: "2025-01-17" },
      { id: "p2", pick: "Celtics ML", odds: -145, units: 1, result: "W", date: "2025-01-16" },
      { id: "p3", pick: "Chiefs -3", odds: -105, units: 2, result: "W", date: "2025-01-15" },
      { id: "p4", pick: "Lakers +4.5", odds: -110, units: 1, result: "L", date: "2025-01-14" },
    ],
  },
  {
    id: "analyst-002",
    username: "propking",
    displayName: "The Prop King",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PK&backgroundColor=34C759",
    bio: "Player props are my kingdom. NBA & NFL props daily. Quality over quantity.",
    joinedAt: "2024-01-22",
    isVerified: true,
    stats: {
      followers: 1923,
      following: 8,
      totalPicks: 567,
      winRate: 54.8,
      roi: 8.7,
      currentStreak: -2,
      last30Days: { wins: 22, losses: 19 },
    },
    specialties: ["Props", "NBA", "NFL"],
    endorsements: ["analyst-001"],
    recentPicks: [
      { id: "p5", pick: "Mahomes O285.5 yds", odds: -115, units: 1, result: "L", date: "2025-01-17" },
      { id: "p6", pick: "Tatum O27.5 pts", odds: -110, units: 2, result: "L", date: "2025-01-16" },
      { id: "p7", pick: "Allen O2.5 TDs", odds: +120, units: 1, result: "W", date: "2025-01-15" },
    ],
  },
  {
    id: "analyst-003",
    username: "icepicks",
    displayName: "Ice Picks",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=IP&backgroundColor=007AFF",
    bio: "NHL specialist. 10+ years handicapping hockey. Puck lines & totals.",
    joinedAt: "2024-06-01",
    isVerified: true,
    stats: {
      followers: 892,
      following: 5,
      totalPicks: 234,
      winRate: 61.1,
      roi: 15.2,
      currentStreak: 6,
      last30Days: { wins: 14, losses: 8 },
    },
    specialties: ["NHL", "Totals", "Puck Lines"],
    endorsements: [],
    recentPicks: [
      { id: "p8", pick: "Bruins -1.5", odds: +145, units: 1, result: "W", date: "2025-01-17" },
      { id: "p9", pick: "Over 6.5 (TOR/MTL)", odds: -110, units: 2, result: "W", date: "2025-01-16" },
    ],
  },
  {
    id: "analyst-004",
    username: "underdogszn",
    displayName: "Underdog SZN",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=UD&backgroundColor=FF3B30",
    bio: "Finding value in the dogs. Plus money specialist. Fade the public.",
    joinedAt: "2024-08-10",
    isVerified: false,
    stats: {
      followers: 456,
      following: 24,
      totalPicks: 89,
      winRate: 42.7,
      roi: 18.3, // High ROI despite lower win rate due to plus odds
      currentStreak: 1,
      last30Days: { wins: 8, losses: 11 },
    },
    specialties: ["Underdogs", "NFL", "MLB"],
    endorsements: ["analyst-001"],
    recentPicks: [
      { id: "p10", pick: "Jets ML", odds: +180, units: 1, result: "W", date: "2025-01-17" },
      { id: "p11", pick: "Guardians ML", odds: +155, units: 1, result: "L", date: "2025-01-14" },
    ],
  },
  {
    id: "analyst-005",
    username: "mlbmaven",
    displayName: "MLB Maven",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=MM&backgroundColor=FF9500",
    bio: "Baseball is life. F5 lines, run lines, totals. Analytics-driven.",
    joinedAt: "2024-02-28",
    isVerified: true,
    stats: {
      followers: 1245,
      following: 15,
      totalPicks: 412,
      winRate: 56.3,
      roi: 9.8,
      currentStreak: 2,
      last30Days: { wins: 0, losses: 0 }, // Offseason
    },
    specialties: ["MLB", "F5", "Run Lines"],
    endorsements: ["analyst-002", "analyst-003"],
    recentPicks: [], // Offseason
  },
  {
    id: "analyst-006",
    username: "livebetlou",
    displayName: "Live Bet Lou",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=LL&backgroundColor=AF52DE",
    bio: "In-game specialist. Live betting is where the edge is. Quick triggers.",
    joinedAt: "2024-09-05",
    isVerified: false,
    stats: {
      followers: 678,
      following: 31,
      totalPicks: 156,
      winRate: 52.6,
      roi: 6.4,
      currentStreak: -1,
      last30Days: { wins: 16, losses: 14 },
    },
    specialties: ["Live Betting", "NBA", "NFL"],
    endorsements: [],
    recentPicks: [
      { id: "p12", pick: "Warriors ML (Live +240)", odds: +240, units: 0.5, result: "L", date: "2025-01-17" },
      { id: "p13", pick: "Eagles -3 (Live)", odds: -105, units: 1, result: "W", date: "2025-01-16" },
    ],
  },
];

// Helper functions
export function getAnalystById(id) {
  return ANALYSTS.find(a => a.id === id);
}

export function getAnalystByUsername(username) {
  return ANALYSTS.find(a => a.username === username);
}

export function getTopAnalysts(sortBy = "followers", limit = 10) {
  const sorted = [...ANALYSTS].sort((a, b) => {
    switch (sortBy) {
      case "followers":
        return b.stats.followers - a.stats.followers;
      case "winRate":
        return b.stats.winRate - a.stats.winRate;
      case "roi":
        return b.stats.roi - a.stats.roi;
      case "streak":
        return b.stats.currentStreak - a.stats.currentStreak;
      default:
        return b.stats.followers - a.stats.followers;
    }
  });
  return sorted.slice(0, limit);
}

export function getRisingAnalysts(limit = 5) {
  // "Rising" = good win rate but lower follower count
  return [...ANALYSTS]
    .filter(a => a.stats.followers < 1000 && a.stats.winRate > 50)
    .sort((a, b) => b.stats.winRate - a.stats.winRate)
    .slice(0, limit);
}

// Format helpers
export function formatStreak(streak) {
  if (streak === 0) return "—";
  if (streak > 0) return `${streak}W 🔥`;
  return `${Math.abs(streak)}L`;
}

export function formatWinRate(rate) {
  return `${rate.toFixed(1)}%`;
}

export function formatROI(roi) {
  return roi >= 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`;
}

export function formatFollowers(count) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

// Specialty colors
export const SPECIALTY_COLORS = {
  NFL: { bg: "bg-green-500/20", text: "text-green-400" },
  NBA: { bg: "bg-orange-500/20", text: "text-orange-400" },
  NHL: { bg: "bg-blue-500/20", text: "text-blue-400" },
  MLB: { bg: "bg-red-500/20", text: "text-red-400" },
  Props: { bg: "bg-purple-500/20", text: "text-purple-400" },
  Spreads: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  Totals: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Underdogs: { bg: "bg-pink-500/20", text: "text-pink-400" },
  "Live Betting": { bg: "bg-violet-500/20", text: "text-violet-400" },
  "Puck Lines": { bg: "bg-sky-500/20", text: "text-sky-400" },
  F5: { bg: "bg-amber-500/20", text: "text-amber-400" },
  "Run Lines": { bg: "bg-rose-500/20", text: "text-rose-400" },
};
