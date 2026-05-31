-- Drop all tables in reverse dependency order
drop table if exists predictions cascade;
drop table if exists matches cascade;
drop table if exists team_groups cascade;
drop table if exists stadiums cascade;
drop table if exists rounds cascade;
drop table if exists groups cascade;
drop table if exists teams cascade;
drop table if exists users cascade;
drop table if exists pools cascade;

-- Drop indexes (already gone with tables, but just in case)
drop index if exists predictions_user_id_idx;
drop index if exists predictions_match_id_idx;
drop index if exists matches_kickoff_idx;
drop index if exists matches_round_idx;
