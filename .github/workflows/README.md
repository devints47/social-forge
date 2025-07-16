# GitHub Actions Workflows

This directory contains automated workflows for the Pixel Forge project.

## Workflows

### 1. CI/CD Pipeline (`ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`
- Published releases

**Jobs:**
- **Test**: Runs tests, linting, and builds across Node.js versions 18, 20, and 22
- **Publish npm**: Automatically publishes to npm when a GitHub release is published
- **Publish GitHub**: Automatically publishes to GitHub Packages when a GitHub release is published
- **Security**: Runs security audits on main branch pushes

### 2. Manual Publish (`publish.yml`)

**Trigger:** Manual workflow dispatch

**Features:**
- Choose version bump type: patch, minor, major, or prerelease
- Automatically bumps version in package.json
- Creates git tag and GitHub release
- Publishes to both npm and GitHub Packages
- Supports prerelease versions with custom tags

### 3. Dual Publish (`dual-publish.yml`) - **NEW**

**Trigger:** Manual workflow dispatch

**Features:**
- Choose version bump type and prerelease tags
- **Selective publishing**: Choose which registries to publish to
- Publishes to npm as `pixel-forge`
- Publishes to GitHub Packages as `@devints47/pixel-forge`
- **Keeps your CLI aliases**: Both `pixel-forge` and `pforge` work from either registry
- Comprehensive release notes with installation instructions for both registries

## Setup Instructions

### 1. Create npm Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Go to **Access Tokens** in your account settings
3. Create a new **Automation** token
4. Copy the token

### 2. Add GitHub Secrets

Go to your repository's **Settings > Secrets and variables > Actions** and add:

- `NPM_TOKEN`: Your npm access token from step 1

### 3. Repository Permissions

Ensure the repository has the following permissions:
- **Settings > Actions > General > Workflow permissions**: Choose "Read and write permissions"

## Usage

### Automatic Publishing (Recommended)

1. Make your changes and push to main
2. Go to **Releases** in your GitHub repository
3. Click **Create a new release**
4. Create a new tag (e.g., `v1.0.1`)
5. Fill in release details
6. Click **Publish release**
7. The workflow will automatically publish to **both npm and GitHub Packages**

### Manual Publishing Options

#### Option 1: Dual Publish (NEW - Recommended)
1. Go to **Actions** tab in your repository
2. Select **"Dual Publish (npm + GitHub Packages)"** workflow
3. Click **Run workflow**
4. Configure options:
   - **Version bump type**: patch/minor/major/prerelease
   - **Publish to npm**: ✅ (recommended: keep enabled)
   - **Publish to GitHub Packages**: ✅ (recommended: keep enabled)
5. Click **Run workflow**

#### Option 2: Legacy Publish 
1. Go to **Actions** tab in your repository
2. Select **"Publish Package"** workflow
3. Click **Run workflow**
4. Choose version bump type:
   - `patch`: 1.0.0 → 1.0.1 (bug fixes)
   - `minor`: 1.0.0 → 1.1.0 (new features)
   - `major`: 1.0.0 → 2.0.0 (breaking changes)
   - `prerelease`: 1.0.0 → 1.0.1-beta.0 (beta versions)
5. Click **Run workflow**

### User Installation Options

After publishing, users can install from either registry:

#### From npm (Most Common)
```bash
# Install globally
npm install -g pixel-forge

# Or run directly with npx
npx pixel-forge generate logo.png --web
```

#### From GitHub Packages
```bash
# Configure registry (one-time setup)
npm config set @devints47:registry https://npm.pkg.github.com

# Install globally
npm install -g @devints47/pixel-forge

# Or run directly with npx
npx @devints47/pixel-forge generate logo.png --web
```

**Important**: Both installations provide the same CLI commands:
- `pixel-forge` - Main command
- `pforge` - Short alias

### CI/CD Automation

- Every push to main/develop runs tests and security checks
- Pull requests are automatically tested
- Failed tests prevent merging

## Workflow Features

✅ **Multi-Node.js Testing**: Tests across Node.js 18, 20, and 22
✅ **Security Auditing**: Automated dependency security scanning
✅ **Automated Version Management**: Handles version bumping and tagging
✅ **GitHub Releases**: Automatically creates releases with changelogs
✅ **npm Publishing**: Secure automated publishing to npm registry
✅ **CLI Testing**: Validates CLI installation and commands
✅ **Prerelease Support**: Beta/alpha release management

## Troubleshooting

### Publication Fails

1. Check that `NPM_TOKEN` secret is set correctly
2. Verify you have publish permissions for the package
3. Ensure the version hasn't already been published

### Workflow Permissions Error

1. Go to **Settings > Actions > General**
2. Under **Workflow permissions**, select "Read and write permissions"
3. Check "Allow GitHub Actions to create and approve pull requests"

### Version Conflicts

If you get version conflicts, ensure:
1. The version in package.json matches what you expect
2. No duplicate tags exist in the repository
3. The npm registry doesn't already have the version 