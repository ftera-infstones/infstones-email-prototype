# InfStones Email Marketing System

Full React + TypeScript + Vite app. Merges:

- **Page structure** from the `infstones-email-prototype` SPA (routing, pages, state, interactions — 5-step campaign wizard, block-based template editor, subscriber/group management).
- **Visual design** from the Claude Design handoff bundle in `./project/` (amber `#EDB500` primary, off-white canvas, Inter / JetBrains Mono / Syncopate typography, full component library in `src/index.css`).

The original handoff instructions are preserved as `HANDOFF.md`.

## Quick start

```bash
yarn install
yarn dev         # start dev server (localhost:5173)
yarn build       # type-check + production build
yarn preview     # preview prod build
```

Package manager: **Yarn 4** (pinned via `packageManager` field in `package.json`). Uses the `node-modules` linker (configured in `.yarnrc.yml`) so tooling like `tsc` works out of the box — no PnP.

## Project layout

```
.
├── index.html                     # Vite entry, loads Google Fonts
├── vite.config.ts
├── tsconfig*.json
├── public/
│   ├── favicon.svg
│   └── ifs-logo.svg               # InfStones wordmark (sidebar)
├── project/                       # Claude Design handoff bundle (reference only)
│   ├── InfStones Email Marketing.html
│   ├── styles.css                 # source of the design tokens
│   ├── *.jsx / data.js            # HTML prototype files
│   └── assets/ uploads/
└── src/
    ├── main.tsx                   # HashRouter bootstrap
    ├── App.tsx                    # route table
    ├── index.css                  # all styling (tokens + component classes)
    ├── components/
    │   └── Layout.tsx             # sidebar + topbar shell
    ├── mock/
    │   └── data.ts                # subscribers, groups, campaigns, templates, trend
    └── pages/
        ├── Dashboard.tsx          # KPI grid + trend chart + recent campaigns
        ├── Campaigns.tsx          # status-segmented list
        ├── CampaignCreate.tsx     # 5-step wizard (basics → template → preview+UTM → schedule → review)
        ├── CampaignReport.tsx     # big stats + engagement funnel + recipient activity
        ├── Templates.tsx          # template gallery
        ├── TemplateEditor.tsx     # 3-pane block editor
        ├── Subscribers.tsx        # filter + table + add/import modals
        ├── Groups.tsx             # group cards + drill-down
        └── Settings.tsx           # general / sending / import tabs
```

## Routes

Hash-based routing (`/#/dashboard`, etc.) — no server required.

| Path | Page |
|---|---|
| `/` | redirects to `/dashboard` |
| `/dashboard` | Dashboard |
| `/campaigns` | Campaign list |
| `/campaigns/new` | Campaign wizard |
| `/campaigns/:id/edit` | Campaign wizard |
| `/campaigns/:id/report` | Campaign report |
| `/subscribers` | Subscribers |
| `/groups` | Groups list + detail |
| `/templates` | Template gallery |
| `/templates/new`, `/templates/:id/edit` | Template editor |
| `/settings` | Settings |

## Design tokens

Defined at the top of `src/index.css` and used across every component:

- **Brand**: `--amber: #EDB500` (hover `#F4CD3D`, active `#CA9600`), `--ink: #0B0E1E`
- **Surfaces**: `--bg: #FAFAF7`, `--surface: #FFFFFF`, `--bg-sunken: #F3F2ED`
- **Typography**: Inter (body), JetBrains Mono (numbers/badges/chips), Syncopate (brand wordmark)
- **Radii**: 4 / 6 / 10 / 14 / 20 px
- **Shadows**: five tiers from `--shadow-xs` to `--shadow-pop`
- **Motion**: `--t-fast: 120ms`, `--t-med: 220ms`

## Notes

- All data is mocked in `src/mock/data.ts` — no backend calls.
- `project/` and `HANDOFF.md` are preserved as design references; they're not imported by the app.
- To change the favicon / logo, edit `public/favicon.svg` or replace `public/ifs-logo.svg`.
