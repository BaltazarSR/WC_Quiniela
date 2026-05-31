-- Run AFTER schema.sql

-- Pool
INSERT INTO pools (id, name, join_code)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Mundial 2026', 'COMOPOLLITO');

-- Admin user (password: admin2026)
INSERT INTO users (username, password_hash, is_admin, pool_id)
VALUES ('admin', '$2b$12$MyLugXrScZgenQY5uz3nCOTUlOdyKlA2ccBssBLwNbeaFLZ/5J0Dq', true, 'a0000000-0000-0000-0000-000000000001');

-- Rounds
INSERT INTO rounds (id, name) VALUES (1, 'Group Stage');
INSERT INTO rounds (id, name) VALUES (8, 'Round of 32');
INSERT INTO rounds (id, name) VALUES (2, 'Round of 16');
INSERT INTO rounds (id, name) VALUES (3, 'Quarter-Finals');
INSERT INTO rounds (id, name) VALUES (4, 'Semi-Finals');
INSERT INTO rounds (id, name) VALUES (5, 'Third Place');
INSERT INTO rounds (id, name) VALUES (6, 'Final');

-- Stadiums
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (34, 'Ciudad de Mexico',   'Mexico City', -6);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (35, 'Guadalajara',         'Guadalajara', -6);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (36, 'Monterrey',           'Monterrey',   -6);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (37, 'Toronto',             'Toronto',     -4);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (38, 'Vancouver',           'Vancouver',   -7);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (39, 'New York New Jersey', 'New York',    -4);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (40, 'Philadelphia',        'Philadelphia',-4);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (41, 'Boston',              'Boston',      -4);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (42, 'Atlanta',             'Atlanta',     -4);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (43, 'Miami',               'Miami',       -4);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (44, 'Dallas',              'Dallas',      -5);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (45, 'Houston',             'Houston',     -5);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (46, 'Kansas City',         'Kansas City', -5);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (47, 'Los Angeles',         'Los Angeles', -7);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (48, 'San Francisco Bay Area','San Francisco',-7);
INSERT INTO stadiums (id, name, place, gmt_offset) VALUES (49, 'Seattle',             'Seattle',     -7);

