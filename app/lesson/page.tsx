'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PATHWAYS } from '@/data/content';
import YouTubePlayer from '@/components/YouTubePlayer';
import { CheckCircle2, Clock, Quote, Lock, Calendar, ChevronLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function LessonPage() {
    const [pathway, setPathway] = useState<'BOOST' | 'RELAX' | null>(null);
    const [currentDay, setCurrentDay] = useState(1);
    const [isCompleted, setIsCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
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

                // 2. Fetch User Progress and Path Name
                const { data: progressData, error: progressError } = await supabase
                    .from('user_progress')
                    .select('*, learning_paths(name)')
                    .eq('user_id', user.id)
                    .single();

                if (progressError || !progressData) {
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

                // 4. Check if TODAY is already completed in lesson_completions
                const { data: completion } = await supabase
                    .from('lesson_completions')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('lesson_id', today.toString())
                    .single();

                setIsCompleted(!!completion);

            } catch (error) {
                console.error("Error loading lesson state:", error);
                router.push('/dashboard');
            } finally {
                setLoading(false);
            }
        };

        checkState();
    }, [router, supabase]);

    const handleComplete = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // 1. Record completion in lesson_completions
            await supabase.from('lesson_completions').upsert({
                user_id: user.id,
                lesson_id: currentDay.toString(),
                completed_at: new Date().toISOString()
            });

            // 2. Update user_progress
            await supabase.from('user_progress').update({
                last_lesson_completed_at: new Date().toISOString()
            }).eq('user_id', user.id);

            setIsCompleted(true);

            // Cleanup local storage if it was used before
            localStorage.setItem('last_completed_day', currentDay.toString());
        } catch (error) {
            console.error("Error completing lesson:", error);
            setIsCompleted(true);
        }
    };

    if (loading || !pathway) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    const lesson = PATHWAYS[pathway].lessons.find(l => l.dayNumber === currentDay);

    if (!lesson) return <div>Leçon non trouvée</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            {/* Header */}
            <nav className="p-4 flex items-center justify-between border-b border-gray-800 sticky top-0 bg-gray-900/80 backdrop-blur-md z-10">
                <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
                    <ChevronLeft />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Jour {currentDay} sur 4</span>
                    <span className={`text-sm font-bold ${pathway === 'BOOST' ? 'text-orange-400' : 'text-emerald-400'}`}>
                        PROJET {pathway}
                    </span>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </nav>

            <main className="max-w-2xl mx-auto p-4 sm:p-6 space-y-8">
                {/* Title Section */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 mt-4"
                >
                    <h1 className="text-3xl font-extrabold tracking-tight">{lesson.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5"><Clock size={16} /> 10-15 min</span>
                        <span className="flex items-center gap-1.5"><Calendar size={16} /> {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                </motion.div>

                {/* Video Player */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <YouTubePlayer videoId={lesson.youtubeId} />
                </motion.div>

                {/* Objectives */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700/50"
                >
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                        <CheckCircle2 className="text-indigo-400" size={20} />
                        Objectif de la séance
                    </h2>
                    <p className="text-gray-300 leading-relaxed">
                        {lesson.objective}
                    </p>
                </motion.section>

                {/* Thought of the day */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-8 rounded-3xl border border-indigo-500/20"
                >
                    <Quote className="absolute -top-4 -left-4 text-indigo-500/10 w-24 h-24 rotate-12" />
                    <div className="relative z-10 text-center space-y-4">
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-400">La Pensée du Jour</span>
                        <blockquote className="text-2xl font-serif italic text-indigo-100 leading-snug">
                            "{lesson.thought}"
                        </blockquote>
                    </div>
                </motion.section>

                {/* Actions */}
                <div className="pt-4">
                    {!isCompleted ? (
                        <button
                            onClick={handleComplete}
                            className="w-full py-5 rounded-2xl bg-white text-gray-900 text-lg font-black shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                            J'ai terminé ma séance
                            <CheckCircle2 size={24} />
                        </button>
                    ) : (
                        <div className="bg-emerald-500/20 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
                            <div className="flex justify-center text-emerald-400">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-emerald-400">Séance terminée !</h3>
                            <p className="text-gray-400 text-sm">
                                Bravo ! Ta prochaine séance sera disponible demain.
                            </p>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="mt-4 text-emerald-400 font-bold hover:underline"
                            >
                                Retour au tableau de bord
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
