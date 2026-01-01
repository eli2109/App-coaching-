import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, User } from "lucide-react";

export default async function AuthButton() {
  const supabase = createClient();
  let user = null;

  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;
  } catch (e) {
    // Demo mode or unconfigured Supabase
  }

  const signOut = async () => {
    "use server";
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
  };

  if (user) {
    return (
      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Utilisateur</span>
          <span className="text-sm font-bold text-gray-300">{user.email}</span>
        </div>
        <form action={signOut}>
          <button className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:text-red-400 transition-all">
            <LogOut size={18} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="px-6 py-2.5 rounded-xl bg-white text-gray-950 font-black text-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
    >
      <User size={16} />
      Connexion
    </Link>
  );
}
