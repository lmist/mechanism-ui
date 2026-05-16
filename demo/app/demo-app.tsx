'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

import { useAccordion } from '../hooks/useAccordion';
import { useCombobox } from '../hooks/useCombobox';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { useDataTable } from '../hooks/useDataTable';
import { useDisclosure } from '../hooks/useDisclosure';
import { useTabs } from '../hooks/useTabs';

type DemoId = 'disclosure' | 'tabs' | 'combobox' | 'accordion' | 'table';

interface DemoMeta {
  id: DemoId;
  label: string;
  desc: string;
  sourceKey: keyof Sources;
}

const DEMOS: ReadonlyArray<DemoMeta> = [
  { id: 'disclosure', label: 'useDisclosure', desc: 'Hook-only · Controlled + uncontrolled', sourceKey: 'disclosure' },
  { id: 'tabs', label: 'useTabs', desc: 'Compound with context + keyboard nav', sourceKey: 'tabs' },
  { id: 'combobox', label: 'useCombobox', desc: 'Hook-only autocomplete + ARIA', sourceKey: 'combobox' },
  { id: 'accordion', label: 'useAccordion', desc: 'Single / multiple modes', sourceKey: 'accordion' },
  { id: 'table', label: 'useDataTable', desc: 'Sort, paginate, select', sourceKey: 'dataTable' },
];

export interface Sources {
  disclosure: string;
  tabs: string;
  combobox: string;
  accordion: string;
  dataTable: string;
}

