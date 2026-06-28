ALTER TABLE predictions ADD COLUMN IF NOT EXISTS advancing_team_id integer references teams(id);
ALTER TABLE matches     ADD COLUMN IF NOT EXISTS advancing_team_id integer references teams(id);
