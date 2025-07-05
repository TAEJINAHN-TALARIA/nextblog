"use client";

import { redirect } from "next/navigation";
import { createClient } from "@/app/utils/supabase/client";

export async function login(formData: FormData) {
  const sbClient = await createClient();
  const submitData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { data, error } = await sbClient.auth.signInWithPassword(submitData);
  if (error) {
    redirect("/error");
  }
  if (data) {
    console.log("Login Success ", data);
    redirect("/editor");
  }
}