export function DemoApp({ sources }: { sources: Sources }) {
  const { activeIndex, tabListProps, getTabProps, getPanelProps } = useTabs({
    count: DEMOS.length,
    orientation: 'vertical',
  });
  const active = DEMOS[activeIndex];

  return (
    <div className="flex h-screen bg-[#0d0d0d] text-[#ededed] font-sans">
      <aside className="w-72 border-r border-[#222] bg-[#0a0a0a] flex flex-col">
        <div className="p-8 border-b border-[#222]">
          <div className="font-mono text-[10px] tracking-[3px] text-[#d4af37] mb-1">MECHANISM UI</div>
          <div className="text-3xl font-semibold tracking-[-1.5px]">headless</div>
          <div className="text-[13px] text-[#666] mt-2 leading-tight">
            Hook is the engine.
            <br />
            Render is just the terminal.
          </div>
        </div>

        <nav {...tabListProps} aria-label="Demos" className="p-4 flex-1">
          {DEMOS.map((demo, i) => (
            <button
              key={demo.id}
              {...getTabProps(i)}
              className="w-full text-left px-5 py-4 rounded-lg mb-1 transition-all hover:bg-[#0f0f0f] data-[state=active]:bg-[#111] data-[state=active]:border-l-[3px] data-[state=active]:border-[#d4af37]"
            >
              <div className="font-medium text-[15px]">{demo.label}</div>
              <div className="text-xs text-[#666] mt-0.5">{demo.desc}</div>
            </button>
          ))}
        </nav>

        <div className="p-8 text-[10px] font-mono tracking-[2px] text-[#555] border-t border-[#222]">
          RULE OF SEPARATION
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-[#222] flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <div className="font-mono text-[#d4af37] text-sm tracking-widest">{active.id}</div>
            <div className="text-xs text-[#666]">{active.desc}</div>
          </div>
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs bg-[#111] px-4 py-1.5 rounded border border-[#222] text-[#d4af37]">
              npx headless-component
            </div>
            <div className="text-xs px-3 py-1 rounded border border-[#222] text-[#666]">FLAT INDUSTRIAL</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-10">
          <div className="max-w-5xl mx-auto">
            {DEMOS.map((demo, i) => (
              <section key={demo.id} {...getPanelProps(i)}>
                <DemoBody demo={demo} source={sources[demo.sourceKey]} />
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function DemoBody({ demo, source }: { demo: DemoMeta; source: string }) {
  switch (demo.id) {
    case 'disclosure':
      return <DisclosureDemo source={source} />;
    case 'tabs':
      return <TabsDemo source={source} />;
    case 'combobox':
      return <ComboboxDemo source={source} />;
    case 'accordion':
      return <AccordionDemo source={source} />;
    case 'table':
      return <TableDemo source={source} />;
  }
}

function CodeBlock({ code, title }: { code: string; title: string }) {
  const { label, buttonProps } = useCopyToClipboard(code);
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-[10px] tracking-[1px] text-[#d4af37]">{title}</div>
        <button
          {...buttonProps}
          className="text-[10px] text-[#666] hover:text-[#d4af37] transition-colors"
        >
          {label}
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

function DemoFrame({
  title,
  subtitle,
  preview,
  mechanism,
  policy,
}: {
  title: string;
  subtitle: string;
  preview: React.ReactNode;
  mechanism: string;
  policy: string;
}) {
  return (
    <div className="space-y-10">
      <div>
        <div className="text-6xl tracking-[-3px] font-semibold mb-3">{title}</div>
        <div className="text-[#888] text-lg">{subtitle}</div>
      </div>

      <div className="border border-[#222] bg-[#0a0a0a] p-10 rounded-2xl">{preview}</div>

      <div className="grid grid-cols-2 gap-6">
        <CodeBlock code={mechanism} title="MECHANISM — Hook source" />
        <CodeBlock code={policy} title="POLICY — Example consumer" />
      </div>
    </div>
  );
}

/* ===================== DISCLOSURE ===================== */

const DISCLOSURE_POLICY = `function FAQ() {
  const { isOpen, triggerProps, contentProps } = useDisclosure();
  return (
    <>
      <button {...triggerProps}>{isOpen ? 'CLOSE' : 'OPEN'}</button>
      <div {...contentProps}>The state lives in the hook.</div>
    </>
  );
}`;

function DisclosureDemo({ source }: { source: string }) {
  const { isOpen, triggerProps, contentProps } = useDisclosure();
  return (
    <DemoFrame
      title="useDisclosure"
      subtitle="Hook-only. Clean separation."
      mechanism={source}
      policy={DISCLOSURE_POLICY}
      preview={
        <>
          <button
            {...triggerProps}
            className="px-8 py-3 rounded-lg bg-[#111] border border-[#222] hover:border-[#d4af37] transition-all text-sm tracking-widest"
          >
            {isOpen ? 'CLOSE' : 'OPEN'}
          </button>
          <div {...contentProps} className="mt-8 text-[#999] text-[15px] leading-relaxed">
            The state lives in the hook.
            <br />
            The button and div are pure policy.
          </div>
        </>
      }
    />
  );
}

/* ===================== TABS ===================== */

const TABS_POLICY = `function Demo() {
  const { tabListProps, getTabProps, getPanelProps } = useTabs({ count: 3 });
  return (
    <>
      <div {...tabListProps}>
        <button {...getTabProps(0)}>One</button>
        <button {...getTabProps(1)}>Two</button>
        <button {...getTabProps(2)}>Three</button>
      </div>
      <div {...getPanelProps(0)}>Panel 1</div>
      <div {...getPanelProps(1)}>Panel 2</div>
      <div {...getPanelProps(2)}>Panel 3</div>
    </>
  );
}`;

function TabsDemo({ source }: { source: string }) {
  const { tabListProps, getTabProps, getPanelProps } = useTabs({ count: 3 });
  return (
    <DemoFrame
      title="useTabs"
      subtitle="Compound pattern. Arrow keys + Home/End wired in the hook."
      mechanism={source}
      policy={TABS_POLICY}
      preview={
        <div className="rounded-xl overflow-hidden border border-[#222]">
          <div {...tabListProps} className="flex border-b border-[#222]">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                {...getTabProps(i)}
                className="px-8 py-4 text-sm border-r border-[#222] last:border-r-0 data-[state=active]:text-[#d4af37]"
              >
                Tab {i + 1}
              </button>
            ))}
          </div>
          {[0, 1, 2].map((i) => (
            <div key={i} {...getPanelProps(i)} className="p-10 text-[#999]">
              {i === 0 && 'First panel content lives here.'}
              {i === 1 && 'Second panel.'}
              {i === 2 && 'Third panel.'}
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ===================== COMBOBOX ===================== */

const COMBOBOX_OPTIONS = ['Vercel', 'Railway', 'Fly.io', 'Render', 'Netlify'];

const COMBOBOX_POLICY = `function Demo() {
  const { inputProps, listProps, getOptionProps, isOpen, filtered } =
    useCombobox({ options: ['Vercel', 'Railway', 'Fly.io'] });

  return (
    <>
      <input {...inputProps} />
      {isOpen && (
        <ul {...listProps}>
          {filtered.map((opt, i) => (
            <li key={opt} {...getOptionProps(opt, i)}>{opt}</li>
          ))}
        </ul>
      )}
    </>
  );
}`;

function ComboboxDemo({ source }: { source: string }) {
  const { inputProps, listProps, getOptionProps, isOpen, filtered } = useCombobox({
    options: COMBOBOX_OPTIONS,
  });
  return (
    <DemoFrame
      title="useCombobox"
      subtitle="Hook-only autocomplete. ARIA + keyboard nav in the engine."
      mechanism={source}
      policy={COMBOBOX_POLICY}
      preview={
        <>
          <input
            {...inputProps}
            className="w-full bg-black border border-[#222] px-5 py-3 rounded-lg text-sm"
          />
          {isOpen && (
            <ul {...listProps} className="mt-2 border border-[#222] rounded-lg overflow-hidden">
              {filtered.map((o, i) => (
                <li
                  key={o}
                  {...getOptionProps(o, i)}
                  className="px-5 py-2.5 cursor-pointer data-[state=active]:bg-[#111] data-[state=active]:text-[#d4af37]"
                >
                  {o}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-5 py-2.5 text-[#555] italic">No matches</li>
              )}
            </ul>
          )}
        </>
      }
    />
  );
}

/* ===================== ACCORDION ===================== */

const ACCORDION_POLICY = `function Demo() {
  const { getTriggerProps, getContentProps } = useAccordion({ mode: 'single' });
  return [0, 1, 2].map((i) => (
    <div key={i}>
      <button {...getTriggerProps(i)}>Section {i + 1}</button>
      <div {...getContentProps(i)}>Content for section {i + 1}</div>
    </div>
  ));
}`;

function AccordionDemo({ source }: { source: string }) {
  const { getTriggerProps, getContentProps } = useAccordion({ mode: 'single' });
  return (
    <DemoFrame
      title="useAccordion"
      subtitle="Single mode shown — pass mode='multiple' for multi-expand."
      mechanism={source}
      policy={ACCORDION_POLICY}
      preview={
        <div className="border border-[#222] bg-[#0a0a0a] rounded-2xl divide-y divide-[#222]">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <button
                {...getTriggerProps(i)}
                className="w-full flex justify-between px-8 py-5 text-left data-[state=open]:text-[#d4af37]"
              >
                Section {i + 1}
                <span className="text-[#666]">+</span>
              </button>
              <div {...getContentProps(i)} className="px-8 pb-8 text-[#888]">
                Content for section {i + 1}.
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
}

/* ===================== DATA TABLE ===================== */

interface PersonRow {
  id: number;
  name: string;
  role: string;
}

const TABLE_DATA: ReadonlyArray<PersonRow> = [
  { id: 1, name: 'Alice', role: 'Engineer' },
  { id: 2, name: 'Bob', role: 'Designer' },
  { id: 3, name: 'Carol', role: 'PM' },
  { id: 4, name: 'Dan', role: 'Engineer' },
  { id: 5, name: 'Eve', role: 'Designer' },
  { id: 6, name: 'Frank', role: 'Engineer' },
];

const TABLE_POLICY = `function Demo() {
  const t = useDataTable<PersonRow>({
    data,
    sortableKeys: ['name', 'role'],
    pageSize: 5,
  });

  return (
    <table>
      <thead>
        <tr>
          <th {...t.getHeaderProps('name')}>Name</th>
          <th {...t.getHeaderProps('role')}>Role</th>
        </tr>
      </thead>
      <tbody>
        {t.pagedData.map((row) => (
          <tr key={row.id} {...t.getRowProps(row)}>
            <td>{row.name}</td>
            <td>{row.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`;

function TableDemo({ source }: { source: string }) {
  const t = useDataTable<PersonRow>({
    data: TABLE_DATA,
    sortableKeys: ['name', 'role'],
    pageSize: 4,
  });

  return (
    <DemoFrame
      title="useDataTable"
      subtitle="Sort, paginate, select — all in the engine."
      mechanism={source}
      policy={TABLE_POLICY}
      preview={
        <div>
          <div className="border border-[#222] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#222]">
                  <th {...t.getHeaderProps('name')} className="text-left p-6 cursor-pointer">
                    Name
                  </th>
                  <th {...t.getHeaderProps('role')} className="text-left p-6 cursor-pointer">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {t.pagedData.map((row) => (
                  <tr
                    key={row.id}
                    {...t.getRowProps(row)}
                    className="border-b border-[#222] last:border-none cursor-pointer data-[state=selected]:bg-[#181818]"
                  >
                    <td className="p-6">{row.name}</td>
                    <td className="p-6 text-[#777]">{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-6 text-xs text-[#666]">
            <div>
              {t.selectedIds.size} selected · {t.sort ? `sorted by ${t.sort.key} ${t.sort.direction}` : 'unsorted'}
            </div>
            <div className="flex items-center gap-3">
              <button
                {...t.prevPageProps}
                className="px-3 py-1 border border-[#222] rounded hover:border-[#d4af37] disabled:opacity-40"
              >
                Prev
              </button>
              <span>
                Page {t.pageIndex + 1} / {t.pageCount}
              </span>
              <button
                {...t.nextPageProps}
                className="px-3 py-1 border border-[#222] rounded hover:border-[#d4af37] disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      }
    />
  );
}
