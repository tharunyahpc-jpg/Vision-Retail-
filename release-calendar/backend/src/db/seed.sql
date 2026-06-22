-- ============================================================================
--  Seed data — the same sample set the standalone HTML ships with in demo mode.
--  Safe to re-run: clears the table first.
-- ============================================================================
TRUNCATE TABLE entries;

INSERT INTO entries (id, type, color, functionality_name, version, release_date, module, release_manager, release_notes) VALUES
  ('seed_rel_1', 'release', '#2f54eb', 'Audience Segmentation',     'v5.2.0', '2026-05-08', 'Audience',         'Kumaran G.', 'Real-time segment builder + saved cohorts.'),
  ('seed_rel_2', 'release', '#0bb5c9', 'Template Builder Refresh',  'v5.2.1', '2026-05-21', 'Template Builder', 'Karthick V.', 'Drag-and-drop blocks, AMP email support.'),
  ('seed_rel_3', 'release', '#0f9d6b', 'Attribution Measurement',   'v5.3.0', '2026-06-12', 'Analytics',        'Balaji S.',  'Seven-level attribution rollout.'),
  ('seed_rel_4', 'release', '#e23d5a', 'OTP Timer Hotfix',          'v5.2.2', '2026-06-24', 'Communication',    'Arjun M.',   'Fixes OTP countdown reset edge case.'),
  ('seed_rel_5', 'release', '#f06a1e', 'Instagram Publishing',      'v1.4.0', '2026-06-30', 'Marketing Star',   'Priya N.',   'Direct IG publishing — One Less Tab.');

INSERT INTO entries (id, type, color, sprint_name, goal, start_date, end_date, team_notes) VALUES
  ('seed_spr_1', 'sprint', '#6c47d6', 'Sprint 6', 'Attribution module', '2026-05-05', '2026-05-16', 'Backend + Data'),
  ('seed_spr_2', 'sprint', '#6c47d6', 'Sprint 7', 'Template builder',   '2026-05-19', '2026-05-30', 'Frontend'),
  ('seed_spr_3', 'sprint', '#2f54eb', 'Sprint 8', 'Marketing Star GA',  '2026-06-09', '2026-06-20', 'Full squad');

INSERT INTO entries (id, type, color, developer_name, leave_type, from_date, to_date, duration, notes) VALUES
  ('seed_lv_1', 'leave', '#e23d5a', 'Priya N.', 'Planned Leave', '2026-05-14', '2026-05-15', 'full',  'Family function'),
  ('seed_lv_2', 'leave', '#e23d5a', 'Arjun M.', 'Sick Leave',    '2026-06-18', '2026-06-18', 'first', ''),
  ('seed_lv_3', 'leave', '#e23d5a', 'Rahul K.', 'Comp Off',      '2026-06-23', '2026-06-23', 'full',  'Weekend on-call');
