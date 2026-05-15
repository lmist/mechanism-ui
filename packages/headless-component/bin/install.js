#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const skillName = 'headless-component';
const skillDir = path.join(process.cwd(), '.claude', 'skills', skillName);
const skillFile = path.join(skillDir, 'SKILL.md');

const sourceSkill = path.join(__dirname, '..', 'SKILL.md');

try {
  fs.mkdirSync(skillDir, { recursive: true });
  fs.copyFileSync(sourceSkill, skillFile);

  console.log('\n✅ Installed headless-component skill');
  console.log(`   Location: ${skillFile}`);
  console.log('\n   Restart Claude / Grok for the skill to load.\n');
} catch (err) {
  console.error('Failed to install skill:', err.message);
  process.exit(1);
}
