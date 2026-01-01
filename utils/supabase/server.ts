import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";
  const cookieStore = cookies();

  const client = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) { }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) { }
        },
      },
    },
  );

  // MOCK AUTH LOGIC FOR DEMO MODE
  if (supabaseUrl.includes("dummy.supabase.co")) {
    const demoUserCookie = cookieStore.get("demo-user")?.value;
    if (demoUserCookie) {
      const mockUser = JSON.parse(demoUserCookie);
      // @ts-ignore - Mocking the getUser response
      client.auth.getUser = async () => ({ data: { user: mockUser }, error: null });
      // @ts-ignore
      client.auth.signOut = async () => {
        cookieStore.delete("demo-user");
      };
    }
  }

  return client;
};
