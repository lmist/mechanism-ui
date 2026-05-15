Files created:
- `headless-component/hooks/use-disclosure.ts:1` — hook (mechanism)
- `headless-component/app/page.tsx:1` — markup (policy)

The render layer holds zero `useState`/`useEffect`, no computed aria, no handler bodies — only element choice and Tailwind classes. State, transitions, and aria wiring live entirely in the hook.