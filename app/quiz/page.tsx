'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '@/data/content';
import { ChevronRight, ArrowRight, Zap, Leaf } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function QuizPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<('BOOST' | 'RELAX')[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [result, setResult] = useState<'BOOST' | 'RELAX' | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    const router = useRouter();
    const supabase = createClient();

    // Check if user already has a profile/progress
    useState(() => {
        const checkExisting = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data } = await supabase
                        .from('user_progress')
                        .select('id')
                        .eq('user_id', user.id)
                        .single();

                    if (data) {
                        router.push('/dashboard');
                        return;
                    }
                }
            } catch (e) {
                // Not found is fine
            } finally {
                setIsChecking(false);
            }
        };
        checkExisting();
    });

    const handleAnswer = (target: 'BOOST' | 'RELAX') => {
        const newAnswers = [...answers, target];
        setAnswers(newAnswers);

        if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            calculateResult(newAnswers);
        }
    };

    const calculateResult = async (finalAnswers: ('BOOST' | 'RELAX')[]) => {
        const boostCount = finalAnswers.filter(a => a === 'BOOST').length;
        const relaxCount = finalAnswers.filter(a => a === 'RELAX').length;
        const finalResult = boostCount >= 2 ? 'BOOST' : 'RELAX';

        setResult(finalResult);
        setIsSaving(true);
        setIsFinished(true);

        // Save progress to Supabase
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // 1. Get the pathway ID from the learning_paths table
                const { data: paths } = await supabase
                    .from('learning_paths')
                    .select('id')
                    .eq('name', finalResult)
                    .single();

                if (paths) {
                    // 2. Insert or update user_progress
                    const { error } = await supabase
                        .from('user_progress')
                        .upsert({
                            user_id: user.id,
                            learning_path_id: paths.id,
                            current_day: 1,
                            started_at: new Date().toISOString()
                        }, { onConflict: 'user_id' });

                    if (error) throw error;
                    console.log('Saved result to Supabase for user:', user.id, finalResult);
                }

                // Keep localStorage as a fallback/cache for now
                localStorage.setItem('user_pathway', finalResult);
                localStorage.setItem('quiz_completed', 'true');
            }
        } catch (error) {
            console.error('Error saving quiz result to Supabase:', error);
            localStorage.setItem('user_pathway', finalResult);
            localStorage.setItem('quiz_completed', 'true');
        } finally {
            setIsSaving(false);
        }
    };

    const startJourney = () => {
        if (!isSaving) {
            router.push('/dashboard');
        }
    };

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6 sm:p-12 font-sans">
            <div className="max-w-md w-full">
                {!isFinished ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                                Ton Orientation
                            </h1>
                            <p className="text-gray-400">Réponds à ces 3 questions pour personnaliser ton parcours.</p>
                        </div>

                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="bg-indigo-500 h-full"
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentQuestion.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="bg-gray-800 p-8 rounded-3xl border border-gray-700 shadow-xl"
                            >
                                <h2 className="text-xl font-medium mb-8 leading-relaxed">
                                    {currentQuestion.question}
                                </h2>

                                <div className="space-y-4">
                                    {currentQuestion.options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(option.target)}
                                            className="w-full text-left p-4 rounded-xl border border-gray-700 hover:border-indigo-500 hover:bg-gray-700/50 transition-all group flex items-start gap-4"
                                        >
                                            <div className="mt-1 w-6 h-6 rounded-full border border-gray-600 group-hover:border-indigo-500 flex items-center justify-center flex-shrink-0 transition-colors">
                                                <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-indigo-500 transition-colors" />
                                            </div>
                                            <span className="text-gray-300 group-hover:text-white transition-colors">
                                                {option.text}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <div className="text-center text-sm text-gray-500">
                            Question {currentQuestionIndex + 1} sur {QUIZ_QUESTIONS.length}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-8 py-12"
                    >
                        <div className="flex justify-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                                className={`w-24 h-24 rounded-full flex items-center justify-center ${result === 'BOOST'
                                    ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.2)]'
                                    : 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                                    }`}
                            >
                                {result === 'BOOST' ? <Zap size={48} /> : <Leaf size={48} />}
                            </motion.div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold">C'est prêt !</h2>
                            <p className="text-xl text-gray-300">
                                Ton profil correspond au parcours :{' '}
                                <span className={`font-bold ${result === 'BOOST' ? 'text-orange-400' : 'text-emerald-400'}`}>
                                    {result}
                                </span>
                            </p>
                            <p className="text-gray-400 max-w-xs mx-auto">
                                Nous avons préparé 4 jours de coaching adaptés à tes besoins actuels.
                            </p>
                        </div>

                        <button
                            onClick={startJourney}
                            disabled={isSaving}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all transform hover:scale-[1.02] active:scale-[0.98] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''} ${result === 'BOOST'
                                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                                }`}
                        >
                            {isSaving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                    Préparation de ton parcours...
                                </>
                            ) : (
                                <>
                                    Démarrer mon parcours
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
