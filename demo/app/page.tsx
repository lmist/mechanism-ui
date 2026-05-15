'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useDisclosure } from '../hooks/useDisclosure';
import { useTabs } from '../hooks/useTabs';
import { useCombobox } from '../hooks/useCombobox';
import { useAccordion } from '../hooks/useAccordion';
import { useDataTable, type Row } from '../hooks/useDataTable';

const demos = [
  { id: 'disclosure', label: 'useDisclosure', desc: 'Hook-only • Controlled + uncontrolled' },
  { id: 'tabs', label: 'useTabs', desc: 'Compound with context' },
  { id: 'combobox', label: 'useCombobox', desc: 'Hook-only autocomplete' },
  { id: 'accordion', label: 'useAccordion', desc: 'Compound + single expand' },
  { id: 'table', label: 'useDataTable', desc: 'Prop factories for complex UI' },
] as const;

type DemoId = typeof demos[number]['id'];

export default function MechanismUIDemo() {
  const [activeDemo, setActiveDemo] = useState<DemoId>('disclosure');

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-[#ededed] font-sans">
      {/* Sidebar */}
      <div className="w-72 border-r border-[#222] bg-[#0a0a0a] flex flex-col">
        <div className="p-8 border-b border-[#222]">
          <div className="font-mono text-[10px] tracking-[3px] text-[#d4af37] mb-1">MECHANISM UI</div>
          <div className="text-3xl font-semibold tracking-[-1.5px]">headless</div>
          <div className="text-[13px] text-[#666] mt-2 leading-tight">Hook is the engine.<br />Render is just the terminal.</div>
        </div>

        <div className="p-4 flex-1">
          {demos.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setActiveDemo(demo.id)}
              className={`w-full text-left px-5 py-4 rounded-lg mb-1 transition-all ${
                activeDemo === demo.id
                  ? 'bg-[#111] border-l-[3px] border-[#d4af37]'
                  : 'hover:bg-[#0f0f0f]'
              }`}
            >
              <div className="font-medium text-[15px]">{demo.label}</div>
              <div className="text-xs text-[#666] mt-0.5">{demo.desc}</div>
            </button>
          ))}
        </div>

        <div className="p-8 text-[10px] font-mono tracking-[2px] text-[#555] border-t border-[#222]">
          RULE OF SEPARATION
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-[#222] flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <div className="font-mono text-[#d4af37] text-sm tracking-widest">{activeDemo}</div>
            <div className="text-xs text-[#666]">{demos.find(d => d.id === activeDemo)?.desc}</div>
          </div>
          <div className="text-xs px-3 py-1 rounded border border-[#222] text-[#666]">FLAT INDUSTRIAL</div>
        </div>

        <div className="flex-1 overflow-auto p-10">
          <div className="max-w-5xl mx-auto">
            <DemoRenderer id={activeDemo} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DemoRenderer({ id }: { id: DemoId }) {
  if (id === 'disclosure') return <DisclosureDemo />;
  if (id === 'tabs') return <TabsDemo />;
  if (id === 'combobox') return <ComboboxDemo />;
  if (id === 'accordion') return <AccordionDemo />;
  if (id === 'table') return <TableDemo />;
  return null;
}

function CodeBlock({ code, title }: { code: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-[10px] tracking-[1px] text-[#d4af37]">{title}</div>
        <button onClick={copy} className="text-[10px] text-[#666] hover:text-[#d4af37] transition-colors">
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="rounded-lg overflow-hidden border border-[#222] text-sm">
        <SyntaxHighlighter
          language="tsx"
          style={oneDark}
          customStyle={{ margin: 0, background: '#0a0a0a', fontSize: '12.5px' }}
          showLineNumbers
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

/* ===================== DISCLOSURE ===================== */
function DisclosureDemo() {
  const { isOpen, triggerProps, contentProps } = useDisclosure();

  const mechanism = `export function useDisclosure({ open, onOpenChange } = {}) {
  const [internal, setInternal] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internal;

  const setOpen = (next) => {
    if (!isControlled) setInternal(next);
    onOpenChange?.(next);
  };

  return {
    isOpen,
    triggerProps: { 'aria-expanded': isOpen, onClick: () => setOpen(!isOpen) },
    contentProps: { hidden: !isOpen },
  };
}`;

  const policy = `<button {...triggerProps}>Toggle</button>
<div {...contentProps}>Hidden until opened</div>`;

  return (
    <div className="space-y-10">
      <div>
        <div className="text-6xl tracking-[-3px] font-semibold mb-3">useDisclosure</div>
        <div className="text-[#888] text-lg">Hook-only. Clean separation.</div>
      </div>

      <div className="border border-[#222] bg-[#0a0a0a] p-10 rounded-2xl">
        <button {...triggerProps} className="px-8 py-3 rounded-lg bg-[#111] border border-[#222] hover:border-[#d4af37] transition-all text-sm tracking-widest">
          {isOpen ? 'CLOSE' : 'OPEN'}
        </button>
        <div {...contentProps} className="mt-8 text-[#999] text-[15px] leading-relaxed">
          The state lives in the hook.<br />The button and div are pure policy.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CodeBlock code={mechanism} title="MECHANISM — Hook" />
        <CodeBlock code={policy} title="POLICY — Render" />
      </div>
    </div>
  );
}

/* ===================== TABS ===================== */
function TabsDemo() {
  const { getTabProps, getPanelProps } = useTabs(0);

  const mechanism = `export function useTabs(defaultIndex = 0) {
  const [active, setActive] = useState(defaultIndex);

  return {
    getTabProps: (i) => ({
      role: 'tab',
      'aria-selected': active === i,
      onClick: () => setActive(i),
    }),
    getPanelProps: (i) => ({
      role: 'tabpanel',
      hidden: active !== i,
    }),
  };
}`;

  const policy = `<div role="tablist">
  <button {...getTabProps(0)}>One</button>
  <button {...getTabProps(1)}>Two</button>
</div>
<div {...getPanelProps(0)}>Panel 1</div>
<div {...getPanelProps(1)}>Panel 2</div>`;

  return (
    <div className="space-y-10">
      <div>
        <div className="text-6xl tracking-[-3px] font-semibold mb-3">useTabs</div>
        <div className="text-[#888] text-lg">Compound pattern with context.</div>
      </div>

      <div className="border border-[#222] bg-[#0a0a0a] rounded-2xl overflow-hidden">
        <div className="flex border-b border-[#222]">
          {[0,1,2].map(i => <button key={i} {...getTabProps(i)} className="px-8 py-4 text-sm border-r border-[#222] last:border-r-0 data-[state=active]:text-[#d4af37]">Tab {i+1}</button>)}
        </div>
        {[0,1,2].map(i => <div key={i} {...getPanelProps(i)} className="p-10 text-[#999]">{i === 0 && "First panel content lives here."}{i === 1 && "Second panel."}{i === 2 && "Third panel."}</div>)}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CodeBlock code={mechanism} title="MECHANISM — Hook + Context" />
        <CodeBlock code={policy} title="POLICY — Thin wrappers" />
      </div>
    </div>
  );
}

/* ===================== COMBOBOX ===================== */
function ComboboxDemo() {
  const { inputProps, listProps, getOptionProps, isOpen, filtered } = useCombobox(['Vercel', 'Railway', 'Fly.io', 'Render', 'Netlify']);

  const mechanism = `export function useCombobox(options) {
  const [q, setQ] = useState('');
  const filtered = options.filter(o => o.includes(q));
  return {
    inputProps: { value: q, onChange: e => setQ(e.target.value) },
    getOptionProps: (opt) => ({ onClick: () => setQ(opt) }),
    filtered,
    isOpen: q.length > 0,
  };
}`;

  const policy = `<input {...inputProps} />
{isOpen && filtered.map(opt => 
  <div {...getOptionProps(opt)}>{opt}</div>
)}`;

  return (
    <div className="space-y-10">
      <div>
        <div className="text-6xl tracking-[-3px] font-semibold mb-3">useCombobox</div>
        <div className="text-[#888] text-lg">Hook-only with keyboard-ready props.</div>
      </div>

      <div className="border border-[#222] bg-[#0a0a0a] p-10 rounded-2xl">
        <input {...inputProps} className="w-full bg-black border border-[#222] px-5 py-3 rounded-lg text-sm" />
        {isOpen && (
          <div {...listProps} className="mt-2 border border-[#222] rounded-lg overflow-hidden">
            {filtered.map((o, i) => <div key={i} {...getOptionProps(o)} className="px-5 py-2.5 hover:bg-[#111] cursor-pointer">{o}</div>)}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CodeBlock code={mechanism} title="MECHANISM — Hook" />
        <CodeBlock code={policy} title="POLICY — Usage" />
      </div>
    </div>
  );
}

/* ===================== ACCORDION ===================== */
function AccordionDemo() {
  const { getTriggerProps, getContentProps } = useAccordion();

  const mechanism = `export function useAccordion() {
  const [open, setOpen] = useState(null);
  return {
    getTriggerProps: (i) => ({ onClick: () => setOpen(open === i ? null : i) }),
    getContentProps: (i) => ({ hidden: open !== i }),
  };
}`;

  const policy = `{[0,1,2].map(i => (
  <div key={i}>
    <button {...getTriggerProps(i)}>Section {i}</button>
    <div {...getContentProps(i)}>Content</div>
  </div>
))}`;

  return (
    <div className="space-y-10">
      <div>
        <div className="text-6xl tracking-[-3px] font-semibold mb-3">useAccordion</div>
        <div className="text-[#888] text-lg">Compound component.</div>
      </div>

      <div className="border border-[#222] bg-[#0a0a0a] rounded-2xl divide-y divide-[#222]">
        {[0,1,2].map(i => (
          <div key={i}>
            <button {...getTriggerProps(i)} className="w-full flex justify-between px-8 py-5 text-left">
              Section {i + 1} <span className="text-[#666]">+</span>
            </button>
            <div {...getContentProps(i)} className="px-8 pb-8 text-[#888]">Content for section {i + 1}.</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CodeBlock code={mechanism} title="MECHANISM — Hook" />
        <CodeBlock code={policy} title="POLICY — Usage" />
      </div>
    </div>
  );
}

/* ===================== DATA TABLE ===================== */
function TableDemo() {
  const data: Row[] = [
    { id: 1, name: 'Alice', role: 'Engineer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Carol', role: 'PM' },
  ];
  const { getHeaderProps, getRowProps, sortedData } = useDataTable(data);

  const mechanism = `export function useDataTable(data) {
  const [sort, setSort] = useState(null);
  const sorted = [...data].sort(...);
  return {
    getHeaderProps: (key) => ({ onClick: () => setSort(key) }),
    getRowProps: () => ({}),
    sortedData: sorted,
  };
}`;

  const policy = `<table>
  <thead>
    <th {...getHeaderProps('name')}>Name</th>
  </thead>
  {sortedData.map(row => 
    <tr {...getRowProps(row)}>...</tr>
  )}
</table>`;

  return (
    <div className="space-y-10">
      <div>
        <div className="text-6xl tracking-[-3px] font-semibold mb-3">useDataTable</div>
        <div className="text-[#888] text-lg">Returns prop factories for complex UIs.</div>
      </div>

      <div className="border border-[#222] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#222]">
              <th {...getHeaderProps('name')} className="text-left p-6 cursor-pointer">Name</th>
              <th {...getHeaderProps('role')} className="text-left p-6 cursor-pointer">Role</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, i) => (
              <tr key={i} {...getRowProps(row)} className="border-b border-[#222] last:border-none">
                <td className="p-6">{row.name}</td>
                <td className="p-6 text-[#777]">{row.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <CodeBlock code={mechanism} title="MECHANISM — Hook" />
        <CodeBlock code={policy} title="POLICY — Usage" />
      </div>
    </div>
  );
}
