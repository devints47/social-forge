# Social Forge

A comprehensive generator for social media previews, favicons, and visual assets across all platforms. Generate everything you need for your web application's visual identity and social media presence with a single command.

## Features

- 🌐 **Social Media Previews** - Create stunning OpenGraph and Twitter card images
- 🖼️ **Favicons** - Generate favicons for all platforms and browsers
- 📱 **App Icons** - iOS, Android, and PWA icons
- 🎨 **Platform Specific** - Windows tiles, Safari pinned tabs, and more
- 🔧 **Framework Integration** - Built-in support for Next.js, React, Vue, and more
- 📦 **Zero Dependencies** - No ImageMagick or other system dependencies required
- ⚡ **Fast Processing** - Powered by Sharp for optimal performance

## Installation

```bash
npm install social-forge
# or
yarn add social-forge
# or
pnpm add social-forge
```

## Quick Start

### CLI Usage

```bash
npx social-forge generate --source logo.png --output public/
```

### Programmatic Usage

```typescript
import { generateAssets } from 'social-forge';

await generateAssets({
  source: 'path/to/logo.png',
  output: 'public/',
  config: {
    appName: 'My App',
    themeColor: '#8b5cf6',
    backgroundColor: '#111827'
  }
});
```

## Configuration

Create a `social-forge.config.js` file in your project root:

```javascript
module.exports = {
  appName: 'My Application',
  themeColor: '#8b5cf6',
  backgroundColor: '#111827',
  platforms: ['social', 'favicon', 'apple', 'android', 'windows', 'safari'],
  frameworks: ['nextjs'],
  output: {
    path: 'public/',
    prefix: '/'
  }
};
```

## Framework Integration

### Next.js

Social Forge automatically generates the necessary metadata configuration for your Next.js application:

```typescript
// app/layout.tsx
import { Metadata } from 'next';
import { getMetadata } from 'social-forge/next';

export const metadata: Metadata = getMetadata();
```

## Documentation

For detailed documentation, visit [social-forge.dev](https://social-forge.dev)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Your Name] 