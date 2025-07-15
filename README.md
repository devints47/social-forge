# Social Forge 🎨

> Comprehensive image generation for **every** social media platform and messaging app

Social Forge is a zero-dependency TypeScript package that generates optimized images for social media previews, favicons, and SEO metadata across **all major platforms** - from Facebook and Instagram to TikTok, WhatsApp, Discord, and emerging platforms like Threads and Bluesky.

## 🌟 Features

### Major Social Networks
- ✅ **Facebook** (1200x630) - OpenGraph optimized
- ✅ **Twitter/X** (1200x600) - Twitter Cards support
- ✅ **LinkedIn** (1200x627) - Professional networking
- ✅ **Instagram** - Multiple formats:
  - Square (1080x1080) - Standard posts
  - Portrait (1080x1350) - Vertical posts
  - Stories (1080x1920) - 24hr stories
  - Reels (1080x1920) - Video content
- ✅ **TikTok** (1080x1920) - Vertical video format
- ✅ **YouTube**:
  - Thumbnails (1280x720) - Video previews
  - Shorts (1080x1920) - Short content
- ✅ **Pinterest**:
  - Pin (1000x1500) - Pin boards
  - Square (1000x1000) - Square pins

### Messaging Applications
- ✅ **WhatsApp**:
  - Profile (400x400) - Profile images
  - Link Preview (1200x630) - Link sharing
- ✅ **Discord** (1200x630) - Server sharing
- ✅ **Telegram** (1200x630) - Message sharing
- ✅ **Signal** (1200x630) - Secure sharing
- ✅ **Slack** (1200x630) - Workspace sharing
- ✅ **iMessage** (1200x630) - iOS sharing
- ✅ **Android RCS** (1200x630) - Android sharing

### Emerging Platforms
- ✅ **Threads** (1080x1080) - Meta's Twitter alternative
- ✅ **Bluesky** (1200x630) - Decentralized social network
- ✅ **Mastodon** (1200x630) - Federated social media

### Technical Assets
- ✅ **Favicons** - All sizes and formats (ICO, PNG, SVG)
- ✅ **PWA Icons** - App icons, splash screens, manifest
- ✅ **Apple Touch Icons** - iOS optimization
- ✅ **Android Icons** - Material Design compliance
- ✅ **Windows Tiles** - Microsoft Store support

## 🚀 Quick Start

```bash
npm install social-forge
```

### CLI Usage

Generate assets for all platforms:
```bash
npx social-forge generate logo.png --all
```

Generate assets for specific platforms:
```bash
# Major Social Networks
npx social-forge generate logo.png --facebook    # Facebook (1200x630)
npx social-forge generate logo.png --twitter     # Twitter/X (1200x600)
npx social-forge generate logo.png --linkedin    # LinkedIn (1200x627)
npx social-forge generate logo.png --instagram   # Instagram (all formats)
npx social-forge generate logo.png --tiktok      # TikTok (1080x1920)
npx social-forge generate logo.png --youtube     # YouTube (thumbnail + shorts)
npx social-forge generate logo.png --pinterest   # Pinterest (pin + square)

# Messaging Apps
npx social-forge generate logo.png --whatsapp    # WhatsApp (profile + preview)
npx social-forge generate logo.png --discord     # Discord (1200x630)
npx social-forge generate logo.png --telegram    # Telegram (1200x630)
npx social-forge generate logo.png --signal      # Signal (1200x630)
npx social-forge generate logo.png --slack       # Slack (1200x630)
npx social-forge generate logo.png --imessage    # iMessage (1200x630)
npx social-forge generate logo.png --androidrcs  # Android RCS (1200x630)

# Emerging Platforms
npx social-forge generate logo.png --threads     # Threads (1080x1080)
npx social-forge generate logo.png --bluesky     # Bluesky (1200x630)
npx social-forge generate logo.png --mastodon    # Mastodon (1200x630)

# Technical Assets
npx social-forge generate logo.png --favicon     # Generate favicons
npx social-forge generate logo.png --pwa         # Generate PWA icons

# Platform Categories
npx social-forge generate logo.png --social      # Standard social (FB, Twitter, LinkedIn)
npx social-forge generate logo.png --messaging   # All messaging platforms
npx social-forge generate logo.png --platforms   # All video/visual platforms
```