-- Real teams (IDs 1-48)
INSERT INTO teams (id, name, img_code) VALUES (1,  'Algeria',              'DZ');
INSERT INTO teams (id, name, img_code) VALUES (2,  'Argentina',            'AR');
INSERT INTO teams (id, name, img_code) VALUES (3,  'Australia',            'AU');
INSERT INTO teams (id, name, img_code) VALUES (4,  'Austria',              'AT');
INSERT INTO teams (id, name, img_code) VALUES (5,  'Belgium',              'BE');
INSERT INTO teams (id, name, img_code) VALUES (6,  'Bosnia & Herzegovina', 'BA');
INSERT INTO teams (id, name, img_code) VALUES (7,  'Brazil',               'BR');
INSERT INTO teams (id, name, img_code) VALUES (8,  'Canada',               'CA');
INSERT INTO teams (id, name, img_code) VALUES (9,  'Cape Verde',           'CV');
INSERT INTO teams (id, name, img_code) VALUES (10, 'Colombia',             'CO');
INSERT INTO teams (id, name, img_code) VALUES (11, 'Croatia',              'HR');
INSERT INTO teams (id, name, img_code) VALUES (12, 'Curaçao',              'CW');
INSERT INTO teams (id, name, img_code) VALUES (13, 'Czechia',              'CZ');
INSERT INTO teams (id, name, img_code) VALUES (14, 'DR Congo',             'CD');
INSERT INTO teams (id, name, img_code) VALUES (15, 'Ecuador',              'EC');
INSERT INTO teams (id, name, img_code) VALUES (16, 'Egypt',                'EG');
INSERT INTO teams (id, name, img_code) VALUES (17, 'England',              'GB-EN');
INSERT INTO teams (id, name, img_code) VALUES (18, 'France',               'FR');
INSERT INTO teams (id, name, img_code) VALUES (19, 'Germany',              'DE');
INSERT INTO teams (id, name, img_code) VALUES (20, 'Ghana',                'GH');
INSERT INTO teams (id, name, img_code) VALUES (21, 'Haiti',                'HT');
INSERT INTO teams (id, name, img_code) VALUES (22, 'Iran',                 'IR');
INSERT INTO teams (id, name, img_code) VALUES (23, 'Iraq',                 'IQ');
INSERT INTO teams (id, name, img_code) VALUES (24, 'Ivory Coast',          'CI');
INSERT INTO teams (id, name, img_code) VALUES (25, 'Japan',                'JP');
INSERT INTO teams (id, name, img_code) VALUES (26, 'Jordan',               'JO');
INSERT INTO teams (id, name, img_code) VALUES (27, 'Mexico',               'MX');
INSERT INTO teams (id, name, img_code) VALUES (28, 'Morocco',              'MA');
INSERT INTO teams (id, name, img_code) VALUES (29, 'Netherlands',          'NL');
INSERT INTO teams (id, name, img_code) VALUES (30, 'New Zealand',          'NZ');
INSERT INTO teams (id, name, img_code) VALUES (31, 'Norway',               'NO');
INSERT INTO teams (id, name, img_code) VALUES (32, 'Panama',               'PA');
INSERT INTO teams (id, name, img_code) VALUES (33, 'Paraguay',             'PY');
INSERT INTO teams (id, name, img_code) VALUES (34, 'Portugal',             'PT');
INSERT INTO teams (id, name, img_code) VALUES (35, 'Qatar',                'QA');
INSERT INTO teams (id, name, img_code) VALUES (36, 'Saudi Arabia',         'SA');
INSERT INTO teams (id, name, img_code) VALUES (37, 'Scotland',             'GB-SCT');
INSERT INTO teams (id, name, img_code) VALUES (38, 'Senegal',              'SN');
INSERT INTO teams (id, name, img_code) VALUES (39, 'South Africa',         'ZA');
INSERT INTO teams (id, name, img_code) VALUES (40, 'South Korea',          'KR');
INSERT INTO teams (id, name, img_code) VALUES (41, 'Spain',                'ES');
INSERT INTO teams (id, name, img_code) VALUES (42, 'Sweden',               'SE');
INSERT INTO teams (id, name, img_code) VALUES (43, 'Switzerland',          'CH');
INSERT INTO teams (id, name, img_code) VALUES (44, 'Tunisia',              'TN');
INSERT INTO teams (id, name, img_code) VALUES (45, 'Türkiye',              'TR');
INSERT INTO teams (id, name, img_code) VALUES (46, 'Uruguay',              'UY');
INSERT INTO teams (id, name, img_code) VALUES (47, 'USA',                  'US');
INSERT INTO teams (id, name, img_code) VALUES (48, 'Uzbekistan',           'UZ');

