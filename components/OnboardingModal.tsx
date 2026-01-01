'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Smartphone, Share, PlusSquare, X, Check } from 'lucide-react';

interface OnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEnableNotifications: () => void;
    notificationsEnabled: boolean;
}

export default function OnboardingModal({ isOpen, onClose, onEnableNotifications, notificationsEnabled }: OnboardingModalProps) {
    const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');

    useEffect(() => {
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios');
        } else if (/android/.test(userAgent)) {
            setPlatform('android');
        }
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8 sm:p-10 space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-4">
                                <Smartphone size={32} />
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Installation de l'app</h2>
                            <p className="text-gray-400 text-sm">Préparez votre expérience optimale en 2 étapes faciles.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Step 1: Notifications */}
                            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-800 flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${notificationsEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700 text-gray-400'}`}>
                                    {notificationsEnabled ? <Check size={20} /> : <Bell size={20} />}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-200">1. Activez les rappels</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Recevez un rappel quotidien pour ne jamais manquer votre séance de coaching.
                                    </p>
                                    {!notificationsEnabled && (
                                        <button
                                            onClick={onEnableNotifications}
                                            className="mt-3 text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                                        >
                                            Activer maintenant →
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Step 2: PWA Install */}
                            <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-800 flex items-start gap-4">
                                <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                                    {platform === 'ios' ? <Share size={20} /> : <PlusSquare size={20} />}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-gray-200">2. Installez sur votre écran</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Accédez à votre coaching d'un seul clic, sans passer par le navigateur.
                                    </p>
                                    <div className="mt-4 p-4 bg-gray-900/50 rounded-2xl border border-gray-800/50 text-[11px] space-y-2">
                                        {platform === 'ios' ? (
                                            <>
                                                <p className="flex items-center gap-2">
                                                    <span className="w-5 h-5 bg-white/10 rounded flex items-center justify-center"><Share size={12} /></span>
                                                    Appuyez sur "Partager" en bas de l'écran.
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <span className="w-5 h-5 bg-white/10 rounded flex items-center justify-center"><PlusSquare size={12} /></span>
                                                    Choisissez "Sur l'écran d'accueil".
                                                </p>
                                            </>
                                        ) : platform === 'android' ? (
                                            <>
                                                <p>1. Appuyez sur les trois points vertical ⋮ en haut à droite.</p>
                                                <p>2. Choisissez "Installer l'application" ou "Ajouter à l'écran d'accueil".</p>
                                            </>
                                        ) : (
                                            <p>Pour une meilleure expérience sur mobile, ouvrez ce lien sur votre téléphone et suivez les mêmes étapes.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                        >
                            C'est compris, j'y vais !
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
