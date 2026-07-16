-- Pools
create table if not exists pools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  join_code text unique not null,
  created_at timestamptz default now()
);

-- Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  is_admin boolean default false,
  is_nuked boolean default false,
  pool_id uuid references pools(id),
  created_at timestamptz default now()
);

-- Teams: IDs 1-48 are real teams (have img_code), 49-112 are knockout placeholders
create table if not exists teams (
  id integer primary key,
  name text not null,
  img_code text,   -- ISO country code for real teams; null for placeholders
  comment text     -- human-readable placeholder description; null for real teams
);

-- Tournament groups (A-L)
create table if not exists groups (
  id integer primary key,
  name text not null,
  short_name text not null
);

-- Team → Group membership (group stage only)
create table if not exists team_groups (
  team_id integer not null references teams(id),
  group_id integer not null references groups(id),
  primary key (team_id, group_id)
);

-- Rounds (Group Stage, Round of 32, Round of 16, etc.)
create table if not exists rounds (
  id integer primary key,
  name text not null
);

-- Stadiums / venues
create table if not exists stadiums (
  id integer primary key,
  name text not null,
  place text not null,
  gmt_offset integer not null
);

-- Matches
create table if not exists matches (
  id integer primary key,
  kickoff_utc timestamptz not null,
  home_team_id integer not null references teams(id),
  away_team_id integer not null references teams(id),
  round_id integer not null references rounds(id),
  stadium_id integer not null references stadiums(id),
  group_id integer references groups(id),  -- null for knockout matches
  home_score integer,
  away_score integer,
  is_final boolean default false,
  is_unlocked boolean not null default false,
  created_at timestamptz default now()
);

-- Predictions
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  match_id integer references matches(id) on delete cascade,
  home_goals integer not null,
  away_goals integer not null,
  points_earned integer,
  submitted_at timestamptz default now(),
  unique(user_id, match_id)
);

-- Tournament settings (single row: id = 1)
create table if not exists tournament_settings (
  id integer primary key default 1,
  champion_team_id integer references teams(id)
);
insert into tournament_settings (id) values (1) on conflict do nothing;

-- Champion predictions (one per user)
create table if not exists champion_predictions (
  user_id uuid primary key references users(id) on delete cascade,
  team_id integer not null references teams(id),
  submitted_at timestamptz default now()
);

-- Indexes
create index if not exists predictions_user_id_idx on predictions(user_id);
create index if not exists predictions_match_id_idx on predictions(match_id);
create index if not exists matches_kickoff_idx on matches(kickoff_utc);
create index if not exists matches_round_idx on matches(round_id);
create index if not exists champion_predictions_team_id_idx on champion_predictions(team_id);

-- Privileges
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;