-- Knockout placeholder teams (IDs 49-112)
INSERT INTO teams (id, name, comment) VALUES (49,  'Runner-up of Group A',      '{A_2}');
INSERT INTO teams (id, name, comment) VALUES (50,  'Runner-up of Group B',      '{B_2}');
INSERT INTO teams (id, name, comment) VALUES (51,  'Winner of Group E',         '{E_1}');
INSERT INTO teams (id, name, comment) VALUES (52,  'Best 3rd (A/B/C/D/F)',      '{ABCDF_3}');
INSERT INTO teams (id, name, comment) VALUES (53,  'Winner of Group F',         '{F_1}');
INSERT INTO teams (id, name, comment) VALUES (54,  'Runner-up of Group C',      '{C_2}');
INSERT INTO teams (id, name, comment) VALUES (55,  'Winner of Group C',         '{C_1}');
INSERT INTO teams (id, name, comment) VALUES (56,  'Runner-up of Group F',      '{F_2}');
INSERT INTO teams (id, name, comment) VALUES (57,  'Winner of Group I',         '{I_1}');
INSERT INTO teams (id, name, comment) VALUES (58,  'Best 3rd (C/D/F/G/H)',      '{CDFGH_3}');
INSERT INTO teams (id, name, comment) VALUES (59,  'Runner-up of Group E',      '{E_2}');
INSERT INTO teams (id, name, comment) VALUES (60,  'Runner-up of Group I',      '{I_2}');
INSERT INTO teams (id, name, comment) VALUES (61,  'Winner of Group A',         '{A_1}');
INSERT INTO teams (id, name, comment) VALUES (62,  'Best 3rd (C/E/F/H/I)',      '{CEFHI_3}');
INSERT INTO teams (id, name, comment) VALUES (63,  'Winner of Group L',         '{L_1}');
INSERT INTO teams (id, name, comment) VALUES (64,  'Best 3rd (E/H/I/J/K)',      '{EHIJK_3}');
INSERT INTO teams (id, name, comment) VALUES (65,  'Winner of Group D',         '{D_1}');
INSERT INTO teams (id, name, comment) VALUES (66,  'Best 3rd (B/E/F/I/J)',      '{BEFIJ_3}');
INSERT INTO teams (id, name, comment) VALUES (67,  'Winner of Group G',         '{G_1}');
INSERT INTO teams (id, name, comment) VALUES (68,  'Best 3rd (A/E/H/I/J)',      '{AEHIJ_3}');
INSERT INTO teams (id, name, comment) VALUES (69,  'Runner-up of Group K',      '{K_2}');
INSERT INTO teams (id, name, comment) VALUES (70,  'Runner-up of Group L',      '{L_2}');
INSERT INTO teams (id, name, comment) VALUES (71,  'Winner of Group H',         '{H_1}');
INSERT INTO teams (id, name, comment) VALUES (72,  'Runner-up of Group J',      '{J_2}');
INSERT INTO teams (id, name, comment) VALUES (73,  'Winner of Group B',         '{B_1}');
INSERT INTO teams (id, name, comment) VALUES (74,  'Best 3rd (E/F/G/I/J)',      '{EFGIJ_3}');
INSERT INTO teams (id, name, comment) VALUES (75,  'Winner of Group J',         '{J_1}');
INSERT INTO teams (id, name, comment) VALUES (76,  'Runner-up of Group H',      '{H_2}');
INSERT INTO teams (id, name, comment) VALUES (77,  'Winner of Group K',         '{K_1}');
INSERT INTO teams (id, name, comment) VALUES (78,  'Best 3rd (D/E/I/J/L)',      '{DEIJL_3}');
INSERT INTO teams (id, name, comment) VALUES (79,  'Runner-up of Group D',      '{D_2}');
INSERT INTO teams (id, name, comment) VALUES (80,  'Runner-up of Group G',      '{G_2}');
INSERT INTO teams (id, name, comment) VALUES (81,  'Winner of Match 74',        '{W_74}');
INSERT INTO teams (id, name, comment) VALUES (82,  'Winner of Match 77',        '{W_77}');
INSERT INTO teams (id, name, comment) VALUES (83,  'Winner of Match 73',        '{W_73}');
INSERT INTO teams (id, name, comment) VALUES (84,  'Winner of Match 75',        '{W_75}');
INSERT INTO teams (id, name, comment) VALUES (85,  'Winner of Match 76',        '{W_76}');
INSERT INTO teams (id, name, comment) VALUES (86,  'Winner of Match 78',        '{W_78}');
INSERT INTO teams (id, name, comment) VALUES (87,  'Winner of Match 79',        '{W_79}');
INSERT INTO teams (id, name, comment) VALUES (88,  'Winner of Match 80',        '{W_80}');
INSERT INTO teams (id, name, comment) VALUES (89,  'Winner of Match 83',        '{W_83}');
INSERT INTO teams (id, name, comment) VALUES (90,  'Winner of Match 84',        '{W_84}');
INSERT INTO teams (id, name, comment) VALUES (91,  'Winner of Match 81',        '{W_81}');
INSERT INTO teams (id, name, comment) VALUES (92,  'Winner of Match 82',        '{W_82}');
INSERT INTO teams (id, name, comment) VALUES (93,  'Winner of Match 86',        '{W_86}');
INSERT INTO teams (id, name, comment) VALUES (94,  'Winner of Match 88',        '{W_88}');
INSERT INTO teams (id, name, comment) VALUES (95,  'Winner of Match 85',        '{W_85}');
INSERT INTO teams (id, name, comment) VALUES (96,  'Winner of Match 87',        '{W_87}');
INSERT INTO teams (id, name, comment) VALUES (97,  'Winner of Match 89',        '{W_89}');
INSERT INTO teams (id, name, comment) VALUES (98,  'Winner of Match 90',        '{W_90}');
INSERT INTO teams (id, name, comment) VALUES (99,  'Winner of Match 93',        '{W_93}');
INSERT INTO teams (id, name, comment) VALUES (100, 'Winner of Match 94',        '{W_94}');
INSERT INTO teams (id, name, comment) VALUES (101, 'Winner of Match 91',        '{W_91}');
INSERT INTO teams (id, name, comment) VALUES (102, 'Winner of Match 92',        '{W_92}');
INSERT INTO teams (id, name, comment) VALUES (103, 'Winner of Match 95',        '{W_95}');
INSERT INTO teams (id, name, comment) VALUES (104, 'Winner of Match 96',        '{W_96}');
INSERT INTO teams (id, name, comment) VALUES (105, 'Winner of Match 97',        '{W_97}');
INSERT INTO teams (id, name, comment) VALUES (106, 'Winner of Match 98',        '{W_98}');
INSERT INTO teams (id, name, comment) VALUES (107, 'Winner of Match 99',        '{W_99}');
INSERT INTO teams (id, name, comment) VALUES (108, 'Winner of Match 100',       '{W_100}');
INSERT INTO teams (id, name, comment) VALUES (109, 'Loser of Match 101',        '{L_101}');
INSERT INTO teams (id, name, comment) VALUES (110, 'Loser of Match 102',        '{L_102}');
INSERT INTO teams (id, name, comment) VALUES (111, 'Winner of Match 101',       '{W_101}');
INSERT INTO teams (id, name, comment) VALUES (112, 'Winner of Match 102',       '{W_102}');

