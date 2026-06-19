export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  followers: number;
  following: number;
  avgRating: number;
  createdAt: string;
}

export interface Post {
  id: string;
  user: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  imageUrl: string;
  caption: string | null;
  avgRating: number;
  ratingCount: number;
  myRating: number | null;
  createdAt: string;
}

export interface Rating {
  id: string;
  postId: string;
  raterId: string;
  score: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
}

export interface Conversation {
  id: string;
  with: Pick<User, "id" | "username" | "displayName" | "avatarUrl">;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}
