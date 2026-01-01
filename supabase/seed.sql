-- Seed data for BOOST/RELAX LMS

-- Insert Pathways
INSERT INTO learning_paths (id, name, description) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BOOST', 'Un parcours énergisant pour décupler ta vitalité et ta productivité.'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'RELAX', 'Un parcours apaisant pour lâcher prise et gérer ton stress quotidien.')
ON CONFLICT (name) DO NOTHING;

-- Insert BOOST Lessons
INSERT INTO lessons (learning_path_id, day_number, title, objective, thought, youtube_video_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 'Réveil Articulaire', 'Déverrouiller chaque articulation pour signaler au système nerveux que la journée commence.', 'Le mouvement est le carburant de ton cerveau.', '1stL_mZ3-X4'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2, 'Cardio Flash', 'Créer un pic d''intensité court pour activer le métabolisme et libérer des endorphines.', 'Ton corps est ton seul moteur, prends-en soin.', 'ml6cT4AZdqI'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 3, 'Souffle Wim Hof', 'Renforcer le système immunitaire et améliorer la résilience via une oxygénation profonde.', 'L''oxygène est la clé du calme sous la pression.', 'tybOi4hjZFQ'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 4, 'Yoga Tonique', 'Utiliser des postures de force et d''équilibre pour renforcer le gainage et la posture.', 'La discipline bat le talent quand il ne bouge pas.', '6hO_Y_N_zE0');

-- Insert RELAX Lessons
INSERT INTO lessons (learning_path_id, day_number, title, objective, thought, youtube_video_id) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 1, 'Respiration Guidée', 'Utiliser la cohérence cardiaque pour abaisser instantanément le taux de cortisol.', 'Le calme est un super-pouvoir, cultive-le.', 'inpok4MKVLM'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 2, 'Instant Présent', 'Sortir du mode pilote automatique et stopper le flux incessant des pensées.', 'Arrête de courir, la vie se passe ici.', 'ssss7V1_eyA'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 3, 'Libération Dos', 'Relâcher les tensions accumulées dans les trapèzes et le bas du dos.', 'Prendre soin de son dos libère l''esprit.', '4C-gx_mUjFc'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 4, 'Sommeil Profond', 'Préparer le corps et le cerveau au repos pour une récupération totale.', 'Le repos fait partie de la réussite.', '27Gub_2uXU8');
