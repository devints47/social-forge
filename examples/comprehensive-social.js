const { ComprehensiveSocialGenerator } = require('../dist/generators/social/comprehensive');
const { ConfigValidator } = require('../dist/core/config-validator');
const path = require('path');

async function demonstrateComprehensiveSocial() {
  console.log('🚀 Demonstrating Comprehensive Social Media Generation');
  console.log('='.repeat(60));

  // Configuration for our demo
  const config = {
    appName: 'Social Forge',
    description: 'Comprehensive image generation for all social media platforms and messaging apps',
    themeColor: '#3b82f6',
    backgroundColor: '#ffffff',
    
    socialPreview: {
      title: 'Social Forge',
      description: 'Universal social media image generator',
      template: 'gradient'
    },
    
    platforms: {
      social: true,
      favicon: true,
      pwa: true
    },
    
    output: {
      path: './output/comprehensive-demo',
      prefix: '/images/',
      quality: 90
    }
  };

  // Validate configuration
  const validator = new ConfigValidator();
  const validatedConfig = await validator.validate(config);
  
  // Use a sample image (you would provide your own)
  const sourceImage = path.join(__dirname, '../src/generators/social/__tests__/fixtures/test-image.png');
  
  // Create comprehensive generator
  const generator = new ComprehensiveSocialGenerator(sourceImage, validatedConfig);
  
  console.log('📱 Generating images for ALL platforms...\n');
  
  // Generate for all platforms
  await generator.generate({
    // Platform categories
    includeStandard: true,      // Facebook, Twitter, LinkedIn
    includeInstagram: true,     // All Instagram formats
    includeMessaging: true,     // WhatsApp, Discord, Telegram, Signal, Slack, iMessage, etc.
    includePlatforms: true,     // TikTok, YouTube, Pinterest, Snapchat, Threads, Bluesky
    
    // Specific platform controls
    platforms: {
      // Standard social (enabled by default)
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
      wechat: true,  // Usually disabled by default
      
      // Video/Visual platforms
      tiktok: true,
      youtube: true,
      pinterest: true,
      snapchat: true,
      
      // Emerging platforms
      threads: true,
      bluesky: true,
      mastodon: true
    }
  });
  
  // Get list of generated files
  const generatedFiles = await generator.getGeneratedFiles();
  
  console.log('✅ Generated files:');
  console.log('-'.repeat(40));
  
  const categories = {
    'Standard Social Media': [
      'og-facebook.png',
      'twitter-card.png', 
      'og-linkedin.png'
    ],
    'Instagram Formats': [
      'instagram-square.png',
      'instagram-portrait.png',
      'instagram-landscape.png',
      'instagram-stories.png',
      'instagram-reels.png'
    ],
    'Messaging Apps': [
      'messaging-standard.png',
      'whatsapp-square.png',
      'whatsapp-link.png',
      'discord.png',
      'telegram.png',
      'signal.png',
      'slack.png',
      'imessage.png',
      'android-rcs.png',
      'wechat.png'
    ],
    'Video & Visual Platforms': [
      'tiktok.png',
      'youtube-thumbnail.png',
      'youtube-shorts.png',
      'pinterest-pin.png',
      'pinterest-square.png',
      'snapchat.png'
    ],
    'Emerging Platforms': [
      'threads.png',
      'bluesky.png',
      'mastodon.png'
    ]
  };
  
  Object.entries(categories).forEach(([category, files]) => {
    console.log(`\n📂 ${category}:`);
    files.forEach(file => {
      console.log(`   ✓ ${file}`);
    });
  });
  
  console.log(`\n📊 Total: ${generatedFiles.length} images generated`);
  
  // Generate HTML meta tags
  console.log('\n🏷️  Generated HTML meta tags:');
  console.log('-'.repeat(40));
  const metaTags = generator.getMetaTags();
  metaTags.slice(0, 10).forEach(tag => {
    console.log(`   ${tag}`);
  });
  console.log(`   ... and ${metaTags.length - 10} more tags`);
  
  // Generate Next.js metadata
  console.log('\n⚛️  Next.js metadata configuration:');
  console.log('-'.repeat(40));
  const nextMetadata = generator.getNextMetadata();
  console.log(JSON.stringify(nextMetadata, null, 2));
  
  console.log('\n🎉 Comprehensive social media generation complete!');
  console.log(`📁 Check your output directory: ${config.output.path}`);
}

// Platform coverage summary
function showPlatformCoverage() {
  console.log('\n🌍 Platform Coverage Summary');
  console.log('='.repeat(60));
  
  const platforms = {
    'Major Social Networks': [
      'Facebook (1200x630)',
      'Twitter/X (1200x600)', 
      'LinkedIn (1200x627)',
      'Instagram (Multiple formats)',
      'TikTok (1080x1920)',
      'YouTube (1280x720 + Shorts)',
      'Pinterest (1000x1500 + Square)',
      'Snapchat (1080x1920)'
    ],
    'Messaging Applications': [
      'WhatsApp (400x400 + Link preview)',
      'iMessage (1200x630)',
      'Discord (1200x630)',
      'Telegram (1200x630)', 
      'Signal (1200x630)',
      'Slack (1200x630)',
      'Android RCS (1200x630)',
      'WeChat (500x400)',
      'Line (1200x630)'
    ],
    'Emerging Platforms': [
      'Threads (1080x1080)',
      'Bluesky (1200x630)',
      'Mastodon (1200x630)'
    ],
    'Mobile Integration': [
      'Apple/iOS sharing',
      'Android sharing',
      'SMS/MMS support',
      'Rich Communication Services (RCS)'
    ]
  };
  
  Object.entries(platforms).forEach(([category, items]) => {
    console.log(`\n📱 ${category}:`);
    items.forEach(item => {
      console.log(`   ✓ ${item}`);
    });
  });
  
  console.log('\n📈 Statistics:');
  console.log(`   • ${Object.values(platforms).flat().length} total platform formats`);
  console.log(`   • ${Object.keys(platforms).length} major categories`);
  console.log(`   • Zero external dependencies (uses Sharp)`);
  console.log(`   • Framework-agnostic with helpers for React/Next.js`);
}

// Run the demonstration
if (require.main === module) {
  demonstrateComprehensiveSocial()
    .then(() => {
      showPlatformCoverage();
    })
    .catch(console.error);
}

module.exports = {
  demonstrateComprehensiveSocial,
  showPlatformCoverage
}; 