-- Groups (A-L)
INSERT INTO groups (id, name, short_name) VALUES (1,  'Group A', 'A');
INSERT INTO groups (id, name, short_name) VALUES (2,  'Group B', 'B');
INSERT INTO groups (id, name, short_name) VALUES (3,  'Group C', 'C');
INSERT INTO groups (id, name, short_name) VALUES (4,  'Group D', 'D');
INSERT INTO groups (id, name, short_name) VALUES (5,  'Group E', 'E');
INSERT INTO groups (id, name, short_name) VALUES (6,  'Group F', 'F');
INSERT INTO groups (id, name, short_name) VALUES (9,  'Group G', 'G');
INSERT INTO groups (id, name, short_name) VALUES (10, 'Group H', 'H');
INSERT INTO groups (id, name, short_name) VALUES (11, 'Group I', 'I');
INSERT INTO groups (id, name, short_name) VALUES (12, 'Group J', 'J');
INSERT INTO groups (id, name, short_name) VALUES (13, 'Group K', 'K');
INSERT INTO groups (id, name, short_name) VALUES (14, 'Group L', 'L');

-- Team → Group memberships
-- Group A: Mexico(27), South Korea(40), South Africa(39), Czechia(13)
INSERT INTO team_groups (team_id, group_id) VALUES (27, 1);
INSERT INTO team_groups (team_id, group_id) VALUES (40, 1);
INSERT INTO team_groups (team_id, group_id) VALUES (39, 1);
INSERT INTO team_groups (team_id, group_id) VALUES (13, 1);
-- Group B: Canada(8), Switzerland(43), Qatar(35), Bosnia & Herzegovina(6)
INSERT INTO team_groups (team_id, group_id) VALUES (8,  2);
INSERT INTO team_groups (team_id, group_id) VALUES (43, 2);
INSERT INTO team_groups (team_id, group_id) VALUES (35, 2);
INSERT INTO team_groups (team_id, group_id) VALUES (6,  2);
-- Group C: Brazil(7), Morocco(28), Scotland(37), Haiti(21)
INSERT INTO team_groups (team_id, group_id) VALUES (7,  3);
INSERT INTO team_groups (team_id, group_id) VALUES (28, 3);
INSERT INTO team_groups (team_id, group_id) VALUES (37, 3);
INSERT INTO team_groups (team_id, group_id) VALUES (21, 3);
-- Group D: USA(47), Paraguay(33), Australia(3), Türkiye(45)
INSERT INTO team_groups (team_id, group_id) VALUES (47, 4);
INSERT INTO team_groups (team_id, group_id) VALUES (33, 4);
INSERT INTO team_groups (team_id, group_id) VALUES (3,  4);
INSERT INTO team_groups (team_id, group_id) VALUES (45, 4);
-- Group E: Germany(19), Ecuador(15), Ivory Coast(24), Curaçao(12)
INSERT INTO team_groups (team_id, group_id) VALUES (19, 5);
INSERT INTO team_groups (team_id, group_id) VALUES (15, 5);
INSERT INTO team_groups (team_id, group_id) VALUES (24, 5);
INSERT INTO team_groups (team_id, group_id) VALUES (12, 5);
-- Group F: Netherlands(29), Japan(25), Tunisia(44), Sweden(42)
INSERT INTO team_groups (team_id, group_id) VALUES (29, 6);
INSERT INTO team_groups (team_id, group_id) VALUES (25, 6);
INSERT INTO team_groups (team_id, group_id) VALUES (44, 6);
INSERT INTO team_groups (team_id, group_id) VALUES (42, 6);
-- Group G: Belgium(5), Iran(22), Egypt(16), New Zealand(30)
INSERT INTO team_groups (team_id, group_id) VALUES (5,  9);
INSERT INTO team_groups (team_id, group_id) VALUES (22, 9);
INSERT INTO team_groups (team_id, group_id) VALUES (16, 9);
INSERT INTO team_groups (team_id, group_id) VALUES (30, 9);
-- Group H: Spain(41), Uruguay(46), Saudi Arabia(36), Cape Verde(9)
INSERT INTO team_groups (team_id, group_id) VALUES (41, 10);
INSERT INTO team_groups (team_id, group_id) VALUES (46, 10);
INSERT INTO team_groups (team_id, group_id) VALUES (36, 10);
INSERT INTO team_groups (team_id, group_id) VALUES (9,  10);
-- Group I: France(18), Senegal(38), Norway(31), Iraq(23)
INSERT INTO team_groups (team_id, group_id) VALUES (18, 11);
INSERT INTO team_groups (team_id, group_id) VALUES (38, 11);
INSERT INTO team_groups (team_id, group_id) VALUES (31, 11);
INSERT INTO team_groups (team_id, group_id) VALUES (23, 11);
-- Group J: Argentina(2), Austria(4), Algeria(1), Jordan(26)
INSERT INTO team_groups (team_id, group_id) VALUES (2,  12);
INSERT INTO team_groups (team_id, group_id) VALUES (4,  12);
INSERT INTO team_groups (team_id, group_id) VALUES (1,  12);
INSERT INTO team_groups (team_id, group_id) VALUES (26, 12);
-- Group K: Portugal(34), Colombia(10), Uzbekistan(48), DR Congo(14)
INSERT INTO team_groups (team_id, group_id) VALUES (34, 13);
INSERT INTO team_groups (team_id, group_id) VALUES (10, 13);
INSERT INTO team_groups (team_id, group_id) VALUES (48, 13);
INSERT INTO team_groups (team_id, group_id) VALUES (14, 13);
-- Group L: England(17), Croatia(11), Panama(32), Ghana(20)
INSERT INTO team_groups (team_id, group_id) VALUES (17, 14);
INSERT INTO team_groups (team_id, group_id) VALUES (11, 14);
INSERT INTO team_groups (team_id, group_id) VALUES (32, 14);
INSERT INTO team_groups (team_id, group_id) VALUES (20, 14);

