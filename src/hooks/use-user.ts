"use client";

import { useEffect, useState } from "react";
import type { User as DbUser } from "@/generated/prisma";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/user/get-current-user";

interface UseUserResult {
  dbUser: DbUser | null;
  supabaseUser: SupabaseUser | null;
  loading: boolean;
  error: Error | null;
}

export function useUser(): UseUserResult {
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();

        setDbUser(currentUser.dbUser);
        setSupabaseUser(currentUser.supabaseUser);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { dbUser, supabaseUser, loading, error };
}
