import type { User as DbUser } from "@/generated/prisma";
import prisma from "../prisma/prisma";
import { createClient } from "../supabase/server";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { revalidatePath } from "next/cache";

export type currentUser = {
  dbUser: DbUser;
  supabaseUser: SupabaseUser;
};

export async function getCurrentUser(): Promise<currentUser> {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
    error,
  } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    toast.error("You must be logged in to access this page.");
    revalidatePath("/", "layout");
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: supabaseUser.id },
  });

  if (!dbUser) {
    toast.error("User not found.");
    revalidatePath("/", "layout");
    redirect("/auth/login");
  }

  return { supabaseUser, dbUser };
}
