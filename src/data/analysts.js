// Mock analyst data for social features

// Comments on picks
export const COMMENTS = [
  {
    id: "c1",
    pickId: "p1",
    userId: "user-bob",
    userName: "Bob",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=B&backgroundColor=6366f1",
    content: "Great call on the Bills. Their defense has been dominant at home.",
    upvotes: 12,
    upvotedBy: ["user-1", "user-2"],
    createdAt: "2025-01-17T14:30:00Z",
    replies: [
      {
        id: "c1-r1",
        userId: "analyst-001",
        userName: "SharpSide",
        userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=SS&backgroundColor=F5A623",
        content: "Thanks! The weather factor was key too. Cold games favor Buffalo.",
        upvotes: 8,
        upvotedBy: [],
        createdAt: "2025-01-17T15:00:00Z",
      }
    ]
  },
  {
    id: "c2",
    pickId: "p1",
    userId: "user-jane",
    userName: "JaneBets",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JB&backgroundColor=ec4899",
    content: "Tailed this one. Let's ride! 🔥",
    upvotes: 5,
    upvotedBy: [],
    createdAt: "2025-01-17T13:00:00Z",
    replies: []
  },
  {
    id: "c3",
    pickId: "p2",
    userId: "user-mike",
    userName: "MikeTheShark",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=MS&backgroundColor=22c55e",
    content: "Celtics are a lock at home. Good spot.",
    upvotes: 3,
    upvotedBy: [],
    createdAt: "2025-01-16T18:00:00Z",
    replies: []
  },
  {
    id: "c4",
    pickId: "p8",
    userId: "user-bob",
    userName: "Bob",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=B&backgroundColor=6366f1",
    content: "Ice Picks never misses on NHL. Following this one.",
    upvotes: 7,
    upvotedBy: [],
    createdAt: "2025-01-17T12:00:00Z",
    replies: [
      {
        id: "c4-r1",
        userId: "user-jane",
        userName: "JaneBets",
        userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JB&backgroundColor=ec4899",
        content: "Same! His puck line picks are money 💰",
        upvotes: 2,
        upvotedBy: [],
        createdAt: "2025-01-17T12:30:00Z",
      }
    ]
  },
  {
    id: "c5",
    pickId: "p14",
    userId: "user-mike",
    userName: "MikeTheShark",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=MS&backgroundColor=22c55e",
    content: "Liverpool at Anfield is always a lock. Salah is in incredible form right now ⚽",
    upvotes: 15,
    upvotedBy: [],
    createdAt: "2025-01-18T10:00:00Z",
    replies: [
      {
        id: "c5-r1",
        userId: "analyst-007",
        userName: "Pitch Profits",
        userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=PP&backgroundColor=00B140",
        content: "100%. The -1.5 Asian Handicap gives better value than the ML here.",
        upvotes: 6,
        upvotedBy: [],
        createdAt: "2025-01-18T10:30:00Z",
      }
    ]
  },
  {
    id: "c6",
    pickId: "p15",
    userId: "user-jane",
    userName: "JaneBets",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=JB&backgroundColor=ec4899",
    content: "BTTS is the way to go for these two teams. Both have leaky defenses.",
    upvotes: 8,
    upvotedBy: [],
    createdAt: "2025-01-17T14:00:00Z",
    replies: []
  },
  {
    id: "c7",
    pickId: "p21",
    userId: "user-bob",
    userName: "Bob",
    userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=B&backgroundColor=6366f1",
    content: "Messi + Suarez at home? Easy money 🐐",
    upvotes: 22,
    upvotedBy: [],
    createdAt: "2025-01-18T16:00:00Z",
    replies: [
      {
        id: "c7-r1",
        userId: "analyst-009",
        userName: "GOAT Picks",
        userAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=GP&backgroundColor=F5B5C8",
        content: "Inter Miami at home is basically free money. The GOAT effect is real 🔥",
        upvotes: 11,
        upvotedBy: [],
        createdAt: "2025-01-18T16:30:00Z",
      }
    ]
  },
];

// Reactions on picks
export const REACTIONS = {
  "p1": { fire: 24, money: 12, bullseye: 8, skull: 2, thinking: 3 },
  "p2": { fire: 18, money: 15, bullseye: 6, skull: 1, thinking: 2 },
  "p3": { fire: 31, money: 22, bullseye: 14, skull: 0, thinking: 1 },
  "p8": { fire: 15, money: 8, bullseye: 11, skull: 0, thinking: 0 },
  "p10": { fire: 9, money: 6, bullseye: 3, skull: 5, thinking: 4 },
  // Football picks
  "p14": { fire: 42, money: 28, bullseye: 15, skull: 1, thinking: 2 },
  "p15": { fire: 27, money: 18, bullseye: 12, skull: 3, thinking: 4 },
  "p16": { fire: 35, money: 24, bullseye: 19, skull: 0, thinking: 1 },
  "p18": { fire: 19, money: 14, bullseye: 8, skull: 2, thinking: 3 },
  "p21": { fire: 56, money: 45, bullseye: 22, skull: 1, thinking: 2 },
  "p22": { fire: 23, money: 17, bullseye: 11, skull: 4, thinking: 5 },
};

