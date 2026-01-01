'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    CheckCircle2,
    TrendingUp,
    Zap,
    Leaf,
    ChevronLeft,
    Search,
    MoreVertical,
    ArrowUpRight,
    Lock
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import ProgressRing from '@/components/ProgressRing';

// Mock data for demo mode
const MOCK_STATS = {
    totalUsers: 142,
    activeThisWeek: 89,
    avgCompletion: 68,
    boostCount: 78,
    relaxCount: 64
};

const MOCK_USERS = [
    { id: 1, email: 'alex@exemple.com', pathway: 'BOOST', progress: 3, lastActive: 'Il y a 2h', status: 'active' },
    { id: 2, email: 'sarah.m@gmail.com', pathway: 'RELAX', progress: 4, lastActive: 'Hier', status: 'completed' },
    { id: 3, email: 'julien_d@outlook.fr', pathway: 'BOOST', progress: 1, lastActive: 'Il y a 5m', status: 'active' },
    { id: 4, email: 'marie.l@orange.fr', pathway: 'RELAX', progress: 2, lastActive: 'Il y a 1j', status: 'active' },
    { id: 5, email: 'coach.test@test.com', pathway: 'BOOST', progress: 0, lastActive: 'Jamais', status: 'new' },
];

export default function AdminDashboard() {
    const [searchTerm, setSearchTerm] = useState('');
    const [authorized, setAuthorized] = useState<boolean | null>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (user && user.email === 'eliahou@bycol.ai') {
                setAuthorized(true);
            } else {
                setAuthorized(false);
                setTimeout(() => router.push('/dashboard'), 2000);
            }
        };
        checkAuth();
    }, [router, supabase]);

    if (authorized === null) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (authorized === false) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2.5rem] max-w-sm space-y-4"
                >
                    <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                        <Lock size={32} />
                    </div>
                    <h2 className="text-xl font-bold italic uppercase tracking-tight">Accès Refusé</h2>
                    <p className="text-gray-400 text-sm">
                        Désolé, seul l'administrateur principal (**eliahou@bycol.ai**) peut accéder à cette section.
                    </p>
                    <p className="text-xs text-indigo-400 animate-pulse">Redirection vers le dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans pb-12">
            {/* Sidebar/Header Placeholder */}
            <header className="border-b border-gray-900 bg-gray-900/50 backdrop-blur-xl sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="text-xl font-black italic tracking-tighter uppercase">Admin Panel</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                placeholder="Rechercher un membre..."
                                className="bg-gray-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-gray-800 flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Membres Totaux"
                        value={MOCK_STATS.totalUsers}
                        icon={<Users className="text-indigo-400" />}
                        trend="+12% cette semaine"
                    />
                    <StatCard
                        title="Actifs hebdomadaire"
                        value={MOCK_STATS.activeThisWeek}
                        icon={<TrendingUp className="text-emerald-400" />}
                        trend="Stable"
                    />
                    <StatCard
                        title="Complétion Moyenne"
                        value={`${MOCK_STATS.avgCompletion}%`}
                        icon={<CheckCircle2 className="text-purple-400" />}
                        trend="+5% vs mois dernier"
                    />
                    <div className="bg-gray-900/40 p-6 rounded-[2rem] border border-gray-900 flex flex-col justify-between">
                        <span className="text-xs font-black uppercase tracking-widest text-gray-500">Répartition</span>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                <Zap size={16} className="text-orange-400" />
                                <span className="text-lg font-bold">{MOCK_STATS.boostCount}</span>
                            </div>
                            <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-500" style={{ width: '55%' }} />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold">{MOCK_STATS.relaxCount}</span>
                                <Leaf size={16} className="text-emerald-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Tabs Logic would go here */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Members Table */}
                    <div className="lg:col-span-2 bg-gray-900/40 rounded-[2.5rem] border border-gray-900 overflow-hidden">
                        <div className="p-8 border-b border-gray-900 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Suivi des Membres</h3>
                            <button className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">Exporter CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-gray-900">
                                        <th className="px-8 py-4">Membre</th>
                                        <th className="px-8 py-4">Parcours</th>
                                        <th className="px-8 py-4">Progression</th>
                                        <th className="px-8 py-4">Activité</th>
                                        <th className="px-8 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-900/50">
                                    {(MOCK_USERS as any[]).map((user) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="font-bold text-gray-200 block">{user.email}</span>
                                                <span className="text-xs text-gray-500">ID: #{user.id}442</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.pathway === 'BOOST' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
                                                    }`}>
                                                    {user.pathway === 'BOOST' ? <Zap size={10} /> : <Leaf size={10} />}
                                                    {user.pathway}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full max-w-[100px] overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${user.pathway === 'BOOST' ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${(user.progress / 4) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-bold text-gray-400">{user.progress}/4</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-gray-500 italic">
                                                {user.lastActive}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2 text-gray-600 hover:text-white transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Quick Actions / Insights */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-4">
                                <h4 className="text-xl font-black leading-tight italic uppercase">Optimisation IA</h4>
                                <p className="text-indigo-100/80 text-sm leading-relaxed">
                                    Basés sur l'activité des 24h dernières heures, nous recommandons d'ajouter une option "Échauffement Express" au parcours BOOST.
                                </p>
                                <button className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                    Voir l'Analyse <ArrowUpRight size={14} />
                                </button>
                            </div>
                            <Zap className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
                        </div>

                        <div className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-900 space-y-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Performances Globales</h4>
                            <div className="flex items-center justify-center py-4">
                                <ProgressRing progress={MOCK_STATS.avgCompletion} size={160} strokeWidth={10} color="stroke-indigo-500" />
                            </div>
                            <p className="text-center text-xs text-gray-400 px-4 leading-relaxed">
                                Taux de complétion moyen de l'ensemble des parcours actifs.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-gray-900/40 p-6 rounded-[2.5rem] border border-gray-900 space-y-4"
        >
            <div className="flex justify-between items-start">
                <div className="p-3 bg-gray-900 rounded-2xl border border-gray-800">
                    {icon}
                </div>
                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest px-2 py-1 bg-gray-900 rounded-lg">{trend}</span>
            </div>
            <div>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-1">{title}</span>
                <span className="text-3xl font-bold tracking-tight">{value}</span>
            </div>
        </motion.div>
    );
}
