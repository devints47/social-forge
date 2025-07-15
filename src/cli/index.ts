#!/usr/bin/env node

import { program } from 'commander';
import path from 'path';
import { promises as fs } from 'fs';
import { ComprehensiveSocialGenerator } from '../generators/social/comprehensive';
import { FacebookGenerator } from '../generators/social/facebook';
import { TwitterGenerator } from '../generators/social/twitter';
import { LinkedInGenerator } from '../generators/social/linkedin';
import { TikTokGenerator } from '../generators/social/tiktok';
import { WhatsAppGenerator } from '../generators/social/whatsapp';
import { InstagramGenerator } from '../generators/social/instagram';
import { FaviconGenerator } from '../generators/favicon/favicon';
import { PWAGenerator } from '../generators/pwa/pwa';
import { ConfigValidator, type SocialForgeConfig } from '../core/config-validator';

const packageJson = require('../../package.json');

interface CLIOptions {
  output?: string;
  config?: string;
  quality?: string;
  prefix?: string;
  all?: boolean;
  social?: boolean;
  facebook?: boolean;
  twitter?: boolean;
  linkedin?: boolean;
  instagram?: boolean;
  tiktok?: boolean;
  whatsapp?: boolean;
  messaging?: boolean;
  platforms?: boolean;
  favicon?: boolean;
  pwa?: boolean;
  title?: string;
  description?: string;
  themeColor?: string;
  backgroundColor?: string;
  template?: string;
  verbose?: boolean;
}

/**
 * Load configuration from file or use defaults
 */
async function loadConfig(configPath?: string, options: CLIOptions = {}): Promise<SocialForgeConfig> {
  let config: Partial<SocialForgeConfig> = {};

  // Load config file if specified
  if (configPath) {
    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      config = JSON.parse(configContent);
    } catch (error) {
      console.warn(`Warning: Could not load config file ${configPath}. Using defaults.`);
    }
  }

  // Override with CLI options
  const finalConfig: SocialForgeConfig = {
    appName: config.appName || options.title || 'My App',
    description: config.description || options.description || 'Generated with Social Forge',
    themeColor: config.themeColor || options.themeColor || '#000000',
    backgroundColor: config.backgroundColor || options.backgroundColor || '#ffffff',
    
    socialPreview: {
      title: options.title || config.socialPreview?.title || config.appName || 'My App',
      description: options.description || config.socialPreview?.description || config.description || '',
      template: (options.template as any) || config.socialPreview?.template || 'basic'
    },

    platforms: {
      social: options.social || config.platforms?.social !== false,
      favicon: options.favicon || config.platforms?.favicon !== false,
      pwa: options.pwa || config.platforms?.pwa !== false
    },

    output: {
      path: options.output || config.output?.path || './public/images',
      prefix: options.prefix || config.output?.prefix || '/images/',
      quality: parseInt(options.quality || '90') || config.output?.quality || 90
    }
  };

  // Return the final configuration
  return finalConfig;
}

/**
 * Generate all assets
 */
async function generateAll(sourceImage: string, config: SocialForgeConfig, options: CLIOptions) {
  console.log('🚀 Generating all assets...\n');

  const generator = new ComprehensiveSocialGenerator(sourceImage, config);
  
  await generator.generate({
    includeStandard: true,
    includeInstagram: true,
    includeMessaging: true,
    includePlatforms: true
  });

  // Generate favicon
  const faviconGenerator = new FaviconGenerator(sourceImage, config);
  await faviconGenerator.generate();

  // Generate PWA assets
  const pwaGenerator = new PWAGenerator(sourceImage, config);
  await pwaGenerator.generate();

  const files = [
    ...await generator.getGeneratedFiles(),
    ...faviconGenerator.getGeneratedFiles(),
    ...pwaGenerator.getGeneratedFiles()
  ];

  console.log(`✅ Generated ${files.length} files in ${config.output.path}`);
  
  if (options.verbose) {
    console.log('\nGenerated files:');
    files.forEach(file => console.log(`  📄 ${file}`));
  }
}

/**
 * Generate specific platform assets
 */