-- Matches (group_id from home team's group; null for knockout rounds)
-- Group Stage (round_id=1)
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (1,  '2026-06-11T19:00:00Z', 27, 39, 1, 34, 1);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (2,  '2026-06-12T02:00:00Z', 40, 13, 1, 35, 1);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (3,  '2026-06-12T19:00:00Z', 8,  6,  1, 37, 2);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (4,  '2026-06-13T01:00:00Z', 47, 33, 1, 47, 4);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (5,  '2026-06-14T04:00:00Z', 3,  45, 1, 38, 4);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (6,  '2026-06-13T19:00:00Z', 35, 43, 1, 48, 2);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (7,  '2026-06-13T22:00:00Z', 7,  28, 1, 39, 3);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (8,  '2026-06-14T01:00:00Z', 21, 37, 1, 41, 3);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (9,  '2026-06-14T17:00:00Z', 19, 12, 1, 45, 5);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (10, '2026-06-14T20:00:00Z', 29, 25, 1, 44, 6);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (11, '2026-06-14T23:00:00Z', 24, 15, 1, 40, 5);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (12, '2026-06-15T02:00:00Z', 42, 44, 1, 36, 6);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (13, '2026-06-15T16:00:00Z', 41, 9,  1, 42, 10);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (14, '2026-06-15T19:00:00Z', 5,  16, 1, 49, 9);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (15, '2026-06-15T22:00:00Z', 36, 46, 1, 43, 10);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (16, '2026-06-16T01:00:00Z', 22, 30, 1, 47, 9);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (17, '2026-06-16T19:00:00Z', 18, 38, 1, 39, 11);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (18, '2026-06-16T22:00:00Z', 23, 31, 1, 41, 11);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (19, '2026-06-17T01:00:00Z', 2,  1,  1, 46, 12);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (20, '2026-06-17T04:00:00Z', 4,  26, 1, 48, 12);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (21, '2026-06-17T17:00:00Z', 34, 14, 1, 45, 13);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (22, '2026-06-17T20:00:00Z', 17, 11, 1, 44, 14);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (23, '2026-06-17T23:00:00Z', 20, 32, 1, 37, 14);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (24, '2026-06-18T02:00:00Z', 48, 10, 1, 34, 13);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (25, '2026-06-18T16:00:00Z', 13, 39, 1, 42, 1);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (26, '2026-06-18T19:00:00Z', 43, 6,  1, 47, 2);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (27, '2026-06-18T22:00:00Z', 8,  35, 1, 38, 2);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (28, '2026-06-19T01:00:00Z', 27, 40, 1, 35, 1);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (29, '2026-06-20T03:00:00Z', 45, 33, 1, 48, 4);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (30, '2026-06-19T19:00:00Z', 47, 3,  1, 49, 4);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (31, '2026-06-19T22:00:00Z', 37, 28, 1, 41, 3);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (32, '2026-06-20T00:30:00Z', 7,  21, 1, 40, 3);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (33, '2026-06-21T04:00:00Z', 44, 25, 1, 36, 6);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (34, '2026-06-20T17:00:00Z', 29, 42, 1, 45, 6);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (35, '2026-06-20T20:00:00Z', 19, 24, 1, 37, 5);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (36, '2026-06-21T00:00:00Z', 15, 12, 1, 46, 5);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (37, '2026-06-21T16:00:00Z', 41, 36, 1, 42, 10);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (38, '2026-06-21T19:00:00Z', 5,  22, 1, 47, 9);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (39, '2026-06-21T22:00:00Z', 46, 9,  1, 43, 10);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (40, '2026-06-22T01:00:00Z', 30, 16, 1, 38, 9);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (41, '2026-06-22T17:00:00Z', 2,  4,  1, 44, 12);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (42, '2026-06-22T21:00:00Z', 18, 23, 1, 40, 11);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (43, '2026-06-23T00:00:00Z', 31, 38, 1, 39, 11);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (44, '2026-06-23T03:00:00Z', 26, 1,  1, 48, 12);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (45, '2026-06-23T17:00:00Z', 34, 48, 1, 45, 13);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (46, '2026-06-23T20:00:00Z', 17, 20, 1, 41, 14);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (47, '2026-06-23T23:00:00Z', 32, 11, 1, 37, 14);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (48, '2026-06-24T02:00:00Z', 10, 14, 1, 35, 13);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (49, '2026-06-24T19:00:00Z', 43, 8,  1, 38, 2);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (50, '2026-06-24T19:00:00Z', 6,  35, 1, 49, 2);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (51, '2026-06-24T22:00:00Z', 37, 7,  1, 43, 3);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (52, '2026-06-24T22:00:00Z', 28, 21, 1, 42, 3);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (53, '2026-06-25T01:00:00Z', 13, 27, 1, 34, 1);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (54, '2026-06-25T01:00:00Z', 39, 40, 1, 36, 1);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (55, '2026-06-25T20:00:00Z', 12, 24, 1, 40, 5);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (56, '2026-06-25T20:00:00Z', 15, 19, 1, 39, 5);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (57, '2026-06-25T23:00:00Z', 25, 42, 1, 44, 6);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (58, '2026-06-25T23:00:00Z', 44, 29, 1, 46, 6);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (59, '2026-06-26T02:00:00Z', 45, 47, 1, 47, 4);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (60, '2026-06-26T02:00:00Z', 33, 3,  1, 48, 4);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (61, '2026-06-26T19:00:00Z', 31, 18, 1, 41, 11);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (62, '2026-06-26T19:00:00Z', 38, 23, 1, 37, 11);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (63, '2026-06-27T00:00:00Z', 9,  36, 1, 45, 10);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (64, '2026-06-27T00:00:00Z', 46, 41, 1, 35, 10);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (65, '2026-06-27T03:00:00Z', 16, 22, 1, 49, 9);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (66, '2026-06-27T03:00:00Z', 30, 5,  1, 38, 9);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (67, '2026-06-27T21:00:00Z', 32, 17, 1, 39, 14);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (68, '2026-06-27T21:00:00Z', 11, 20, 1, 40, 14);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (69, '2026-06-27T23:30:00Z', 10, 34, 1, 43, 13);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (70, '2026-06-27T23:30:00Z', 14, 48, 1, 42, 13);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (71, '2026-06-28T02:00:00Z', 1,  4,  1, 46, 12);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id, group_id) VALUES (72, '2026-06-28T02:00:00Z', 26, 2,  1, 44, 12);

