# Design System — FIFA World Cup 2026 Album Manager

A complete reference for replicating the visual style of this app. The design is **dark-mode only**, minimalist, and data-driven — team colors are the only accent colors; everything else is built from white opacity on black.

---

## Foundations

### Color — Backgrounds & Surfaces

| Role | Value | Usage |
|------|-------|-------|
| Page background | `#000000` | Body, all backgrounds |
| Surface level 1 | `rgba(255,255,255,0.02)` | Cards, sections, containers |
| Surface level 2 | `rgba(255,255,255,0.04)` | Input fields |
| Surface hover | `rgba(255,255,255,0.05)` | Hover state for list rows |
| Surface hover active | `rgba(255,255,255,0.08)` | Stronger hover state |

### Color — Text

| Role | Value | Usage |
|------|-------|-------|
| Primary text | `#ffffff` | Headings, body text |
| Secondary text | `rgba(255,255,255,0.60)` | Subtitles, descriptions |
| Tertiary text | `rgba(255,255,255,0.40)` | Metadata, captions |
| Disabled / hint text | `rgba(255,255,255,0.20)` | Empty sticker labels, placeholders |
| Very subtle text | `rgba(255,255,255,0.15)` | Input placeholders |

### Color — Borders

| Role | Value | Usage |
|------|-------|-------|
| Container border | `rgba(255,255,255,0.06)` | Cards, sections |
| Container border alt | `rgba(255,255,255,0.07)` | Hover cards |
| Input border (default) | `rgba(255,255,255,0.10)` | Form fields at rest |
| Input border (focus) | `rgba(255,255,255,0.25)` | Form fields focused |
| Input border (hover) | `rgba(255,255,255,0.12)` | List items hovered |
| Divider | `rgba(255,255,255,0.05)` | Row separators inside lists |
| Empty sticker border | `rgba(255,255,255,0.08)` | Dashed outline on missing stickers |

### Color — Brand (Host Nations & Confederations)

These are the only opinionated accent colors; use them for gradients, progress bars, and active accents.

| Name | Default | Dark |
|------|---------|------|
| Canada | `#9C0D15` | `#470C15` |
| USA | `#042C8F` | `#041B70` |
| Mexico | `#498B36` | `#0E3C3C` |

**Confederation colors** (used for category labels and gradient accents):

| Confederation | Color |
|---------------|-------|
| UEFA | `#042C8F` |
| CONMEBOL | `#041B70` |
| CONCACAF | `#9C0D15` |
| CAF | `#498B36` |
| AFC | `#470C15` |
| OFC | `#0E3C3C` |

**Signature gradient** (top accent stripe, progress bars, primary buttons):
```
linear-gradient(to right, #041B70, #498B36 50%, #9C0D15)
```
Left = USA blue · Center = Mexico green · Right = Canada red.

### Color — Sticker Themes

Each sticker type has a background, border, and text color. Sticker colors are applied inline from data, not via CSS classes.

| Sticker type | Background | Border | Text |
|--------------|-----------|--------|------|
| Gold (player base) | `#C9A84C` | `#8B6914` | `#1a0f00` |
| Coca-Cola special | `#E61728` | `#A51020` | `#ffffff` |
| Team-colored | `{teamColor}B3` (70% opacity) | `{teamColor}` | computed per contrast |
| Empty / missing | transparent | `rgba(255,255,255,0.08)` dashed | `rgba(255,255,255,0.2)` |

---

## Typography

**No custom fonts are loaded.** The entire UI uses the OS system sans-serif stack.

```
font-family: ui-sans-serif, system-ui, sans-serif;
```

Monospace (for codes/IDs only):
```
font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
```

### Type Scale

| Role | Size | Weight | Transform | Letter Spacing |
|------|------|--------|-----------|----------------|
| Page title | 24px (`text-2xl`) | 700 bold | uppercase | 0.20em |
| Section heading | 10px | 600 semibold | uppercase | 0.15em |
| Group label | 10px | 600 semibold | uppercase | 0.18em |
| Body / form text | 14px (`text-sm`) | 400 | — | — |
| Button text | 14px (`text-sm`) | 600 semibold | uppercase | 0.05em (wider) |
| Small label | 10–11px | 500 medium | uppercase | — |
| Tiny label | 9px | 500 medium | uppercase | — |
| Metadata / caption | 12px (`text-xs`) | 400 | — | — |

**Key rule:** Labels, headings, and buttons are almost always `uppercase`. Body text and form inputs are not.

---

## Spacing

Based on Tailwind's 4px base unit.

| Token | px | rem | Usage |
|-------|----|-----|-------|
| `gap-0.5` | 2px | 0.125rem | Tightest — icon + label inside a sticker |
| `gap-1` | 4px | 0.25rem | Tight inline groups |
| `gap-1.5` | 6px | 0.375rem | Compact rows |
| `gap-2` | 8px | 0.5rem | Standard inline spacing |
| `gap-3` | 12px | 0.75rem | Between components in a group |
| `gap-4` | 16px | 1rem | Section-level gap |
| `gap-5` | 20px | 1.25rem | Loose section gap |
| `p-4` | 16px | 1rem | Container padding |
| `px-3 py-2.5` | 12px / 10px | — | Compact card padding |
| `px-4` | 16px | 1rem | Input / button horizontal padding |
| `space-y-3` | 12px | — | Stacked form elements |
| `space-y-8` | 32px | — | Major page sections |
| `mb-6` / `mt-6` | 24px | — | Between sections |

---

## Sizing

### Fixed Component Sizes

