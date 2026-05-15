---
name: headless-component
description: |
  Strict rule for all React UI work: Build components headlessly. 
  Put all state, logic, event handlers, derived values, side effects and ARIA in a custom hook (mechanism). 
  Render layer is policy only — markup, styling, DOM structure and element choice. 
  Never mix the two. Invoked on every component written or reviewed. 
  Encodes ESR’s Rule of Separation: separate policy from mechanism, interfaces from engines.
version: 1.0.0
allowed-tools: Read, Edit, Write, Bash
argument-hint: <ComponentName> [short description]
strict: true
---

# headless-component

## Grounding

> "Separate policy from mechanism; separate interfaces from engines."
> — Eric S. Raymond, *The Art of Unix Programming*

The hook is the engine. State, transitions, handlers, aria — all live there. The component (if any) is the terminal: it wires hook output to markup and nothing else. Engines outlive interfaces; bake the interface into the engine and you have to rewrite the logic every time the design changes.

## The constraint

This is a strict rule, never violated. Components are **never** written non-headlessly.

**In the hook (mechanism):**
- All state — `useState`, `useReducer`
- All derived values and computations
- All event handlers
- All aria attribute values
- All side effects — `useEffect`
- All `useMemo`, `useCallback` for performance

**In render (policy):**
- Which HTML elements to use
- Class names and inline styles
- DOM structure and visual hierarchy
- Conditional rendering driven solely by values the hook exposes

Never the other way around. Any component that owns state, computes values, or handles events directly must be rewritten.

## When to emit a component vs. just a hook

**Single stateful element** — toggle, popover, combobox, slider, etc.  
Ship **only** the hook. The consumer renders whatever markup they want.

**Compound element** — tabs, accordion, menu, listbox, form groups, etc.  
Ship a hook + context provider + thin wrapper components that read from context.  
Wrappers exist only to provide convenient shared render points.

Default to hook-only. Add wrapper components only when multiple distinct render points genuinely need shared state.

## Example 1 — Hook-only (`useDisclosure`)

```tsx
import { useState, useCallback } from 'react'

export function useDisclosure({ open: controlledOpen, onOpenChange } = {}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }, [isControlled, onOpenChange])

  const open = useCallback(() => setOpen(true), [setOpen])
  const close = useCallback(() => setOpen(false), [setOpen])
  const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen])

  return {
    isOpen,
    open,
    close,
    toggle,
    triggerProps: {
      'aria-expanded': isOpen,
      onClick: toggle,
    },
    contentProps: {
      hidden: !isOpen,
    },
  }
}
```

Consumer usage:

```tsx
function FAQ() {
  const { triggerProps, contentProps } = useDisclosure()
  return (
    <>
      <button {...triggerProps}>Show answer</button>
      <p {...contentProps}>It's headless.</p>
    </>
  )
}
```

## Example 2 — Compound (`useTabs`)

```tsx
import { createContext, useContext, useState, useCallback } from 'react'

const TabsContext = createContext(null)

export function useTabs(defaultIndex = 0) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)

  const getTabProps = useCallback((index: number) => ({
    role: 'tab',
    'aria-selected': activeIndex === index,
    onClick: () => setActiveIndex(index),
  }), [activeIndex])

  const getPanelProps = useCallback((index: number) => ({
    role: 'tabpanel',
    hidden: activeIndex !== index,
  }), [activeIndex])

  return { activeIndex, getTabProps, getPanelProps }
}

export function Tabs({ children, defaultIndex = 0 }) {
  const ctx = useTabs(defaultIndex)
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>
}

export function TabList({ children }: { children: React.ReactNode }) {
  return <div role="tablist">{children}</div>
}

export function Tab({ children, index }: { children: React.ReactNode; index: number }) {
  const { getTabProps } = useContext(TabsContext)
  return <button {...getTabProps(index)}>{children}</button>
}

export function TabPanel({ children, index }: { children: React.ReactNode; index: number }) {
  const { getPanelProps } = useContext(TabsContext)
  return <div {...getPanelProps(index)}>{children}</div>
}
```

## Controlled vs Uncontrolled

Always support both modes explicitly (see `useDisclosure` example).

## Self-check before returning

Before marking any component as done, verify the render layer contains **none** of the following:

- `useState`, `useReducer`, `useEffect`
- Inline handlers (`onClick={() => ...}`)
- Computed aria values or any state-derived logic
- Any conditional rendering that computes state instead of reading it from the hook

If any are found, move them into the hook.

## Production requirements

- Use `useCallback` and `useMemo` appropriately inside hooks.
- Return stable prop bundles where possible.
- Provide strong TypeScript support.
- Document controlled vs uncontrolled behavior clearly.