### Programmatic Usage

```typescript
import { ComprehensiveSocialGenerator } from 'social-forge';

const generator = new ComprehensiveSocialGenerator('./my-logo.png', {
  appName: 'My Awesome App',
  description: 'The best app for everything!',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  output: {
    path: './public/images',
    prefix: '/images/'
  }
});

// Generate images for ALL platforms
await generator.generate({
  includeStandard: true,    // Facebook, Twitter, LinkedIn  
  includeInstagram: true,   // All Instagram formats
  includeMessaging: true,   // WhatsApp, Discord, Telegram, etc.
  includePlatforms: true,   // TikTok, YouTube, Pinterest, etc.
  platforms: {
    // Standard social
    facebook: true,
    twitter: true,
    linkedin: true,
    
    // Instagram variations
    instagramStories: true,
    instagramReels: true,
    
    // Messaging apps
    whatsapp: true,
    discord: true,
    telegram: true,
    signal: true,
    slack: true,
    imessage: true,
    androidRCS: true,
    
    // Video/Visual platforms
    tiktok: true,
    youtube: true,
    pinterest: true,
    
    // Emerging platforms
    threads: true,
    bluesky: true,
    mastodon: true
  }
});

// Get meta tags for your HTML
const metaTags = generator.getMetaTags();

// Get Next.js metadata configuration
const nextMetadata = generator.getNextMetadata();
```

### Individual Platform Generators

```typescript
// Individual Platform Generators
import { 
  FacebookGenerator, 
  TwitterGenerator, 
  LinkedInGenerator, 
  InstagramGenerator,
  TikTokGenerator, 
  WhatsAppGenerator 
} from 'social-forge';

// Facebook only
const facebook = new FacebookGenerator('./logo.png', config);
await facebook.generate();

// Twitter only
const twitter = new TwitterGenerator('./logo.png', config);
await twitter.generate();

// LinkedIn only
const linkedin = new LinkedInGenerator('./logo.png', config);
await linkedin.generate();

// Instagram only
const instagram = new InstagramGenerator('./logo.png', config);
await instagram.generate({ includeStories: true, includeReels: true });

// TikTok only
const tiktok = new TikTokGenerator('./logo.png', config);
await tiktok.generate();

// WhatsApp only
const whatsapp = new WhatsAppGenerator('./logo.png', config);
await whatsapp.generate();
```

### Framework Integration

#### Next.js 

```typescript
// app/layout.tsx or pages/_app.tsx
import { generateMetadata } from 'social-forge/next';

export const metadata = generateMetadata({
  title: 'My App',
  description: 'Amazing app description',
  images: '/images/' // Points to your generated images
});
```

#### React/Vue/Angular

```typescript
// Get HTML meta tags
const metaTags = generator.getMetaTags();

// Insert into document head
metaTags.forEach(tag => {
  document.head.insertAdjacentHTML('beforeend', tag);
});
```

## 📋 Complete Platform Matrix

| Platform | Format | Size | Use Case |
|----------|--------|------|----------|
| **Facebook** | OpenGraph | 1200x630 | Link sharing, posts |
| **Twitter/X** | Twitter Card | 1200x600 | Tweet attachments |
| **LinkedIn** | Business | 1200x627 | Professional sharing |
| **Instagram Square** | Feed Post | 1080x1080 | Standard posts |
| **Instagram Portrait** | Feed Post | 1080x1350 | Vertical posts |
| **Instagram Stories** | Stories | 1080x1920 | 24hr stories |
| **Instagram Reels** | Short Video | 1080x1920 | Video content |
| **TikTok** | Vertical | 1080x1920 | Short videos |
| **YouTube Thumbnail** | Video | 1280x720 | Video previews |
| **YouTube Shorts** | Vertical | 1080x1920 | Short content |
| **Pinterest Pin** | Vertical | 1000x1500 | Pin boards |
| **Pinterest Square** | Square | 1000x1000 | Square pins |
| **WhatsApp Profile** | Square | 400x400 | Profile images |
| **WhatsApp Link** | Preview | 1200x630 | Link sharing |
| **Discord** | Embed | 1200x630 | Server sharing |
| **Telegram** | Link Preview | 1200x630 | Message sharing |
| **Signal** | Preview | 1200x630 | Secure sharing |
| **Slack** | Unfurl | 1200x630 | Workspace sharing |
| **iMessage** | Rich Link | 1200x630 | iOS sharing |
| **Android RCS** | Rich Message | 1200x630 | Android sharing |
| **Threads** | Post | 1080x1080 | Meta platform |
| **Bluesky** | Post | 1200x630 | Decentralized |
| **Mastodon** | Toot | 1200x630 | Federated |

