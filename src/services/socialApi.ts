// Follows and notifications have no equivalent in the real backend contract yet
// (see src/services/mockData.ts), so this service is always mock-backed — it is
// NOT toggled by VITE_USE_MOCKS like src/services/api.ts. When the real backend
// grows these features, fold this into api.ts and delete this file.
import type { User } from '../types/api';
import {
  mockUsers,
  mockFollows,
  mockNotifications,
  mockNextIds,
  persistMockData,
  type AppNotification,
  type NotificationType,
} from './mockData';

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function currentUsername(): string | null {
  const token = localStorage.getItem('spineit_access_token');
  if (!token?.startsWith('mock-')) return null;
  const id = Number(token.replace('mock-', ''));
  return mockUsers.find((u) => u.id === id)?.username ?? null;
}

function notify(recipient: string, actor: string, type: NotificationType, reviewId?: number) {
  if (recipient === actor) return;
  const notification: AppNotification = {
    id: mockNextIds.notification++,
    recipient,
    actor,
    type,
    reviewId,
    read: false,
    created_at: new Date().toISOString(),
  };
  mockNotifications.push(notification);
  persistMockData();
}

export const socialApi = {
  getUserByUsername: async (username: string): Promise<User> => {
    const user = mockUsers.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!user) throw new Error('User not found');
    return delay(user);
  },

  isFollowing: async (username: string): Promise<boolean> => {
    const me = currentUsername();
    if (!me) return delay(false);
    return delay(mockFollows.some((f) => f.follower === me && f.following === username));
  },

  followUser: async (username: string): Promise<void> => {
    const me = currentUsername();
    if (!me || me === username) return delay(undefined);
    if (mockFollows.some((f) => f.follower === me && f.following === username)) return delay(undefined);
    mockFollows.push({ id: mockNextIds.follow++, follower: me, following: username, created_at: new Date().toISOString() });
    persistMockData();
    notify(username, me, 'follow');
    return delay(undefined);
  },

  unfollowUser: async (username: string): Promise<void> => {
    const me = currentUsername();
    if (!me) return delay(undefined);
    const index = mockFollows.findIndex((f) => f.follower === me && f.following === username);
    if (index !== -1) {
      mockFollows.splice(index, 1);
      persistMockData();
    }
    return delay(undefined);
  },

  getFollowerCount: async (username: string): Promise<number> =>
    delay(mockFollows.filter((f) => f.following === username).length),

  getFollowingCount: async (username: string): Promise<number> =>
    delay(mockFollows.filter((f) => f.follower === username).length),

  getFollowingUsernames: async (username: string): Promise<string[]> =>
    delay(mockFollows.filter((f) => f.follower === username).map((f) => f.following)),

  notifyLike: (recipient: string, actor: string, reviewId: number) => notify(recipient, actor, 'like', reviewId),
  notifyComment: (recipient: string, actor: string, reviewId: number) => notify(recipient, actor, 'comment', reviewId),

  getNotifications: async (): Promise<AppNotification[]> => {
    const me = currentUsername();
    if (!me) return delay([]);
    return delay(
      [...mockNotifications]
        .filter((n) => n.recipient === me)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    );
  },

  markAllNotificationsRead: async (): Promise<void> => {
    const me = currentUsername();
    if (!me) return delay(undefined);
    mockNotifications.forEach((n) => {
      if (n.recipient === me) n.read = true;
    });
    persistMockData();
    return delay(undefined);
  },
};