export const REACTION_TYPES = [
  { key: "fire", emoji: "🔥", label: "Fire" },
  { key: "money", emoji: "💰", label: "Money" },
  { key: "bullseye", emoji: "🎯", label: "Bullseye" },
  { key: "skull", emoji: "💀", label: "Fade" },
  { key: "thinking", emoji: "🤔", label: "Thinking" },
];

// Get comments for a pick
export function getCommentsForPick(pickId) {
  return COMMENTS.filter(c => c.pickId === pickId).sort((a, b) => b.upvotes - a.upvotes);
}

// Get reactions for a pick
export function getReactionsForPick(pickId) {
  return REACTIONS[pickId] || { fire: 0, money: 0, bullseye: 0, skull: 0, thinking: 0 };
}

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
  {
    id: "analyst-007",
    username: "pitchprofits",
    displayName: "Pitch Profits",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PP&backgroundColor=00B140",
    bio: "⚽ Football specialist. Premier League & La Liga expert. Both Teams To Score & Asian Handicaps.",
    joinedAt: "2024-05-12",
    isVerified: true,
    stats: {
      followers: 1567,
      following: 18,
      totalPicks: 289,
      winRate: 57.4,
      roi: 11.2,
      currentStreak: 3,
      last30Days: { wins: 19, losses: 13 },
    },
    specialties: ["EPL", "La Liga", "BTTS", "Asian Handicaps"],
    endorsements: ["analyst-001"],
    recentPicks: [
      { id: "p14", pick: "Liverpool -1.5 AH", odds: -105, units: 2, result: "W", date: "2025-01-18" },
      { id: "p15", pick: "Arsenal vs Newcastle BTTS", odds: -110, units: 1, result: "W", date: "2025-01-17" },
      { id: "p16", pick: "Real Madrid ML", odds: -150, units: 2, result: "W", date: "2025-01-16" },
      { id: "p17", pick: "Man City Over 2.5", odds: -120, units: 1, result: "L", date: "2025-01-15" },
    ],
  },
  {
    id: "analyst-008",
    username: "euroedge",
    displayName: "Euro Edge",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=EE&backgroundColor=034694",
    bio: "European football connoisseur. Covers EPL, La Liga, Serie A, Bundesliga. Corners & cards specialist.",
    joinedAt: "2024-07-20",
    isVerified: false,
    stats: {
      followers: 823,
      following: 22,
      totalPicks: 178,
      winRate: 54.5,
      roi: 9.1,
      currentStreak: 2,
      last30Days: { wins: 15, losses: 12 },
    },
    specialties: ["EPL", "La Liga", "Corners", "Cards"],
    endorsements: ["analyst-007"],
    recentPicks: [
      { id: "p18", pick: "Chelsea Over 5.5 corners", odds: -115, units: 1, result: "W", date: "2025-01-18" },
      { id: "p19", pick: "Barcelona -1", odds: +110, units: 1, result: "W", date: "2025-01-17" },
      { id: "p20", pick: "Haaland anytime scorer", odds: -130, units: 2, result: "L", date: "2025-01-16" },
    ],
  },
  {
    id: "analyst-009",
    username: "goatpicks",
    displayName: "GOAT Picks",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GP&backgroundColor=F5B5C8",
    bio: "🐐 MLS & Liga MX specialist. Following Messi, Suarez & the best in the Americas.",
    joinedAt: "2024-10-01",
    isVerified: false,
    stats: {
      followers: 445,
      following: 15,
      totalPicks: 67,
      winRate: 59.7,
      roi: 14.5,
      currentStreak: 4,
      last30Days: { wins: 11, losses: 6 },
    },
    specialties: ["MLS", "Liga MX", "Totals"],
    endorsements: [],
    recentPicks: [
      { id: "p21", pick: "Inter Miami ML", odds: -140, units: 2, result: "W", date: "2025-01-18" },
      { id: "p22", pick: "LAFC vs Galaxy Over 3.5", odds: +105, units: 1, result: "W", date: "2025-01-17" },
      { id: "p23", pick: "Seattle Sounders -0.5 AH", odds: -110, units: 1, result: "W", date: "2025-01-15" },
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
  EPL: { bg: "bg-purple-500/20", text: "text-purple-400" },
  "La Liga": { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  MLS: { bg: "bg-pink-500/20", text: "text-pink-400" },
  "Liga MX": { bg: "bg-emerald-500/20", text: "text-emerald-400" },
  BTTS: { bg: "bg-lime-500/20", text: "text-lime-400" },
  "Asian Handicaps": { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  Corners: { bg: "bg-teal-500/20", text: "text-teal-400" },
  Cards: { bg: "bg-red-500/20", text: "text-red-400" },
  Props: { bg: "bg-purple-500/20", text: "text-purple-400" },
  Spreads: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
  Totals: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  Underdogs: { bg: "bg-pink-500/20", text: "text-pink-400" },
  "Live Betting": { bg: "bg-violet-500/20", text: "text-violet-400" },
  "Puck Lines": { bg: "bg-sky-500/20", text: "text-sky-400" },
  F5: { bg: "bg-amber-500/20", text: "text-amber-400" },
  "Run Lines": { bg: "bg-rose-500/20", text: "text-rose-400" },
};
