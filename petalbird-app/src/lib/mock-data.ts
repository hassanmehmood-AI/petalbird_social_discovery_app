import type { User, Conversation, Message } from "@/types";

type UserStub = Pick<User, "id" | "username" | "displayName" | "avatarUrl">;

/* ─── Discover feed users ──────────────────────────────────────────────── */
export interface FeedUser extends User {
  views: number;
  isOnline: boolean;
}

export const FEED_USERS: FeedUser[] = [
  {
    id: "u1",
    username: "alexis_j",
    displayName: "Alexis J.",
    avatarUrl: null,
    bio: "NYC based creative. Always looking for new inspiration and aesthetic spots around the city. Love genuine feedback.",
    followers: 342,
    following: 128,
    avgRating: 8.5,
    createdAt: "2024-01-01",
    views: 1200,
    isOnline: true,
  },
  {
    id: "u2",
    username: "marcus_t",
    displayName: "Marcus T.",
    avatarUrl: null,
    bio: "Fitness, tech, and travel. Just looking for honest ratings to improve my aesthetic. Let me know what you think!",
    followers: 567,
    following: 201,
    avgRating: 9.1,
    createdAt: "2024-01-02",
    views: 2400,
    isOnline: false,
  },
];

/* ─── Right-sidebar widgets ────────────────────────────────────────────── */
export const TOP_RATED = [
  { username: "sarahc",     displayName: "Sarah Connor", score: 9.8 },
  { username: "dchen",      displayName: "David Chen",   score: 9.6 },
  { username: "elena_rose", displayName: "Elena R.",     score: 9.4 },
];

/* ─── Profile page ─────────────────────────────────────────────────────── */
export interface ProfileData extends User {
  friends: number;
  photoCount: number;
  wallCount: number;
}

export const MOCK_PROFILE: ProfileData = {
  id: "u3",
  username: "elenav_style",
  displayName: "Elena Vance",
  avatarUrl: null,
  bio: "Style is a way to say who you are without having to speak.",
  followers: 842,
  following: 310,
  avgRating: 9.2,
  createdAt: "2023-06-01",
  friends: 842,
  photoCount: 42,
  wallCount: 128,
};

export const RECENT_RATINGS = [
  { name: "Mark D.",  timeAgo: "1 hour ago",  score: 9  },
  { name: "Sarah K.", timeAgo: "3 hours ago", score: 10 },
];

export const WALL_COMMENTS = [
  {
    id: "wc1",
    name: "Alex Mercer",
    timeAgo: "2h ago",
    text: "Love the new cover photo! Looks like an amazing place. Where was it taken?",
    likes: 12,
    liked: false,
  },
  {
    id: "wc2",
    name: "Jessica Chen",
    timeAgo: "5h ago",
    text: "10/10 as always! Hope you're doing well, let's catch up soon. ✨",
    likes: 4,
    liked: true,
  },
];

/* ─── Messages page ────────────────────────────────────────────────────── */
const stub = (id: string, username: string, displayName: string): UserStub => ({
  id,
  username,
  displayName,
  avatarUrl: null,
});

export const CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    with: stub("u4", "julian_r", "Julian Rossi"),
    lastMessage: "That sounds like a great plan! See you then. ✨",
    unreadCount: 0,
    updatedAt: "2024-01-17T10:42:00Z",
  },
  {
    id: "c2",
    with: stub("u3", "elenav_style", "Elena Vance"),
    lastMessage: "Did you see the new art exhibit downtown?",
    unreadCount: 0,
    updatedAt: "2024-01-16T14:00:00Z",
  },
  {
    id: "c3",
    with: stub("u5", "marcus_c", "Marcus Chen"),
    lastMessage: "Sent a photo",
    unreadCount: 0,
    updatedAt: "2024-01-15T09:00:00Z",
  },
];

export const ACTIVE_MESSAGES: Message[] = [
  {
    id: "m1",
    conversationId: "c1",
    senderId: "u4",
    content: "Hey! Are we still on for coffee later?",
    createdAt: "2024-01-17T10:30:00Z",
  },
  {
    id: "m2",
    conversationId: "c1",
    senderId: "me",
    content: "Yes! I was thinking about checking out that new place in the Arts District. ☕️",
    createdAt: "2024-01-17T10:35:00Z",
  },
  {
    id: "m3",
    conversationId: "c1",
    senderId: "u4",
    content: "That sounds like a great plan! See you then. ✨",
    createdAt: "2024-01-17T10:42:00Z",
  },
];

/* ─── Helpers ──────────────────────────────────────────────────────────── */
export function formatViews(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
