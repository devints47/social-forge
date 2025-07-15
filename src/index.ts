// Core components
export { ImageProcessor, ImageSizes } from './core/image-processor';
export { ConfigValidator, type SocialForgeConfig } from './core/config-validator';

// Social Media Generators
export { OpenGraphGenerator } from './generators/social/opengraph';
export { InstagramGenerator, type InstagramOptions } from './generators/social/instagram';
export { MessagingGenerator, type MessagingOptions } from './generators/social/messaging';
export { PlatformGenerator, type PlatformOptions } from './generators/social/platforms';
export { ComprehensiveSocialGenerator, type ComprehensiveOptions } from './generators/social/comprehensive';

// Individual Platform Generators
export { FacebookGenerator, type FacebookOptions } from './generators/social/facebook';
export { TwitterGenerator, type TwitterOptions } from './generators/social/twitter';
export { LinkedInGenerator, type LinkedInOptions } from './generators/social/linkedin';
export { TikTokGenerator, type TikTokOptions } from './generators/social/tiktok';
export { WhatsAppGenerator, type WhatsAppOptions } from './generators/social/whatsapp';

// Favicon and PWA Generators
export { FaviconGenerator, type FaviconOptions } from './generators/favicon/favicon';
export { PWAGenerator, type PWAOptions } from './generators/pwa/pwa';

// Framework helpers (will be implemented)
// export { generateNextMetadata } from './frameworks/nextjs';
// export { generateReactComponents } from './frameworks/react';

// CLI
export { program as cli } from './cli/index';

/**
 * Default export for convenience
 */
export { ComprehensiveSocialGenerator as default } from './generators/social/comprehensive'; 