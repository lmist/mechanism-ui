Created at `app/components/tabs/`:
- `use-tabs.ts` — engine: state, controlled/uncontrolled handling, keyboard nav (arrows/Home/End, vertical-aware), automatic vs manual activation, focus management via tab refs, stable per-index handler cache, all aria/data-state values.
- `tabs.tsx` — policy: `Tabs` provider + thin `TabList`/`Tab`/`TabPanel` wrappers. Zero state, zero handlers, zero conditional aria. Tailwind styling driven entirely by `data-[state=active]`/`data-[orientation=…]` attributes from the hook.
- `index.ts` — barrel exports.

Render layers contain no `useState`/`useReducer`/`useEffect`, no inline handlers, no computed aria — every dynamic value comes from `getTabListProps`/`getTabProps`/`getPanelProps`.