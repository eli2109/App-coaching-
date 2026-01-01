import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, Leaf } from "lucide-react";

export default async function Index() {
  const supabase = createClient();
  let user = null;

  try {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      let name = authUser.user_metadata?.first_name;
      if (!name) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', authUser.id)
          .single();
        name = profile?.first_name;
      }
      user = { ...authUser, user_metadata: { ...authUser.user_metadata, first_name: name } };
    }
  } catch (e) {
    console.error("Supabase not configured or unreachable. Entering Demo Mode.");
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <nav className="flex justify-between items-center p-6 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="text-white" size={20} />
          </div>
          <span className="font-black tracking-tighter text-xl italic">BOOST/RELAX</span>
        </div>
        <AuthButton />
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-indigo-400">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Coaching Quotidien Personnalisé
          </div>

          {user?.user_metadata?.first_name && (
            <div className="text-2xl font-black italic uppercase tracking-tighter text-indigo-400 mb-2">
              Bonjour {user.user_metadata.first_name} !
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
            Transforme ton <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Quotidien.
            </span>
          </h1>

          <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Un programme de 4 jours conçu pour s'adapter à ton état d'esprit. Choisis l'énergie pure ou le calme profond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            {user ? (
              <Link href="/dashboard" className="group">
                <button className="w-full sm:w-auto px-10 py-5 bg-white text-gray-950 rounded-2xl font-black text-lg shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                  Continuer mon parcours
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            ) : (
              <Link href="/login" className="group">
                <button className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                  Rejoindre le programme
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-2 gap-8 pt-16 max-w-sm mx-auto">
            <div className="flex flex-col items-center gap-2 opacity-60">
              <Zap className="text-orange-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Énergie</span>
            </div>
            <div className="flex flex-col items-center gap-2 opacity-60">
              <Leaf className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">Sérénité</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-xs text-gray-600 z-10 flex flex-col gap-2">
        <span>© 2026 BOOST/RELAX LMS • Powered by Premium Design</span>
        <Link href="/admin" className="hover:text-gray-400 transition-colors uppercase tracking-widest font-black text-[8px]">
          Accès Admin
        </Link>
      </footer>
    </div>
  );
}
