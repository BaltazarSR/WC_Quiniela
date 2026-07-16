# The Villain Feature

A guest participation mode for friends who didn't sign up to the quiniela. The villain competes on a parallel track by hexing matches and targeting players — without needing an account.

## Concept

For each upcoming match, the villain picks:
1. A team to **curse** (they're rooting for that team to lose)
2. One **player to target**

**If** the cursed team loses AND the targeted player had predicted them to win → villain steals 1 point from that player.

**If** the villain is wrong about the team losing → nothing happens to anyone.

### Why this works
- Players only lose a point when they were already going to be wrong (the team they picked lost anyway), so it doesn't feel totally unfair
- The villain has to be strategic — picking the right upset AND the right victim
- Max damage is 1 pt per match, low stakes but enough to sting on the leaderboard
- Creates social drama: rivals can watch who the villain is targeting

## Scoring

| Outcome | Villain | Targeted Player |
|---|---|---|
| Cursed team loses + player had picked them | +1 pt (stolen) | -1 pt |
| Cursed team loses + player had NOT picked them | +1 pt | no change |
| Cursed team wins | 0 pts | no change |

> The villain also earns +1 when their curse lands regardless of target, but only steals from the player if the player was on the wrong side.

## Access

- Special URL with a secret token: `/villain?token=<TOKEN>`
- No login or signup required
- Token stored in env var (e.g. `VILLAIN_TOKEN`)
- Single villain slot to start; could expand to multiple in future seasons

## UI / UX

### Villain page (`/villain?token=...`)
- Shows upcoming matches with two actions per match:
  - Team picker: "Curse a team" (pick the one you think loses)
  - Player picker: "Target a player" (dropdown of current participants)
- Villain picks are locked at the same time as player predictions (5 min before kickoff)
- After the match, show the result of the hex

### Leaderboard
- Villain appears as a separate row with a skull/villain icon
- Their score = total stolen points
- Their picks are revealed post-match (not before)
- Show a "hexed" indicator on the targeted player's row for that match

### Player-facing
- Players can see if they were targeted by the villain after the match resolves
- Could show a small hex icon on their prediction history for targeted matches

## DB Changes Needed

```sql
-- Villain hex picks
create table villain_picks (
  id uuid primary key default gen_random_uuid(),
  match_id integer references matches(id),
  cursed_team_id integer references teams(id),
  targeted_user_id uuid references users(id),
  villain_name text not null default 'El Villano',
  created_at timestamptz default now()
);

-- Track stolen points (applied when match is marked final)
alter table predictions add column stolen boolean default false;
```

## API Routes Needed

| Method | Route | Description |
|---|---|---|
| GET | `/api/villain/matches` | Upcoming matches available to hex (public, token-gated) |
| POST | `/api/villain/picks` | Submit a hex pick (token-gated) |
| GET | `/api/villain/score` | Villain's total and pick history |

Score calculation triggered alongside existing match scoring when admin marks a match as final.

## Open Questions for Next Season

- Should there be multiple villain slots (one per friend)?
- Should the villain's target be visible to everyone before the match (raises stakes / adds paranoia)?
- Should the villain get a name they can choose on first visit?
- Villain curses a team but doesn't pick a winner — could add a "predict the exact loser score" bonus.
