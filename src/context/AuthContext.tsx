import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, isSupabaseEnabled } from "../lib/supabase";

export type AuthUser = {
  fullName?: string;
  email?: string;
} | null;

type AuthContextValue = {
  user: AuthUser;
  loading: boolean;
  supabaseEnabled: boolean;
  signOut: () => Promise<void>;
  refresh: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapSession(session: Session | null): AuthUser {
  if (!session?.user) {
    return null;
  }
  const meta = session.user.user_metadata || {};
  return {
    fullName: (meta.full_name as string) || (meta.fullName as string) || "",
    email: session.user.email || "",
  };
}

function readLocalUser(): AuthUser {
  try {
    const raw = localStorage.getItem("loggedInUser");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { loggedIn?: boolean; fullName?: string; email?: string };
    return parsed && parsed.loggedIn ? { fullName: parsed.fullName, email: parsed.email } : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (!active) return;
        setUser(mapSession(data.session));
        setLoading(false);
      });

      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(mapSession(session));
        setLoading(false);
      });

      return () => {
        active = false;
        sub.subscription.unsubscribe();
      };
    }

    // localStorage fallback
    setUser(readLocalUser());
    setLoading(false);

    const onStorage = () => setUser(readLocalUser());
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      supabaseEnabled: isSupabaseEnabled,
      refresh: () => setUser(readLocalUser()),
      signOut: async () => {
        if (supabase) {
          await supabase.auth.signOut();
        } else {
          localStorage.removeItem("loggedInUser");
          setUser(null);
        }
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
