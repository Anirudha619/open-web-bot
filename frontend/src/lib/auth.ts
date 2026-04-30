import { supabase } from "./supabase";

export async function signInWithOtp(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
}

export async function verifyOtp(email: string, token: string) {
  return supabase.auth.verifyOTP(email, { token, type: "email" });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getSession() {
  return supabase.auth.getSession();
}

export async function getUser() {
  return supabase.auth.getUser();
}
