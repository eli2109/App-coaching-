'use client';

import { useState } from 'react';
import { SubmitButton } from './submit-button';
import { ChevronLeft, Mail, Lock, User, ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginFormProps {
    signIn: (formData: FormData) => Promise<void>;
    signUp: (formData: FormData) => Promise<void>;
    searchParams: { message: string };
}

export default function LoginForm({ signIn, signUp, searchParams }: LoginFormProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');

    return (
        <div className="w-full max-w-md space-y-8 relative z-10">
            {/* Back Button */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group mb-4"
            >
                <div className="p-2 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors">
                    <ChevronLeft size={16} />
                </div>
                Boutique Accueil
            </Link>

            {/* Header */}
            <div className="space-y-3">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-6">
                    <Zap className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-black tracking-tight italic uppercase">
                    {mode === 'signin' ? 'Content de te revoir' : 'Crée ton profil'}
                </h1>
                <p className="text-gray-400">
                    {mode === 'signin'
                        ? 'Connecte-toi pour continuer ton parcours BOOST/RELAX.'
                        : 'Rejoins la communauté et commence ta transformation.'}
                </p>
            </div>

            {/* Form Container */}
            <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-700/50 shadow-2xl">
                <form className="space-y-6">
                    <div className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">Prénom</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-12 py-4 focus:outline-none focus:border-indigo-500 transition-colors"
                                        name="name"
                                        placeholder="Ton prénom"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-12 py-4 focus:outline-none focus:border-indigo-500 transition-colors"
                                    name="email"
                                    type="email"
                                    placeholder="name@exemple.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500 ml-4">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-12 py-4 focus:outline-none focus:border-indigo-500 transition-colors"
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <SubmitButton
                        formAction={mode === 'signin' ? signIn : signUp}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        pendingText={mode === 'signin' ? "Connexion..." : "Création..."}
                    >
                        {mode === 'signin' ? "Se connecter" : "Créer mon compte"}
                        <ArrowRight size={20} />
                    </SubmitButton>

                    {searchParams?.message && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center"
                        >
                            {searchParams.message}
                        </motion.div>
                    )}

                    <div className="text-center pt-4">
                        <button
                            type="button"
                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            {mode === 'signin'
                                ? "Pas encore de compte ? Créer un profil"
                                : "Déjà un compte ? Se connecter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
