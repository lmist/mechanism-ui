Created at `app/components/combobox/`:
- `useCombobox.ts` — headless hook: state, keyboard nav (Arrow/Home/End/Enter/Esc/Tab), ARIA combobox/listbox/option wiring, active-descendant, filtering, controlled+uncontrolled for `value`/`inputValue`/`isOpen`, scroll-into-view, loop, openOnFocus, closeOnSelect.
- `index.ts` — barrel.

Render layer contains zero state/effects/handlers — consumers spread `getInputProps()`, `getListProps()`, `getOptionProps({option,index})` onto plain Tailwind markup.