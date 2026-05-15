Created three files under `components/accordion/`:

- `use-accordion.ts:1` — engine: state, mode dispatch (single/multiple), controlled/uncontrolled merge, id generation, aria + data-state prop bundles, contexts.
- `accordion.tsx:1` — thin wrappers (`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionIndicator`, `AccordionPanel`) that spread hook-supplied props onto Tailwind-styled markup.
- `index.ts:1` — barrel.

Render layer contains no `useState`/`useReducer`/`useEffect`, no inline handlers, no computed aria — all of it flows from `useAccordion`/`useAccordionItemContext`.