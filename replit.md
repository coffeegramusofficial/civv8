# Russian Civil War Card Game

## Overview

A 2D Hearthstone-style strategy card game set during the Russian Civil War (1917-1923). Players choose between the White Army (Imperial Loyalists) and Red Army (Bolsheviks) factions, building decks and deploying cards in a lane-based tactical battle system. The objective is to destroy the enemy's main tower while defending your own through strategic card placement and combat management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technologies:**
- React 18 with TypeScript for type-safe UI development
- Vite as the build tool and development server
- TailwindCSS for utility-first styling
- Framer Motion for smooth animations and transitions
- Radix UI components for accessible, unstyled primitives

**State Management Strategy:**
- Zustand stores for global game state (`useGameState`) and audio control (`useAudio`)
- React Query (@tanstack/react-query) configured for server data fetching with infinite stale time and no refetch
- Local component state using React hooks for UI-specific concerns

**Game Rendering Approach:**
- 2D Hearthstone-style interface with lane-based card positioning (left, center, right lanes)
- CSS Grid and Flexbox for responsive layouts
- Framer Motion for card play animations, hover effects, and UI transitions
- Gradient backgrounds and visual effects for faction theming

**Game Flow Architecture:**
- **Menu Phase:** Main menu with faction selection, deck building, and settings
- **Faction Select Phase:** Choose between White Army or Red Army
- **Deck Building Phase:** Create and save custom 8-card decks from faction-specific cards
- **Playing Phase:** Active turn-based gameplay on lane-based battlefield
- **Game Over Phase:** Victory/defeat screen with reset capability

**Component Organization:**
- Game-specific components in `client/src/components/game/`
- UI primitives in `client/src/components/ui/` (Radix-based)
- 2D implementations: `GameScreen2D.tsx`, `Card2D.tsx`, `Tower2D.tsx`, `Board2D.tsx`
- Legacy 3D components preserved but unused (React Three Fiber, Three.js)

**Game Logic:**
- Card types: Units (assault, support, spy) and Bonuses (medic, engineer, instructor, aerial)
- Flying units converted to aerial bombardment bonus cards (attack towers directly, ignore enemy units)
- Spy units (Разведчик-шпион for Whites, Агент ВЧК for Reds) attack main tower directly
- Lane-based positioning with three slots per faction
- Combat system: center lane attacks enemies → side towers → main tower
- Turn-based resource management: +3 supply per turn, max supply tracked
- Tower defense mechanics (main tower + side towers with 10/6/6 health)

**Data Persistence:**
- LocalStorage for deck persistence with versioning system
- Deck storage includes card names (not full data) for migration flexibility
- Maximum 10 saved decks per user with automatic pruning

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Vite middleware integration for development HMR
- Custom logging middleware for API request tracking

**API Design:**
- RESTful endpoints for game session management
- Placeholder routes for future multiplayer functionality
- Routes: game session creation, state retrieval, action processing, statistics

**Development vs Production:**
- Development: Vite dev server with HMR for instant feedback
- Production: Static file serving from compiled `dist/public` directory
- Environment-aware setup in `server/vite.ts`

**Storage Layer:**
- In-memory storage implementation (`MemStorage`) for development
- Interface-based design (`IStorage`) for future database integration
- User management schema defined but not actively used in current game flow

### External Dependencies

**Database:**
- Drizzle ORM configured for PostgreSQL (via `@neondatabase/serverless`)
- Schema defined in `shared/schema.ts` with user table
- Migration support via `drizzle-kit` (currently unused for game state)
- Connection via `DATABASE_URL` environment variable

**UI Component Libraries:**
- Extensive Radix UI component collection for accessible primitives:
  - Dialog, Dropdown, Tooltip, Accordion, Alert Dialog
  - Select, Checkbox, Radio Group, Slider, Switch
  - Navigation Menu, Context Menu, Hover Card
  - Tabs, Toast, Progress, Scroll Area
- `class-variance-authority` for component variant styling
- `cmdk` for command palette functionality