-- Round of 32 (round_id=8)
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (73, '2026-06-28T19:00:00Z', 49,  50,  8, 47);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (74, '2026-06-29T20:30:00Z', 51,  52,  8, 41);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (75, '2026-06-30T01:00:00Z', 53,  54,  8, 36);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (76, '2026-06-29T17:00:00Z', 55,  56,  8, 45);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (77, '2026-06-30T21:00:00Z', 57,  58,  8, 39);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (78, '2026-06-30T17:00:00Z', 59,  60,  8, 44);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (79, '2026-07-01T01:00:00Z', 61,  62,  8, 34);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (80, '2026-07-01T16:00:00Z', 63,  64,  8, 42);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (81, '2026-07-02T00:00:00Z', 65,  66,  8, 48);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (82, '2026-07-01T20:00:00Z', 67,  68,  8, 49);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (83, '2026-07-02T23:00:00Z', 69,  70,  8, 37);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (84, '2026-07-02T19:00:00Z', 71,  72,  8, 47);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (85, '2026-07-03T03:00:00Z', 73,  74,  8, 38);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (86, '2026-07-03T22:00:00Z', 75,  76,  8, 43);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (87, '2026-07-04T01:30:00Z', 77,  78,  8, 46);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (88, '2026-07-03T18:00:00Z', 79,  80,  8, 44);

