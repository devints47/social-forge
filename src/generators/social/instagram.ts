import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { SocialForgeConfig } from '../../core/config-validator';

export interface InstagramOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeStories?: boolean;
  includeReels?: boolean;
}

export class InstagramGenerator {
  private config: SocialForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: SocialForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate all Instagram assets
   */
  async generate(options: InstagramOptions = {}): Promise<void> {
    const { includeStories = true, includeReels = true } = options;

    // Generate feed posts
    await this.generateSquarePost(options);
    await this.generatePortraitPost(options);
    await this.generateLandscapePost(options);

    // Generate Stories if requested
    if (includeStories) {
      await this.generateStories(options);
    }

    // Generate Reels if requested
    if (includeReels) {
      await this.generateReels(options);
    }
  }

  /**
   * Generate Instagram square post (1080x1080)
   */
  private async generateSquarePost(options: InstagramOptions): Promise<void> {
    const { width, height } = ImageSizes.social.instagramSquare;
    const outputPath = path.join(this.config.output.path, 'instagram-square.png');

    const processor = new ImageProcessor(this.sourceImage);
    processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });

    await processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Generate Instagram portrait post (1080x1350)
   */
  private async generatePortraitPost(options: InstagramOptions): Promise<void> {
    const { width, height } = ImageSizes.social.instagramPortrait;
    const outputPath = path.join(this.config.output.path, 'instagram-portrait.png');

    const processor = new ImageProcessor(this.sourceImage);
    processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });

    await processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Generate Instagram landscape post (1080x566)
   */
  private async generateLandscapePost(options: InstagramOptions): Promise<void> {
    const { width, height } = ImageSizes.social.instagramLandscape;
    const outputPath = path.join(this.config.output.path, 'instagram-landscape.png');

    const processor = new ImageProcessor(this.sourceImage);
    processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template,
      background: this.config.backgroundColor
    });

    await processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Generate Instagram Stories (1080x1920)
   */
  private async generateStories(options: InstagramOptions): Promise<void> {
    const { width, height } = ImageSizes.social.instagramStories;
    const outputPath = path.join(this.config.output.path, 'instagram-stories.png');

    const processor = new ImageProcessor(this.sourceImage);
    processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template || 'gradient',
      background: this.config.backgroundColor
    });

    await processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Generate Instagram Reels (1080x1920)
   */
  private async generateReels(options: InstagramOptions): Promise<void> {
    const { width, height } = ImageSizes.social.instagramStories; // Same size as stories
    const outputPath = path.join(this.config.output.path, 'instagram-reels.png');

    const processor = new ImageProcessor(this.sourceImage);
    processor.createSocialPreview({
      width,
      height,
      title: options.title || this.config.appName,
      description: options.description,
      template: options.template || 'gradient',
      background: this.config.backgroundColor
    });

    await processor.save(outputPath, {
      format: 'png',
      quality: this.config.output.quality
    });
  }

  /**
   * Get HTML meta tags for Instagram
   */
  getMetaTags(): string[] {
    const { prefix = '/' } = this.config.output;
    return [
      `<meta property="og:image" content="${prefix}instagram-square.png" />`,
      `<meta property="og:image:width" content="${ImageSizes.social.instagramSquare.width}" />`,
      `<meta property="og:image:height" content="${ImageSizes.social.instagramSquare.height}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:image" content="${prefix}instagram-landscape.png" />`
    ];
  }

  /**
   * Get Next.js metadata configuration
   */
  getNextMetadata() {
    const { prefix = '/' } = this.config.output;
    return {
      openGraph: {
        images: [
          {
            url: `${prefix}instagram-square.png`,
            width: ImageSizes.social.instagramSquare.width,
            height: ImageSizes.social.instagramSquare.height
          },
          {
            url: `${prefix}instagram-portrait.png`,
            width: ImageSizes.social.instagramPortrait.width,
            height: ImageSizes.social.instagramPortrait.height
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        images: [`${prefix}instagram-landscape.png`]
      }
    };
  }
} 