async function generateSpecific(sourceImage: string, config: SocialForgeConfig, options: CLIOptions) {
  const generators: Array<{ name: string; generator: any; files: string[] }> = [];

  // Social media platforms
  if (options.facebook) {
    const generator = new FacebookGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Facebook', generator, files: generator.getGeneratedFiles() });
  }

  if (options.twitter) {
    const generator = new TwitterGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Twitter', generator, files: generator.getGeneratedFiles() });
  }

  if (options.linkedin) {
    const generator = new LinkedInGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'LinkedIn', generator, files: generator.getGeneratedFiles() });
  }

  if (options.instagram) {
    const generator = new InstagramGenerator(sourceImage, config);
    await generator.generate({ includeStories: false, includeReels: false }); // Avoid text overlay issues
    generators.push({ name: 'Instagram', generator, files: generator.getGeneratedFiles() });
  }

  if (options.tiktok) {
    const generator = new TikTokGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'TikTok', generator, files: generator.getGeneratedFiles() });
  }

  if (options.whatsapp) {
    const generator = new WhatsAppGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'WhatsApp', generator, files: generator.getGeneratedFiles() });
  }

  // Category generators
  if (options.social) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({ includeStandard: true, includeInstagram: false, includeMessaging: false, includePlatforms: false });
    generators.push({ name: 'Social Media', generator, files: ['facebook.png', 'twitter.png', 'linkedin.png'] });
  }

  if (options.messaging) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({ includeStandard: false, includeInstagram: false, includeMessaging: true, includePlatforms: false });
    generators.push({ name: 'Messaging Apps', generator, files: ['whatsapp-profile.png', 'discord.png', 'telegram.png'] });
  }

  if (options.platforms) {
    const generator = new ComprehensiveSocialGenerator(sourceImage, config);
    await generator.generate({ includeStandard: false, includeInstagram: false, includeMessaging: false, includePlatforms: true });
    generators.push({ name: 'Video Platforms', generator, files: ['tiktok.png', 'youtube-thumbnail.png', 'pinterest-pin.png'] });
  }

  if (options.favicon) {
    const generator = new FaviconGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'Favicons', generator, files: generator.getGeneratedFiles() });
  }

  if (options.pwa) {
    const generator = new PWAGenerator(sourceImage, config);
    await generator.generate();
    generators.push({ name: 'PWA Assets', generator, files: generator.getGeneratedFiles() });
  }

  // Summary
  console.log('✅ Generation complete!\n');
  generators.forEach(({ name, files }) => {
    console.log(`📂 ${name}: ${files.length} files`);
    if (options.verbose) {
      files.slice(0, 5).forEach(file => console.log(`  📄 ${file}`));
      if (files.length > 5) {
        console.log(`  ... and ${files.length - 5} more`);
      }
    }
  });

  const totalFiles = generators.reduce((sum, { files }) => sum + files.length, 0);
  console.log(`\n🎉 Total: ${totalFiles} files generated in ${config.output.path}`);
}

/**
 * Show meta tags for generated assets
 */
async function showMetaTags(sourceImage: string, config: SocialForgeConfig, options: CLIOptions) {
  console.log('🏷️  HTML Meta Tags:\n');

  const generators = [
    new ComprehensiveSocialGenerator(sourceImage, config),
    new FaviconGenerator(sourceImage, config),
    new PWAGenerator(sourceImage, config)
  ];

  const allTags: string[] = [];
  
  for (const generator of generators) {
    const tags = generator.getMetaTags();
    allTags.push(...tags);
  }

  // Remove duplicates and sort
  const uniqueTags = [...new Set(allTags)].sort();

  uniqueTags.forEach(tag => {
    console.log(tag);
  });

  console.log(`\n📊 Total: ${uniqueTags.length} meta tags`);
}

/**
 * Initialize a new project
 */
async function initProject(directory: string = '.') {
  console.log('🎬 Initializing Social Forge project...\n');

  // Create directory if it doesn't exist
  await fs.mkdir(directory, { recursive: true });

  const configPath = path.join(directory, 'social-forge.config.json');
  const defaultConfig: SocialForgeConfig = {
    appName: 'My App',
    description: 'My awesome application',
    themeColor: '#000000',
    backgroundColor: '#ffffff',
    
    socialPreview: {
      title: 'My App',
      description: 'My awesome application',
      template: 'basic'
    },

    platforms: {
      social: true,
      favicon: true,
      pwa: true
    },

    output: {
      path: './public/images',
      prefix: '/images/',
      quality: 90
    }
  };

  await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
  console.log(`✅ Created configuration file: ${configPath}`);
  
  console.log('\n📋 Next steps:');
  console.log('  1. Edit social-forge.config.json with your app details');
  console.log('  2. Run: npx social-forge generate ./logo.png --all');
  console.log('  3. Add the generated meta tags to your HTML');
}

// CLI Program setup
program
  .name('social-forge')
  .description('Generate comprehensive social media assets, favicons, and PWA icons')
  .version(packageJson.version);

