# Generation Prompts Used with Claude Opus 4.7

All five Next.js examples were generated using `claude -p` with the following strict system prompt + task.

## Base Strict Prompt (injected for every generation)

```markdown
---
name: headless-component
strict: true
---
# headless-component (STRICT)

## Grounding
"Separate policy from mechanism; separate interfaces from engines." — Eric S. Raymond

The hook is the engine. State, transitions, handlers, aria — all live there. The component (if any) is the terminal: it wires hook output to markup and nothing else.

## The constraint
This is a strict rule, never violated. Components are **never** written non-headlessly.

**In the hook (mechanism):**
- All state — useState, useReducer
- All derived values and computations
- All event handlers
- All aria attribute values
- All side effects — useEffect
- All useMemo, useCallback for performance

**In render (policy):**
- Which HTML elements to use
- Class names and inline styles
- DOM structure and visual hierarchy
- Conditional rendering driven solely by values the hook exposes

Never the other way around. Any component that owns state, computes values, or handles events directly must be rewritten.

## When to emit a component vs. just a hook
- Single stateful element: ship ONLY the hook.
- Compound: hook + context provider + thin wrapper components.

Default to hook-only. Add wrappers only when multiple distinct render points genuinely need shared state.

## Controlled vs Uncontrolled
Always support both modes explicitly. Accept optional value/onChange.

## Production requirements
- Use useCallback and useMemo appropriately.
- Return stable prop bundles.
- Provide strong TypeScript support.
- Document controlled vs uncontrolled behavior clearly.

Self-check: render layer must contain ZERO useState/useReducer/useEffect, ZERO inline handlers, ZERO computed aria/state logic.
```

## Per-App Task Prompts

### 01-disclosure
```
TASK: Create a production-grade useDisclosure hook for Next.js 15 (TypeScript). Support controlled and uncontrolled modes. Return isOpen, open, close, toggle, triggerProps, contentProps. Include full JSDoc and example usage in a page.tsx.
```

### 02-tabs
```
TASK: Create useTabs hook + Tabs context provider + TabList/Tab/TabPanel thin wrappers for Next.js. Support defaultIndex and controlled activeIndex. Return stable getTabProps/getPanelProps. Full TypeScript, ARIA compliant.
```

### 03-combobox
```
TASK: Create useCombobox hook (headless) for Next.js autocomplete/combobox with keyboard navigation, ARIA, filtering. Return inputProps, listProps, optionProps, isOpen, filteredOptions etc. Controlled value support.
```

### 04-accordion
```
TASK: Create useAccordion compound component (hook + context + Accordion/AccordionItem/Trigger/Panel). Support single/multiple expand modes and controlled state.
```

### 05-table
```
TASK: Create useDataTable headless hook for Next.js returning prop factories for sorting, pagination, row selection. Include TypeScript types for Column, Row. No render logic in hook.
```

All generations used Claude Opus 4.7 (`claude-opus-4-7`) via the `claude -p` CLI with the combined strict prompt + task.
