# mdguide Template Guide

This document explains how mdguide works as a GitHub template and what has been implemented for Phase 1 of the template distribution strategy.

## What We've Built

mdguide is now set up as an **Enhanced GitHub Template** with the following features:

### 1. Interactive Setup Script

**Location:** `scripts/setup.js`

An interactive CLI wizard that automatically configures a new mdguide installation. It:

- Prompts for site configuration (name, description, branding)
- Updates all necessary files automatically
- Optionally deletes example guides
- Optionally creates a starter guide
- Optionally reinitializes git with clean history

**Usage:**
```bash
npm run setup
```

**What it updates:**
- `app/config/site.ts` - Site name and branding
- `package.json` - Package name and metadata
- `app/hooks/useGuideProgress.ts` - localStorage key (prevents conflicts)
- Deletes example guides (optional)
- Creates starter guide (optional)
- Reinitializes git repository (optional)

### 2. Comprehensive Documentation

**SETUP.md** - Complete setup and configuration guide covering:
- Quick start with setup wizard
- Manual setup instructions
- Configuration reference
- Guide creation tutorial
- Troubleshooting section
- Project structure overview

**README.md** - Updated with:
- "Use this template" workflow
- Quick start instructions
- Feature highlights with emojis
- Clear links to documentation
- Modern, professional formatting

### 3. Example Content Marking

Both example guides now have `isExample: true` in their frontmatter:
- `app/guides/setup-site-name/page.mdx`
- `app/guides/creating-guides/page.mdx`

This makes it clear which content is example material that can be deleted.

### 4. GitHub Issue Templates

**Location:** `.github/ISSUE_TEMPLATE/`

Three issue templates for better user support:
- **bug_report.md** - For reporting bugs
- **feature_request.md** - For suggesting features
- **setup_help.md** - For getting setup assistance

Plus a **config.yml** that links to documentation and discussions.

## How Users Will Use This Template

### Option 1: GitHub Template (Recommended)

1. Click "Use this template" on GitHub
2. Clone their new repository
3. Run `npm install`
4. Run `npm run setup` (interactive wizard)
5. Run `npm run dev`
6. Start creating guides!

### Option 2: Direct Clone

1. Clone the repository: `git clone https://github.com/john-rock/mdguide.git`
2. Run `npm install`
3. Run `npm run setup`
4. Run `npm run dev`

### Option 3: degit (Clean Clone)

1. Run `npx degit john-rock/mdguide my-docs`
2. `cd my-docs`
3. Run `npm install`
4. Run `npm run setup`
5. Run `npm run dev`

### Option 4: Manual Setup

Users who prefer full control can follow the manual setup instructions in SETUP.md without using the setup wizard.

## Setup Wizard Flow

The wizard prompts for:

1. **Site name** - e.g., "My Documentation"
2. **Site description** - For SEO and metadata
3. **Guide index title** - Homepage heading (default: "Guides")
4. **Guide index description** - Homepage subheader
5. **Package name** - npm package name (validates format)
6. **Delete example guides?** - Yes/No (default: Yes)
7. **Create starter guide?** - Yes/No (default: Yes, only if deleting examples)
8. **Reinitialize git?** - Yes/No (default: Yes)

Then it shows a summary and asks for confirmation before applying changes.

## Files Modified by Setup

### Automatically Updated

1. **app/config/site.ts**
   ```typescript
   export const siteConfig: SiteConfig = {
     name: 'User Input',
     description: 'User Input',
     guideIndex: {
       title: 'User Input',
       description: 'User Input',
     },
   };
   ```

2. **package.json**
   ```json
   {
     "name": "user-input",
     "version": "0.1.0",
     "private": true
   }
   ```

3. **app/hooks/useGuideProgress.ts**
   ```typescript
   const STORAGE_KEY = "user-package-name-guide-progress";
   ```

### Optionally Modified

