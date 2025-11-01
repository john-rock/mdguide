#!/usr/bin/env node

/**
 * mdguide Setup Script
 *
 * This interactive script helps you customize your mdguide installation.
 * It will prompt you for configuration values and update the necessary files.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify question
function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

// Print colored message
function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Print header
function printHeader() {
  console.log();
  print('╔════════════════════════════════════════════════════════════╗', 'cyan');
  print('║                                                            ║', 'cyan');
  print('║                   mdguide Setup Wizard                     ║', 'cyan');
  print('║                                                            ║', 'cyan');
  print('╚════════════════════════════════════════════════════════════╝', 'cyan');
  console.log();
  print('This wizard will help you customize your mdguide installation.', 'blue');
  console.log();
}

// Validate input
function validateNotEmpty(value, fieldName) {
  if (!value || value.trim() === '') {
    print(`✗ ${fieldName} cannot be empty`, 'red');
    return false;
  }
  return true;
}

function validatePackageName(name) {
  // Basic npm package name validation
  if (!/^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) {
    print('✗ Invalid package name. Use lowercase letters, numbers, and hyphens.', 'red');
    return false;
  }
  return true;
}

// Update site config
function updateSiteConfig(config) {
  const configPath = path.join(process.cwd(), 'app/config/site.ts');

  let content = `import { SiteConfig } from '@/app/types/site';

export const siteConfig: SiteConfig = {
  name: '${config.siteName}',
  description: '${config.description}',
  guideIndex: {
    title: '${config.guideIndexTitle}',
    description: '${config.guideIndexDescription}',
  },
};
`;

  fs.writeFileSync(configPath, content, 'utf8');
  print('✓ Updated app/config/site.ts', 'green');
}

// Update package.json
function updatePackageJson(config) {
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  packageJson.name = config.packageName;
  packageJson.version = '0.1.0';
  packageJson.private = true;

  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
  print('✓ Updated package.json', 'green');
}

// Update localStorage key in useGuideProgress
function updateLocalStorageKey(config) {
  const hookPath = path.join(process.cwd(), 'app/hooks/useGuideProgress.ts');
  let content = fs.readFileSync(hookPath, 'utf8');

  // Create a safe storage key from package name
  const storageKey = config.packageName.replace(/[^a-z0-9-]/gi, '-');

  content = content.replace(
    /const STORAGE_KEY = ["'].*?["'];/,
    `const STORAGE_KEY = "${storageKey}-guide-progress";`
  );

  fs.writeFileSync(hookPath, content, 'utf8');
  print(`✓ Updated localStorage key to "${storageKey}-guide-progress"`, 'green');
}

// Delete example guides
function deleteExampleGuides() {
  const guidesDir = path.join(process.cwd(), 'app/guides');
  const exampleGuides = ['setup-site-name', 'creating-guides'];

  let deletedCount = 0;
  for (const guide of exampleGuides) {
    const guidePath = path.join(guidesDir, guide);
    if (fs.existsSync(guidePath)) {
      fs.rmSync(guidePath, { recursive: true, force: true });
      deletedCount++;
      print(`✓ Deleted example guide: ${guide}`, 'green');
    }
  }

  if (deletedCount === 0) {
    print('  No example guides found to delete', 'yellow');
  }
}

// Create starter guide
function createStarterGuide(config) {
  const starterDir = path.join(process.cwd(), 'app/guides/getting-started');
  const starterFile = path.join(starterDir, 'page.mdx');

  // Create directory if it doesn't exist
  if (!fs.existsSync(starterDir)) {
    fs.mkdirSync(starterDir, { recursive: true });
  }

  const starterContent = `---
title: Getting Started
description: Welcome to ${config.siteName}
published: true
---

# Getting Started

Welcome to your new ${config.siteName} documentation site!

## What is ${config.siteName}?

${config.description}

## Creating Your First Guide

To create a new guide:

1. Create a new directory in \`app/guides/your-guide-name/\`
2. Add a \`page.mdx\` file with frontmatter
3. Write your content using Markdown
4. Use \`##\` headings to create navigable steps

## Next Steps

Start building your documentation by creating new guides in the \`app/guides/\` directory.

Happy writing!
`;

  fs.writeFileSync(starterFile, starterContent, 'utf8');
  print('✓ Created starter guide: getting-started', 'green');
}

// Reinitialize git repository
function reinitializeGit() {
  try {
    // Remove existing .git directory
    const gitDir = path.join(process.cwd(), '.git');
    if (fs.existsSync(gitDir)) {
      fs.rmSync(gitDir, { recursive: true, force: true });
      print('✓ Removed existing git history', 'green');
    }

    // Initialize new repository
    execSync('git init', { stdio: 'ignore' });
    print('✓ Initialized new git repository', 'green');

    // Create initial commit
    execSync('git add .', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from mdguide template"', { stdio: 'ignore' });
    print('✓ Created initial commit', 'green');
  } catch (error) {
    print('✗ Failed to reinitialize git repository', 'red');
    print(`  Error: ${error.message}`, 'red');
  }
}

// Main setup function
async function setup() {
  printHeader();

  const config = {};

  // Gather configuration
  print('Site Configuration', 'bright');
  print('─────────────────────────────────────────────────────────────', 'cyan');
  console.log();

  // Site name
  while (true) {
    config.siteName = await question('Site name (e.g., "My Documentation"): ');
    if (validateNotEmpty(config.siteName, 'Site name')) break;
  }

  // Description
  while (true) {
    config.description = await question('Site description: ');
    if (validateNotEmpty(config.description, 'Description')) break;
  }

  // Guide index title
  const defaultGuideTitle = 'Guides';
  const guideTitle = await question(`Guide index title [${defaultGuideTitle}]: `);
  config.guideIndexTitle = guideTitle.trim() || defaultGuideTitle;

  // Guide index description
  const defaultGuideDesc = 'Step-by-step guides to help you get started.';
  const guideDesc = await question(`Guide index description [${defaultGuideDesc}]: `);
  config.guideIndexDescription = guideDesc.trim() || defaultGuideDesc;

  console.log();
  print('Project Configuration', 'bright');
  print('─────────────────────────────────────────────────────────────', 'cyan');
  console.log();

  // Package name
  while (true) {
    config.packageName = await question('Package name (e.g., "my-docs"): ');
    if (validateNotEmpty(config.packageName, 'Package name') &&
        validatePackageName(config.packageName)) break;
  }

  console.log();
  print('Options', 'bright');
  print('─────────────────────────────────────────────────────────────', 'cyan');
  console.log();

  // Delete example guides
  const deleteExamples = await question('Delete example guides? (y/n) [y]: ');
  config.deleteExamples = deleteExamples.toLowerCase() !== 'n';

  // Create starter guide
  if (config.deleteExamples) {
    const createStarter = await question('Create a starter guide? (y/n) [y]: ');
    config.createStarter = createStarter.toLowerCase() !== 'n';
  }

  // Reinitialize git
  const reinitGit = await question('Reinitialize git repository? (y/n) [y]: ');
  config.reinitGit = reinitGit.toLowerCase() !== 'n';

  console.log();
  print('Setup Summary', 'bright');
  print('─────────────────────────────────────────────────────────────', 'cyan');
  console.log();
  print(`Site name:         ${config.siteName}`, 'blue');
  print(`Description:       ${config.description}`, 'blue');
  print(`Package name:      ${config.packageName}`, 'blue');
  print(`Delete examples:   ${config.deleteExamples ? 'Yes' : 'No'}`, 'blue');
  if (config.deleteExamples) {
    print(`Create starter:    ${config.createStarter ? 'Yes' : 'No'}`, 'blue');
  }
  print(`Reinit git:        ${config.reinitGit ? 'Yes' : 'No'}`, 'blue');
  console.log();

  const confirm = await question('Proceed with setup? (y/n) [y]: ');
  if (confirm.toLowerCase() === 'n') {
    print('\nSetup cancelled.', 'yellow');
    rl.close();
    return;
  }

  console.log();
  print('Applying configuration...', 'bright');
  print('─────────────────────────────────────────────────────────────', 'cyan');
  console.log();

  // Apply changes
  try {
    updateSiteConfig(config);
    updatePackageJson(config);
    updateLocalStorageKey(config);

    if (config.deleteExamples) {
      deleteExampleGuides();
      if (config.createStarter) {
        createStarterGuide(config);
      }
    }

    if (config.reinitGit) {
      reinitializeGit();
    }

    console.log();
    print('╔════════════════════════════════════════════════════════════╗', 'green');
    print('║                                                            ║', 'green');
    print('║                Setup completed successfully!               ║', 'green');
    print('║                                                            ║', 'green');
    print('╚════════════════════════════════════════════════════════════╝', 'green');
    console.log();
    print('Next steps:', 'bright');
    print('  1. npm run dev          # Start development server', 'blue');
    print('  2. Create your guides in app/guides/', 'blue');
    print('  3. Customize styles and components as needed', 'blue');
    console.log();
    print('For detailed documentation, see SETUP.md', 'cyan');
    console.log();

  } catch (error) {
    console.log();
    print('✗ Setup failed', 'red');
    print(`Error: ${error.message}`, 'red');
    console.log();
  }

  rl.close();
}

// Run setup
setup().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