**Animation & 3D (Legacy):**
- `@react-three/fiber` and `@react-three/drei` for 3D rendering (not used in current 2D version)
- `@react-three/postprocessing` for shader effects (not used)
- `vite-plugin-glsl` for shader support
- Framer Motion for 2D animations (actively used)

**Build & Development Tools:**
- TypeScript with strict mode and ESNext modules
- Path aliases: `@/` for client source, `@shared/` for shared code
- PostCSS with Tailwind and Autoprefixer
- Asset handling for GLTF/GLB models and audio files (MP3, OGG, WAV)

**Runtime:**
- `tsx` for TypeScript execution in development
- `esbuild` for server-side bundling in production
- Environment variable management for database connections

## Recent Changes

**Date:** October 13, 2025 - v.2.8 (beta) [build 31027]

**Critical Bug Fixes:**
- ✅ Fixed AI deck initialization bug: AI now correctly uses cards from its own faction instead of player's faction cards
  - Previously AI was initialized with `state.playerDeck` causing it to play player faction cards
  - Now AI gets proper faction cards via `getCardsByFaction(aiFaction)`
  - This ensures AI plays correct faction cards with proper artwork and stats

**Deck Building Improvements:**
- ✅ All 8 cards in deck must now be unique - no duplicates allowed
  - `addCard` function checks if card already exists before adding
  - `fillWithRandom` filters out already-used cards
  - Visual indicator: cards already in deck show with 50% opacity and ✓ mark
- ✅ Cards remain on battlefield until destroyed (health drops to 0)

**Gameplay Improvements:**
- ✅ Supply points now accumulate if not spent (removed max supply cap)
  - Previously supply was capped at maxSupply value
  - Now unspent supply carries over to next turns

**Version Updates:**
- ✅ Version updated to v.2.8 (beta) [build 31027]

**Previous Updates (v2.4):**
- ✅ Converted flying units to aerial bombardment bonus cards (ignore units, attack towers directly)
- ✅ Added spy unit class: "Разведчик-шпион" (Whites), "Агент ВЧК" (Reds) - attack main tower directly
- ✅ Supply generation increased from +1 to +3 per turn for faster gameplay
- ✅ Combat mechanics improved: center lane attacks enemies first, then side towers, then main tower
- ✅ Enhanced AI logic to play bonus cards and use aerial bombardment strategically
- ✅ Card parameter icons changed from text (ATK/TWR/HP) to minimalist icons (Swords/Castle/Heart)
- ✅ All card images replaced with Russian Civil War 1917 themed images
- ✅ Menu buttons redesigned with game-like textures using gradients and shadows
- ✅ Studio credits added: "Студия Марка Минченко"

**Known Issues:**
- Background music still uses placeholder. User can replace `/sounds/background.mp3` with sad/heavy piano music from Pixabay

## Replit Environment Setup

**Date:** October 13, 2025

**Development Setup:**
- Workflow configured: `npm run dev` on port 5000
- Frontend served at 0.0.0.0:5000 with allowedHosts enabled for Replit proxy
- Vite dev server with HMR for hot module reloading
- All dependencies installed via npm

**Deployment Configuration:**
- Deployment target: Autoscale (stateless web app)
- Build command: `npm run build` (builds both frontend and backend)
- Run command: `npm run start` (production mode with static file serving)
- Output directory: `dist/public` for frontend, `dist/index.js` for backend

**Database Status:**
- Database not provisioned (in-memory storage used via MemStorage)
- Future PostgreSQL integration available via Drizzle ORM
- User authentication schema defined but not actively used
- Game state managed client-side with localStorage for deck persistence

**Port Configuration:**
- Development: Port 5000 (both API and frontend)
- Backend API endpoints: `/api/*`
- Frontend: All other routes handled by Vite/static files

**Current Status:**
- ✅ Dependencies installed
- ✅ Development server running
- ✅ Frontend accessible and functional
- ✅ Build process verified
- ✅ Deployment configured
- ✅ Game loads with main menu and deck builder