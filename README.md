# Social Forge 🎨

> Comprehensive image generation for **every** social media platform and messaging app

Social Forge is a zero-dependency TypeScript package that generates optimized images for social media previews, favicons, and SEO metadata across **all major platforms** - from Facebook and Instagram to TikTok, WhatsApp, Discord, and emerging platforms like Threads and Bluesky.

## ✨ Features

- 🌍 **Universal Platform Support** - Covers 25+ platforms including all major social networks and messaging apps
- 📱 **Mobile-First** - Full support for iOS, Android, WhatsApp, iMessage, and RCS
- 🚀 **Zero Dependencies** - Uses Sharp for image processing, no external binaries required  
- ⚡ **Framework Agnostic** - Works with any framework, includes Next.js helpers
- 🎯 **Smart Templates** - Automatic text overlay, gradients, and social-optimized layouts
- 🔧 **TypeScript First** - Full type safety and IntelliSense support

## 🌐 Platform Coverage

### Major Social Networks
- ✅ **Facebook** (1200x630) - OpenGraph optimized
- ✅ **Twitter/X** (1200x600) - Twitter Cards support  
- ✅ **LinkedIn** (1200x627) - Professional networking
- ✅ **Instagram** (Multiple formats) - Square, Portrait, Landscape, Stories, Reels
- ✅ **TikTok** (1080x1920) - Vertical video format
- ✅ **YouTube** (1280x720 + Shorts) - Thumbnails and vertical content
- ✅ **Pinterest** (1000x1500 + Square) - Pin and board optimized
- ✅ **Snapchat** (1080x1920) - Stories format

### Messaging Applications  
- ✅ **WhatsApp** (400x400 + Link preview) - Profile and sharing
- ✅ **iMessage** (1200x630) - Apple ecosystem integration
- ✅ **Discord** (1200x630) - Gaming community standard
- ✅ **Telegram** (1200x630) - Secure messaging
- ✅ **Signal** (1200x630) - Privacy-focused
- ✅ **Slack** (1200x630) - Workplace communication  
- ✅ **Android RCS** (1200x630) - Rich Communication Services
- ✅ **WeChat** (500x400) - China's super app
- ✅ **Line** (1200x630) - Popular in Asia

### Emerging Platforms
- ✅ **Threads** (1080x1080) - Meta's Twitter alternative
- ✅ **Bluesky** (1200x630) - Decentralized social network
- ✅ **Mastodon** (1200x630) - Federated social media

### Mobile Integration
- ✅ **Apple/iOS** sharing - Native integration with Share Sheet
- ✅ **Android** sharing - Native Android sharing 
- ✅ **SMS/MMS** support - Basic messaging compatibility
- ✅ **Safari/Chrome** mobile - Browser sharing optimization

## 🚀 Quick Start

```bash
npm install social-forge
```

### Basic Usage

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
  includePlatforms: true    // TikTok, YouTube, Pinterest, etc.
});
```

### Platform-Specific Generation

```typescript
// Individual Platform Generators
import { FacebookGenerator, TwitterGenerator, LinkedInGenerator, TikTokGenerator, WhatsAppGenerator } from 'social-forge';

// Facebook only
const facebook = new FacebookGenerator('./logo.png', config);
await facebook.generate({ includeSquare: true });

// Twitter only
const twitter = new TwitterGenerator('./logo.png', config);
await twitter.generate({ cardType: 'summary_large_image' });

// LinkedIn only
const linkedin = new LinkedInGenerator('./logo.png', config);
await linkedin.generate({ includeCompany: true });

// TikTok only
const tiktok = new TikTokGenerator('./logo.png', config);
await tiktok.generate({ includeProfile: true });

// WhatsApp only
const whatsapp = new WhatsAppGenerator('./logo.png', config);
await whatsapp.generate();

// Category Generators
import { InstagramGenerator, MessagingGenerator } from 'social-forge';

// Instagram (all formats)
const instagram = new InstagramGenerator('./logo.png', config);
await instagram.generate({
  includeStories: true,
  includeReels: true
});

// Messaging apps
const messaging = new MessagingGenerator('./logo.png', config);
await messaging.generate({
  includeWhatsApp: true,
  includeDiscord: true,
  includeiMessage: true
});

// Favicon & PWA
import { FaviconGenerator, PWAGenerator } from 'social-forge';

const favicon = new FaviconGenerator('./logo.png', config);
await favicon.generate();

const pwa = new PWAGenerator('./logo.png', config);
await pwa.generate({ includeSplashScreens: true });
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