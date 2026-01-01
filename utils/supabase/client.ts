import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy-key";

  const client = createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );

  // MOCK AUTH LOGIC FOR DEMO MODE (Browser)
  if (typeof window !== 'undefined' && supabaseUrl.includes("dummy.supabase.co")) {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift();
    };

    const demoUserCookie = getCookie("demo-user");
    if (demoUserCookie) {
      try {
        const mockUser = JSON.parse(decodeURIComponent(demoUserCookie));
        // @ts-ignore
        client.auth.getUser = async () => ({ data: { user: mockUser }, error: null });
        // @ts-ignore
        client.auth.getSession = async () => ({ data: { session: { user: mockUser } }, error: null });
        // @ts-ignore
        client.auth.signOut = async () => {
          document.cookie = "demo-user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        };
      } catch (e) { }
    }
  }

  return client;
};