| Component | Width | Height |
|-----------|-------|--------|
| Sticker button | 56px (`w-14`) | 68px (`h-[68px]`) |
| Input field | full width | 48px (`h-12`) |
| Primary button | full width | 48px (`h-12`) |
| Progress bar track | full width | 3px (`h-[3px]`) |
| Progress bar fill | variable | 3px |

### Container Max Widths

| View | Max Width |
|------|-----------|
| Login / Signup form | 320px (`max-w-xs`) |
| Album overview | 672px (`max-w-2xl`) |
| Team detail | 768px (`max-w-3xl`) |

All containers are centered with `mx-auto`.

---

## Border Styles

### Border Radius

| Token | px | Usage |
|-------|----|-------|
| `rounded-sm` | 2px | Very small badges |
| `rounded` | 4px | Small inline chips |
| `rounded-md` | 6px | Medium elements |
| `rounded-lg` | 8px | Sticker buttons, small cards |
| `rounded-xl` | 12px | **Primary** — cards, inputs, buttons, sections |
| `rounded-full` | 9999px | Progress bars (pill shape) |

`rounded-xl` (12px) is the main radius of the design. Use it for anything interactive or container-like.

### Border Width

| Usage | Width |
|-------|-------|
| Default container | 1px |
| Input field | 2px |
| Left accent stripe on team rows | 2px |
| Empty sticker (dashed) | 1px |

### Special Border Techniques

- **Left accent stripe**: `border-left: 2px solid {teamColor}` on list rows to signal completion.
- **Inset ring on badge stickers**: `box-shadow: inset 0 0 0 2px rgba(255,255,255,0.45)` (or `rgba(0,0,0,0.25)` on light stickers).
- **Dashed empty state**: `border-style: dashed; border-color: rgba(255,255,255,0.08)`.

---

## Shadows & Effects

| Effect | Value | Usage |
|--------|-------|-------|
| Inset ring (light bg sticker) | `inset 0 0 0 2px rgba(255,255,255,0.45)` | Badge stickers with dark text |
| Inset ring (dark bg sticker) | `inset 0 0 0 2px rgba(0,0,0,0.25)` | Badge stickers with light text |

No drop shadows are used. Depth is created entirely through border opacity and background opacity layering.

---

## Gradients

All gradients run left-to-right (`to right`).

| Name | Value | Usage |
|------|-------|-------|
| Signature / Accent | `linear-gradient(to right, #041B70, #498B36 50%, #9C0D15)` | Top accent bar, global progress bar |
| Primary button | `linear-gradient(to right, #042C8F, #498B36)` | CTA buttons |
| Team progress | `linear-gradient(to right, {confColor}, {teamColor})` | Per-team progress bars |

**Opacity variants on team colors** (applied inline to hex):

| Suffix | Opacity | Usage |
|--------|---------|-------|
| `{color}18` | ~9.4% | Subtle background tint on completed rows |
| `{color}28` | ~15.7% | Hover background tint |
| `{color}40` | 25% | Border color on completion badges |
| `{color}66` | 40% | Hover border tint |
| `{color}88` | ~53% | Gradient start on progress bars |
| `{color}B3` | 70% | Sticker background (squad cards) |

---

## Transitions & Motion

All transitions are fast and subtle — the UI never draws attention to itself.

| Duration | Usage |
|----------|-------|
| 150ms | **Default** — hover states, button presses, input focus |
| 500ms | Soft fades (rarely used) |
| 700ms | Progress bar fill (feels deliberate, not instant) |

**Properties transitioned:**
- `transition-all` on interactive cards and list rows
- `transition-colors` on text elements
- `background`, `border-left-color` toggled together on team rows

---

## Layout Patterns

### Page Shell
```
black background → centered column → max-w-{xs|2xl|3xl} → mx-auto → px-4 → py-6
```

### Section / Card
```
rounded-xl · border border-white/[0.06] · bg-white/[0.02] · p-4
```

### List Row
```
flex items-center justify-between
px-3 py-2.5 · rounded-lg
border border-white/[0.07] · bg-white/[0.02]
hover:bg-white/[0.05] hover:border-white/[0.12]
transition-all duration-150
```

### Sticker Grid
Stickers wrap with `flex flex-wrap gap-2`. Each sticker is `w-14 h-[68px] rounded-lg`.

Responsive grid for larger collections:
```
grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9
```

### Form Fields
```
Input:  w-full h-12 px-4 rounded-xl bg-white/[0.04] border-2 border-white/10
        placeholder:text-white/15 focus:border-white/25 transition-all duration-150

Button: w-full h-12 rounded-xl font-semibold uppercase tracking-wider transition-all duration-150
        background: linear-gradient(to right, #042C8F, #498B36)
```

---

## Design Principles

1. **Black is the canvas.** Never use gray backgrounds; use white with very low opacity instead.
2. **White opacity = hierarchy.** Text, borders, and surfaces are all `rgba(255,255,255,X)` — lower opacity = lower priority.
3. **Team colors are the only accent.** Do not introduce new accent colors; use the team or confederation palette.
4. **Uppercase everywhere important.** Labels, headings, and buttons use `text-transform: uppercase` with tracked-out letter spacing.
5. **12px radius by default.** Use `rounded-xl` for any card, input, or button. Smaller elements use `rounded-lg` or `rounded-md`.
6. **No drop shadows.** Depth comes from border + background opacity combinations.
7. **Fast transitions.** 150ms for all interactions — snappy but not jarring.
8. **System fonts only.** Do not load web fonts; the system sans-serif stack looks great and loads instantly.
9. **Scrollbars hidden.** Horizontal scroll areas use `.scrollbar-hide` to keep the UI clean.
10. **Compact type.** Most labels are 10–11px uppercase. Body text is 14px. Never go above 24px for headings.
