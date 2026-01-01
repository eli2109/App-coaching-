import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    // DUMMY AUTH FOR DEMO MODE
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy.supabase.co");

    if (isDemoMode) {
      const cookieStore = cookies();
      cookieStore.set("demo-user", JSON.stringify({ id: "demo-id", email }), { path: "/" });
      return redirect("/dashboard");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/dashboard");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const supabase = createClient();

    // DUMMY AUTH FOR DEMO MODE
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("dummy.supabase.co");

    if (isDemoMode) {
      const cookieStore = cookies();
      cookieStore.set("demo-user", JSON.stringify({ id: "demo-id", email, name }), { path: "/" });
      return redirect("/dashboard");
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          first_name: name,
        }
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 blur-[150px] rounded-full" />

      <LoginForm signIn={signIn} signUp={signUp} searchParams={searchParams} />

      <div className="mt-8 text-gray-600 text-[10px] font-black uppercase tracking-widest z-10">
        Premium Coaching Experience
      </div>
    </div>
  );
}
