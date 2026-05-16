#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = new Set(process.argv.slice(2));
const force = args.has('--force') || args.has('-f');
const printHelp = args.has('--help') || args.has('-h');

if (printHelp) {
  console.log(`headless-component — install the strict headless-component skill.

Usage:
  npx headless-component           Install into ./.claude/skills/headless-component/SKILL.md
  npx headless-component --force   Overwrite an existing skill file
  npx headless-component --help    Show this message
`);
  process.exit(0);
}

const skillName = 'headless-component';
const skillDir = path.join(process.cwd(), '.claude', 'skills', skillName);
const skillFile = path.join(skillDir, 'SKILL.md');
const sourceSkill = path.join(__dirname, '..', 'SKILL.md');

if (!fs.existsSync(sourceSkill)) {
  console.error(`Internal error: SKILL.md missing from package at ${sourceSkill}`);
  process.exit(1);
}

if (fs.existsSync(skillFile) && !force) {
  console.error(`A skill already exists at:
  ${skillFile}

Re-run with --force to overwrite.`);
  process.exit(1);
}

try {
  fs.mkdirSync(skillDir, { recursive: true });
  fs.copyFileSync(sourceSkill, skillFile);

  console.log(`Installed headless-component skill.
  Location: ${skillFile}

Restart Claude Code (or reload your editor's Claude integration) so the project skill is picked up.`);
} catch (err) {
  console.error('Failed to install skill:', err.message);
  process.exit(1);
}
