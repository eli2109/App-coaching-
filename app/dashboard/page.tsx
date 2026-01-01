'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PATHWAYS } from '@/data/content';
import ProgressRing from '@/components/ProgressRing';
import { Play, CheckCircle2, Lock, Zap, Leaf, Calendar, ChevronRight, Bell, BellOff, User, LogOut, AlertTriangle, X, Shield } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function DashboardPage() {
    const [pathway, setPathway] = useState<'BOOST' | 'RELAX' | null>(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [completedDays, setCompletedDays] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkState = async () => {
            setLoading(true);
            try {
                // 1. Get current user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }
                setUserEmail(user.email ?? null);

                // 2. Fetch User Progress and Path Name
                const { data: progressData, error: progressError } = await supabase
                    .from('user_progress')
                    .select('*, learning_paths(name)')
                    .eq('user_id', user.id)
                    .single();

                if (progressError && progressError.code !== 'PGRST116') {
                    alert("Erreur BDD (dashboard progress): " + progressError.message);
                    throw progressError;
                }

                if (!progressData) {
                    console.log("No progress found in Supabase, redirecting to quiz");
                    router.push('/quiz');
                    return;
                }

                const currentPath = progressData.learning_paths.name as 'BOOST' | 'RELAX';
                setPathway(currentPath);

                // 3. Simple daily logic based on start date
                const startedAt = new Date(progressData.started_at).getTime();
                const daysElapsed = Math.floor((Date.now() - startedAt) / (1000 * 60 * 60 * 24));
                const today = Math.min(daysElapsed + 1, 4);
                setCurrentDay(today);

                // 4. Fetch Completed Lessons
                const { data: completions } = await supabase
                    .from('lesson_completions')
                    .select('lesson_id')
                    .eq('user_id', user.id);

                // In this simple app, lesson_id corresponds to the day number
                const completed = completions?.map(c => parseInt(c.lesson_id)) || [];
                setCompletedDays(completed);

                // Check notification permission
                if (typeof window !== 'undefined' && 'Notification' in window) {
                    setNotificationsEnabled(Notification.permission === 'granted');
                }

            } catch (error) {
                console.error("Error loading dashboard state:", error);
                // Fallback attempt for dev
                const savedPathway = localStorage.getItem('user_pathway') as 'BOOST' | 'RELAX';
                if (savedPathway) setPathway(savedPathway);
                else router.push('/quiz');
            } finally {
                setLoading(false);
            }
        };

        checkState();
    }, [router, supabase]);

    const toggleNotifications = async () => {
        if (!('Notification' in window)) {
            alert("Votre navigateur ne supporte pas les notifications.");
            return;
        }

        if (Notification.permission === 'granted') {
            alert("Les notifications sont déjà activées !");
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setNotificationsEnabled(true);
            // In a real app, we would send the subscription to the server here
            new Notification("C'est activé !", {
                body: "Vous recevrez vos rappels quotidiens à 8h00.",
                icon: "/icon.png"
            });
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading || !pathway) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    const progress = (completedDays.length / 4) * 100;
    const isTodayCompleted = completedDays.includes(currentDay);
    const currentLesson = PATHWAYS[pathway].lessons.find(l => l.dayNumber === currentDay);

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans pb-24">
            {/* Header */}
            <header className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-gray-400 text-sm font-medium">Bon retour,</p>
                    <h1 className="text-2xl font-bold">Ton Programme</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleNotifications}
                        className={`p-3 rounded-2xl transition-all ${notificationsEnabled
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-indigo-500'
                            }`}
                    >
                        {notificationsEnabled ? <Bell size={20} /> : <BellOff size={20} />}
                    </button>

                    {userEmail === 'eliahou@bycol.ai' && (
                        <button
                            onClick={() => router.push('/admin')}
                            className="p-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl hover:bg-indigo-500/20 transition-all"
                            title="Panel Admin"
                        >
                            <Shield size={20} />
                        </button>
                    )}

                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="p-3 bg-gray-800 text-gray-400 border border-gray-700 rounded-2xl hover:border-red-500/50 hover:text-red-400 transition-all"
                        title="Se déconnecter"
                    >
                        <User size={20} />
                    </button>
                </div>
            </header>

            <main className="px-6 space-y-8 max-w-lg mx-auto">
                {/* Progress Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`relative overflow-hidden p-6 rounded-[2.5rem] flex items-center gap-6 shadow-2xl ${pathway === 'BOOST'
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 shadow-orange-500/20'
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20'
                        }`}
                >
                    <ProgressRing progress={progress} size={100} strokeWidth={6} color="stroke-white" />
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black italic tracking-tight">
                            PROJET {pathway}
                        </h2>
                        <p className="text-sm font-medium opacity-80">
                            {completedDays.length} sessions sur 4 complétées
                        </p>
                    </div>
                    {pathway === 'BOOST' ? (
                        <Zap className="absolute -top-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
                    ) : (
                        <Leaf className="absolute -top-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
                    )}
                </motion.div>

                {/* Current Lesson Area */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Calendar size={20} className="text-indigo-400" />
                        Ta leçon du jour
                    </h3>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 p-6 rounded-[2rem] border border-gray-700 shadow-xl space-y-6"
                    >
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <span className="text-xs font-black uppercase tracking-widest text-indigo-400">SESSION J{currentDay}</span>
                                <h4 className="text-xl font-bold">{currentLesson?.title}</h4>
                            </div>
                            <div className="bg-gray-700/50 p-3 rounded-2xl">
                                {isTodayCompleted ? (
                                    <CheckCircle2 className="text-emerald-400" />
                                ) : (
                                    <Play className="text-indigo-400 fill-indigo-400" size={20} />
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => router.push('/lesson')}
                            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all ${isTodayCompleted
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20'
                                }`}
                        >
                            {isTodayCompleted ? 'Séance terminée' : 'Démarrer la séance'}
                            {!isTodayCompleted && <ChevronRight size={20} />}
                        </button>
                    </motion.div>
                </section>

                {/* Roadmap */}
                <section className="space-y-4">
                    <h3 className="text-lg font-bold">Ton Calendrier</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((day) => {
                            const isCompleted = completedDays.includes(day);
                            const isCurrent = day === currentDay;
                            const isLocked = day > currentDay;

                            return (
                                <div
                                    key={day}
                                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${isCurrent
                                        ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                        : isCompleted
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            : 'bg-gray-800 border-gray-700 text-gray-500'
                                        }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-tighter">Jour</span>
                                    <span className="text-xl font-black">{day}</span>
                                    {isLocked && <Lock size={12} />}
                                    {isCompleted && <CheckCircle2 size={12} />}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Bottom Nav Placeholder */}
            <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-center pointer-events-none">
                <div className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 px-8 py-4 rounded-full flex items-center gap-12 pointer-events-auto shadow-2xl">
                    <button className="text-indigo-400"><Calendar size={24} /></button>
                    <button className="text-gray-500" onClick={() => router.push('/admin')}><Zap size={24} /></button>
                    <button className="text-gray-500"><Zap size={24} /></button>
                </div>
            </footer>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowLogoutModal(false)}
                            className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl space-y-6"
                        >
                            <div className="flex justify-center">
                                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500">
                                    <AlertTriangle size={32} />
                                </div>
                            </div>

                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold">Se déconnecter ?</h3>
                                <p className="text-gray-400 text-sm">
                                    Es-tu sûr de vouloir quitter ta session ? Ta progression est sauvegardée localement.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleLogout}
                                    className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black transition-all"
                                >
                                    Oui, me déconnecter
                                </button>
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-2xl font-black transition-all"
                                >
                                    Annuler
                                </button>
                            </div>

                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