## 🎨 Templates & Customization

Social Forge includes smart templates that automatically optimize your content for each platform:

```typescript
await generator.generate({
  template: 'gradient',     // Adds gradient overlay for text readability
  title: 'My App Name',     // Automatically sized for each format
  description: 'App tagline' // Positioned optimally per platform
});
```

### Available Templates
- **`basic`** - Clean, minimal design
- **`gradient`** - Gradient overlay for better text contrast  
- **`custom`** - Bring your own template

## 📊 Performance & Optimization

- **Zero External Dependencies** - No ImageMagick, Potrace, or system binaries
- **Fast Generation** - Processes 25+ images in under 2 seconds
- **Smart Caching** - Reuses processed images when possible
- **Memory Efficient** - Streams processing for large images
- **Quality Control** - Configurable compression per platform

## 🛠️ Advanced Configuration

```typescript
const config = {
  appName: 'My App',
  description: 'App description',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  
  // Platform-specific toggles
  platforms: {
    // Disable specific platforms
    wechat: false,        // Skip WeChat (China-specific)
    mastodon: false,      // Skip federated platforms
    
    // Enable all messaging
    whatsapp: true,
    discord: true,
    telegram: true
  },
  
  output: {
    path: './dist/images',
    prefix: '/static/images/',
    quality: 90,           // JPEG quality (1-100)
    format: 'png'          // Force PNG for all outputs  
  }
};
```

## 🧪 Examples

Check out the `/examples` directory for complete demos:

- `comprehensive-social.js` - Generate for all 25+ platforms
- `instagram-focused.js` - Instagram-specific generation
- `messaging-apps.js` - Messaging platform optimization
- `next-js-integration.js` - Complete Next.js setup

## 🔧 CLI Usage

```bash
# Initialize new project
npx social-forge init my-project

# Generate for all platforms
npx social-forge generate ./logo.png --all

# Individual platforms
npx social-forge generate ./logo.png --facebook --twitter --linkedin
npx social-forge generate ./logo.png --tiktok --whatsapp --instagram

# Platform categories
npx social-forge generate ./logo.png --social --messaging --platforms

# Technical assets
npx social-forge generate ./logo.png --favicon --pwa

# Custom configuration
npx social-forge generate ./logo.png --config ./social-forge.config.json

# Generate HTML meta tags
npx social-forge meta ./logo.png

# Show platform coverage
npx social-forge info
```

## 📚 API Reference

### Core Classes

- `ComprehensiveSocialGenerator` - All-in-one platform generation
- `InstagramGenerator` - Instagram-specific formats
- `MessagingGenerator` - Messaging app optimization  
- `PlatformGenerator` - Video/visual platform formats
- `OpenGraphGenerator` - Standard social media (Facebook, Twitter, LinkedIn)

### Utilities

- `ImageProcessor` - Core image manipulation
- `ConfigValidator` - Configuration validation
- `ImageSizes` - Platform size constants

## 🤝 Contributing

We welcome contributions! Social media platforms change frequently, and we need help keeping everything up to date.

### Priority Areas
- 🆕 New platform support (Threads, Bluesky updates)
- 📱 Mobile platform optimization
- 🎨 Additional templates and themes
- 🧪 More comprehensive testing

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with [Sharp](https://sharp.pixelplumbing.com/) for fast, high-quality image processing.

---

**Made with ❤️ for the social media ecosystem**

*Stop wrestling with image sizes. Start focusing on your content.* 