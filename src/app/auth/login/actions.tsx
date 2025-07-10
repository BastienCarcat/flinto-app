"use server";

import { actionClient, ActionError } from "@/utils/nextSafeAction/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginSchema } from "./validation";

export const login = actionClient
  .inputSchema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new ActionError("Failed to login. Please try again.");
    }

    revalidatePath("/", "layout");
    redirect("/");
  });
