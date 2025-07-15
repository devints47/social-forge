// Core components
export { ImageProcessor, ImageSizes } from './core/image-processor';
export { ConfigValidator, type SocialForgeConfig } from './core/config-validator';

// Social Media Generators
export { OpenGraphGenerator } from './generators/social/opengraph';
export { InstagramGenerator, type InstagramOptions } from './generators/social/instagram';
export { MessagingGenerator, type MessagingOptions } from './generators/social/messaging';
export { PlatformGenerator, type PlatformOptions } from './generators/social/platforms';
export { ComprehensiveSocialGenerator, type ComprehensiveOptions } from './generators/social/comprehensive';

// Framework helpers (will be implemented)
// export { generateNextMetadata } from './frameworks/nextjs';
// export { generateReactComponents } from './frameworks/react';

// CLI (will be implemented)
// export { cli } from './cli';

/**
 * Default export for convenience
 */
export { ComprehensiveSocialGenerator as default } from './generators/social/comprehensive'; 