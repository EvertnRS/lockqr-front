export type UserRole = "admin" | "user";

export type User = {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
};