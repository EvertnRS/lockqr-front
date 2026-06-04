import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

import { api } from "../service/api";
import type { User } from "../@types/User";

type LoginResponse = {
  token: string;
  user: User;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

function getStoredAuth() {
  if (typeof window === "undefined") {
    return { token: null, user: null as User | null };
  }

  try {
    const storedToken = localStorage.getItem("@lockqr:token");
    const storedUser = localStorage.getItem("@lockqr:user");

    return {
      token: storedToken,
      user: storedUser ? (JSON.parse(storedUser) as User) : null,
    };
  } catch {
    return { token: null, user: null as User | null };
  }
}

const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const storedAuth = getStoredAuth();

  const [user, setUser] = useState<User | null>(storedAuth.user);
  const [token, setToken] = useState<string | null>(storedAuth.token);

  const isAuthenticated = !!user && !!token;

  async function login(username: string, password: string) {
    const response = await api.post<LoginResponse>("/auth/login", {
      username,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("@lockqr:token", token);
    localStorage.setItem("@lockqr:user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("@lockqr:token");
    localStorage.removeItem("@lockqr:user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}