-- Round of 16 (round_id=2)
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (89, '2026-07-04T21:00:00Z', 81,  82,  2, 40);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (90, '2026-07-04T17:00:00Z', 83,  84,  2, 45);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (91, '2026-07-05T20:00:00Z', 85,  86,  2, 39);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (92, '2026-07-06T00:00:00Z', 87,  88,  2, 34);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (93, '2026-07-06T19:00:00Z', 89,  90,  2, 44);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (94, '2026-07-07T00:00:00Z', 91,  92,  2, 49);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (95, '2026-07-07T16:00:00Z', 93,  94,  2, 42);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (96, '2026-07-07T20:00:00Z', 95,  96,  2, 38);

-- Quarter-Finals (round_id=3)
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (97,  '2026-07-09T20:00:00Z', 97,  98,  3, 41);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (98,  '2026-07-10T19:00:00Z', 99,  100, 3, 47);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (99,  '2026-07-11T21:00:00Z', 101, 102, 3, 43);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (100, '2026-07-12T01:00:00Z', 103, 104, 3, 46);

-- Semi-Finals (round_id=4)
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (101, '2026-07-14T19:00:00Z', 105, 106, 4, 44);
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (102, '2026-07-15T19:00:00Z', 107, 108, 4, 42);

-- Third Place (round_id=5)
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (103, '2026-07-18T21:00:00Z', 109, 110, 5, 43);

-- Final (round_id=6)
INSERT INTO matches (id, kickoff_utc, home_team_id, away_team_id, round_id, stadium_id) VALUES (104, '2026-07-19T19:00:00Z', 111, 112, 6, 39);

-- Unlock group stage matches for predictions by default
UPDATE matches SET is_unlocked = true WHERE round_id = 1;
