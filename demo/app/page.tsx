import fs from 'node:fs';
import path from 'node:path';

import { DemoApp } from './demo-app';

const HOOKS_DIR = path.join(process.cwd(), 'hooks');
const read = (file: string) => fs.readFileSync(path.join(HOOKS_DIR, file), 'utf8');

export default function Page() {
  return (
    <DemoApp
      sources={{
        disclosure: read('useDisclosure.ts'),
        tabs: read('useTabs.ts'),
        combobox: read('useCombobox.ts'),
        accordion: read('useAccordion.ts'),
        dataTable: read('useDataTable.ts'),
      }}
    />
  );
}
