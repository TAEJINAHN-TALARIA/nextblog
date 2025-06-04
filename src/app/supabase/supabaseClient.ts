import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANONKEY;

if (!url || !anonKey) {
  throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
}

export const sbClient = createClient(url, anonKey);