// Generate command
program
  .command('generate <source>')
  .description('Generate images from source file')
  .option('-o, --output <path>', 'Output directory', './public/images')
  .option('-c, --config <path>', 'Config file path')
  .option('-q, --quality <number>', 'Image quality (1-100)', '90')
  .option('-p, --prefix <path>', 'URL prefix for generated files', '/images/')
  .option('--all', 'Generate all asset types')
  .option('--social', 'Generate standard social media assets (Facebook, Twitter, LinkedIn)')
  .option('--facebook', 'Generate Facebook assets only')
  .option('--twitter', 'Generate Twitter assets only')
  .option('--linkedin', 'Generate LinkedIn assets only')
  .option('--instagram', 'Generate Instagram assets only')
  .option('--tiktok', 'Generate TikTok assets only')
  .option('--whatsapp', 'Generate WhatsApp assets only')
  .option('--messaging', 'Generate messaging app assets')
  .option('--platforms', 'Generate video/visual platform assets')
  .option('--favicon', 'Generate favicon assets only')
  .option('--pwa', 'Generate PWA assets only')
  .option('-t, --title <text>', 'App title')
  .option('-d, --description <text>', 'App description')
  .option('--theme-color <color>', 'Theme color (hex)', '#000000')
  .option('--background-color <color>', 'Background color (hex)', '#ffffff')
  .option('--template <type>', 'Template type (basic|gradient|custom)', 'basic')
  .option('-v, --verbose', 'Verbose output')
  .action(async (source: string, options: CLIOptions) => {
    try {
      // Validate source file
      const sourcePath = path.resolve(source);
      await fs.access(sourcePath);

      console.log(`📷 Source image: ${sourcePath}`);
      
      // Load configuration
      const config = await loadConfig(options.config, options);
      
      // Ensure output directory exists
      await fs.mkdir(config.output.path, { recursive: true });
      
      console.log(`📁 Output directory: ${config.output.path}`);
      console.log(`🎨 Theme: ${config.themeColor} | Background: ${config.backgroundColor}\n`);

      // Generate assets based on options
      if (options.all) {
        await generateAll(sourcePath, config, options);
      } else if (options.facebook || options.twitter || options.linkedin || options.instagram || 
                 options.tiktok || options.whatsapp || options.social || options.messaging || 
                 options.platforms || options.favicon || options.pwa) {
        await generateSpecific(sourcePath, config, options);
      } else {
        // Default: generate standard social media assets
        await generateSpecific(sourcePath, config, { ...options, social: true });
      }

    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Meta tags command
program
  .command('meta <source>')
  .description('Generate HTML meta tags for the assets')
  .option('-c, --config <path>', 'Config file path')
  .option('-p, --prefix <path>', 'URL prefix for generated files', '/images/')
  .action(async (source: string, options: CLIOptions) => {
    try {
      const sourcePath = path.resolve(source);
      await fs.access(sourcePath);

      const config = await loadConfig(options.config, options);
      await showMetaTags(sourcePath, config, options);

    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Init command
program
  .command('init [directory]')
  .description('Initialize a new Social Forge project')
  .action(async (directory?: string) => {
    try {
      await initProject(directory);
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Info command
program
  .command('info')
  .description('Show platform coverage and capabilities')
  .action(() => {
    console.log('🌍 Social Forge Platform Coverage\n');
    
    console.log('📱 Major Social Networks:');
    console.log('  ✅ Facebook (1200x630) - OpenGraph optimized');
    console.log('  ✅ Twitter/X (1200x600) - Twitter Cards support');
    console.log('  ✅ LinkedIn (1200x627) - Professional networking');
    console.log('  ✅ Instagram (Multiple) - Square, Portrait, Stories, Reels');
    console.log('  ✅ TikTok (1080x1920) - Vertical video format');
    console.log('  ✅ YouTube (1280x720) - Thumbnails and Shorts');
    console.log('  ✅ Pinterest (1000x1500) - Pin and board optimized');
    
    console.log('\n💬 Messaging Applications:');
    console.log('  ✅ WhatsApp (400x400 + Preview) - Profile and sharing');
    console.log('  ✅ iMessage (1200x630) - Apple ecosystem');
    console.log('  ✅ Discord (1200x630) - Gaming community');
    console.log('  ✅ Telegram (1200x630) - Secure messaging');
    console.log('  ✅ Signal (1200x630) - Privacy-focused');
    console.log('  ✅ Slack (1200x630) - Workplace communication');
    
    console.log('\n🔧 Technical Assets:');
    console.log('  ✅ Favicons - All sizes and formats (ICO, PNG, SVG)');
    console.log('  ✅ PWA Icons - App icons, splash screens, manifest');
    console.log('  ✅ Apple Touch Icons - iOS optimization');
    console.log('  ✅ Android Icons - Material Design compliance');
    console.log('  ✅ Windows Tiles - Microsoft Store support');
    
    console.log('\n📊 Statistics:');
    console.log('  • 25+ platform formats supported');
    console.log('  • Zero external dependencies (uses Sharp)');
    console.log('  • Framework-agnostic with Next.js helpers');
    console.log('  • TypeScript-first with full type safety');
    
    console.log('\n🚀 Getting Started:');
    console.log('  npx social-forge init          # Initialize project');
    console.log('  npx social-forge generate logo.png --all  # Generate everything');
    console.log('  npx social-forge generate logo.png --facebook --twitter  # Specific platforms');
    console.log('  npx social-forge meta logo.png  # Show meta tags');
  });

// Parse CLI arguments
program.parse();

export { program }; 