- Example guides deleted (if user chooses)
- Starter guide created (if user chooses)
- Git history reinitialized (if user chooses)

## Benefits of This Approach

### For Users

1. **Fast setup** - 5 minutes from clone to customized site
2. **Guided experience** - No need to hunt for files to edit
3. **Validation** - Package names and inputs are validated
4. **Flexibility** - Can skip wizard and do manual setup
5. **Clean start** - Option to start with clean git history

### For Maintainers

1. **Low maintenance** - No external infrastructure required
2. **Simple updates** - Changes are just git commits
3. **Transparent** - Users can see all code
4. **Flexible** - Easy to add more features to wizard
5. **Testable** - Script can be tested locally

### For the Project

1. **Professional** - Polished onboarding experience
2. **Documented** - Comprehensive guides for all scenarios
3. **Scalable** - Can grow to CLI if needed (Phase 2)
4. **Community-friendly** - Clear contribution process

## What Happens on First Use

When someone uses mdguide as a template:

1. They get a copy of the entire repository
2. They run `npm install` to get dependencies
3. They run `npm run setup` for guided configuration
4. Script updates all configuration files automatically
5. They can immediately run `npm run dev` and see their customized site
6. They start creating their own guides in `app/guides/`

## Troubleshooting Setup

Common issues and solutions are documented in SETUP.md, including:

- Guide not appearing
- Steps not showing in sidebar
- Search not working
- Build errors
- Port conflicts
- Changes not reflecting

## Next Steps (Phase 2)

If mdguide gains traction (20-50+ users), consider building:

**CLI Generator (`npx create-mdguide`)**

This would:
- Provide an even more polished experience
- Allow users to initialize without cloning
- Add more validation and error handling
- Support templates and themes
- Enable future feature additions

Estimated effort: 28-37 hours

**When to build it:**
- After validating demand with current approach
- When getting consistent setup friction feedback
- When ready to invest in npm package infrastructure

## How to Mark Repo as Template

To enable the "Use this template" button on GitHub:

1. Go to repository settings
2. Scroll to "Template repository" section
3. Check "Template repository"
4. Save changes

Users will now see a green "Use this template" button on the repo homepage.

## Testing the Setup

To test the setup wizard locally:

```bash
# Create a test directory
mkdir ../mdguide-test
cp -r . ../mdguide-test
cd ../mdguide-test

# Run setup
npm install
npm run setup

# Follow prompts and verify changes
git diff  # See what changed
npm run dev  # Test the site
```

## Customization Points

Users can customize:

**Via Setup Wizard:**
- Site name and branding
- Homepage content
- Package name
- Starting content (keep/delete examples)

**Via Manual Editing:**
- Colors and styling (Tailwind classes)
- Component layouts
- Search behavior
- Guide parsing logic
- Additional metadata fields

## Distribution Checklist

Before marking as template:

- [x] Setup script working
- [x] Documentation complete (SETUP.md, README.md)
- [x] Example guides marked with isExample
- [x] Issue templates created
- [x] Setup command in package.json
- [ ] Mark repo as template on GitHub
- [ ] Test full workflow from "Use this template"
- [ ] Add screenshots to README (optional)
- [ ] Create demo video (optional)

## Success Metrics

Track these to decide if Phase 2 (CLI) is needed:

1. **Setup success rate** - How many users successfully set up?
2. **Support requests** - Common issues in GitHub issues?
3. **Feature requests** - What do users want?
4. **User count** - How many people use the template?
5. **Setup time** - How long does setup take users?

If setup friction is high or user base grows significantly, Phase 2 becomes valuable.

## Maintaining the Template

To update the template:

1. Make changes in the main branch
2. Update version number if significant
3. Document breaking changes in release notes
4. Users can pull updates or manually merge changes

No complex version management needed - users control when/how they update.

---

**mdguide is now ready to be used as a professional GitHub template!**

Users get a guided, 5-minute setup experience while you maintain a simple, transparent codebase.
