import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

// Load env
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
        const envFile = readFileSync('.env.local', 'utf8');
        const env = Object.fromEntries(
            envFile.split('\n')
                .filter(line => line.includes('=') && !line.startsWith('#'))
                .map(line => line.split('='))
        );
        process.env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL?.trim();
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
    } catch (e) {
        console.error("❌ Impossible de lire le fichier .env.local et aucune variable d'environnement trouvée.");
        process.exit(1);
    }
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkDatabase() {
    console.log("🚀 Lancement du diagnostic Supabase...\n");

    // 1. Check learning_paths
    const { data: paths, error: pError } = await supabase.from('learning_paths').select('*');
    if (pError) {
        console.error("❌ Erreur table 'learning_paths':", pError.message);
    } else {
        console.log(`✅ Table 'learning_paths' : ${paths.length} parcours trouvés (Attendu: 2)`);
        paths.forEach(p => console.log(`   - ${p.name}: ${p.id}`));
    }

    // 2. Check lessons
    const { data: lessons, error: lError } = await supabase.from('lessons').select('id, day_number, learning_path_id');
    if (lError) {
        console.error("❌ Erreur table 'lessons':", lError.message);
    } else {
        console.log(`\n✅ Table 'lessons' : ${lessons.length} leçons trouvées (Attendu: 8)`);
    }

    // 3. Check profiles
    const { data: profiles, error: profError } = await supabase.from('profiles').select('*');
    if (profError) {
        console.error("❌ Erreur table 'profiles':", profError.message);
    } else {
        console.log(`\n✅ Table 'profiles' : ${profiles.length} utilisateurs inscrits`);
    }

    // 4. Check user_progress
    const { data: progress, error: progError } = await supabase.from('user_progress').select('*, learning_paths(name)');
    if (progError) {
        console.error("❌ Erreur table 'user_progress':", progError.message);
    } else {
        console.log(`\n✅ Table 'user_progress' : ${progress.length} suivis de progression`);
        progress.forEach(p => {
            console.log(`   - User: ${p.user_id.substring(0, 8)}... | Path: ${p.learning_paths?.name} | Day: ${p.current_day}`);
        });
    }

    // 5. Check completions
    const { data: completions, error: cError } = await supabase.from('lesson_completions').select('*');
    if (cError) {
        console.error("❌ Erreur table 'lesson_completions':", cError.message);
    } else {
        console.log(`\n✅ Table 'lesson_completions' : ${completions.length} séances validées au total`);
    }

    console.log("\n🏁 Diagnostic terminé.");
}

checkDatabase();
