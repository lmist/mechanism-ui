# mechanism-ui

**Headless React, done right.**

The hook is the engine. The component is just the terminal.

This repo contains the strict `headless-component` rule + five production-grade Next.js 15 + TypeScript examples generated with Claude Opus 4.7.

## The Rule

> Separate policy from mechanism; separate interfaces from engines.
> — Eric S. Raymond

All state, logic, event handlers, derived values, side effects, and ARIA live in a custom hook (`mechanism`).  
The render layer (`policy`) only contains markup, classes, DOM structure, and element choice.

No exceptions. No inline handlers. No `useState` in components.

## What's Inside

- `SKILL.md` — the complete strict rule (use this with Claude / Cursor / any agent)
- `prompts/generation-prompts.md` — exact prompts that produced the examples
- `examples/` — five real Next.js apps:
  - `01-disclosure` — hook-only controlled/uncontrolled toggle
  - `02-tabs` — compound tabs with context + thin wrappers
  - `03-combobox` — headless autocomplete with keyboard nav
  - `04-accordion` — multi/single expand modes
  - `05-table` — data table with sorting, pagination, selection

## Philosophy

Engines outlive interfaces.  
If you bake the UI into the logic, every design change forces a rewrite.  
Keep the mechanism pure and the terminal stupid.

## Usage

Drop `SKILL.md` into your project or pass it to your coding agent on every React UI task.

The examples demonstrate both hook-only and compound (context + wrappers) patterns, controlled vs uncontrolled modes, stable prop bundles, and strong TypeScript.

## License

MIT
