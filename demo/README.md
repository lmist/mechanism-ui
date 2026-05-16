# mechanism-ui demo

A Next.js 16 + React 19 app that demonstrates the [`headless-component`](../SKILL.md) rule. Sidebar nav, the live previews, and the copy buttons are all built on the same hooks the demos teach.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

- `app/page.tsx` — Server Component. Reads each hook's source from `hooks/*.ts` at request time and passes it to the client orchestrator. This is why the snippets shown in the UI never drift from the actual code.
- `app/demo-app.tsx` — Client orchestrator. Uses `useTabs` for sidebar navigation (vertical orientation, arrow-key nav).
- `hooks/` — Reference implementations:
  - `useDisclosure` — controlled/uncontrolled open state, memoized prop bundles.
  - `useTabs` — controlled/uncontrolled, vertical or horizontal keyboard nav.
  - `useCombobox` — generic over option type, ARIA combobox, `aria-activedescendant`, full keyboard nav.
  - `useAccordion` — single or multiple expand mode, controlled set of open indices.
  - `useDataTable` — sort (asc/desc/none), pagination, row selection, generic over row type.
  - `useCopyToClipboard` — used by the demo's code snippet copy buttons.

## The point

Every UI component in this app is a *thin policy layer*: it spreads hook output onto markup and chooses element types and classes. None of them owns state, defines inline handlers, or computes ARIA values in render. Audit any file under `app/` to verify.

Live: https://demo-summerjam.vercel.app
