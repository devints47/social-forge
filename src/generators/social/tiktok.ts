import path from 'path';
import { ImageProcessor, ImageSizes } from '../../core/image-processor';
import type { PixelForgeConfig } from '../../core/config-validator';

export interface TikTokOptions {
  title?: string;
  description?: string;
  template?: 'basic' | 'gradient' | 'custom';
  includeVertical?: boolean;
  includeProfile?: boolean;
}

export class TikTokGenerator {
  private config: PixelForgeConfig;
  private sourceImage: string;

  constructor(sourceImage: string, config: PixelForgeConfig) {
    this.config = config;
    this.sourceImage = sourceImage;
  }

  /**
   * Generate TikTok-optimized images
   */
  async generate(options: TikTokOptions = {}): Promise<void> {
    const { 
      includeVertical = true, 
      includeProfile = false,
      title,
      description,
      template = 'basic'
    } = options;

    if (includeVertical) {
      await this.generateVerticalImage(title, description, template);
    }

    if (includeProfile) {
      await this.generateProfileImage(title, description, template);
    }
  }

  /**
   * Generate vertical TikTok image (1080x1920)
   */
  private async generateVerticalImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'tiktok.png');

    await processor
      .createSocialPreview({
        width: ImageSizes.social.tiktok.width,
        height: ImageSizes.social.tiktok.height,
        title,
        description,
        template,
        background: this.config.backgroundColor
      })
      .save(outputPath);
  }

  /**
   * Generate square TikTok profile image (1080x1080)
   */
  private async generateProfileImage(title?: string, description?: string, template?: 'basic' | 'gradient' | 'custom'): Promise<void> {
    const processor = new ImageProcessor(this.sourceImage);
    const outputPath = path.join(this.config.output.path, 'tiktok-profile.png');

    await processor
      .createSocialPreview({
        width: ImageSizes.social.instagramSquare.width, // Reuse Instagram square size
        height: ImageSizes.social.instagramSquare.height,
        title,
        description,
        template,
        background: this.config.backgroundColor
      })
      .save(outputPath);
  }

  /**
   * Get HTML meta tags for TikTok
   */
  getMetaTags(): string[] {
    const prefix = this.config.output.prefix || '/';
    return [
      `<meta property="og:image" content="${prefix}tiktok.png">`,
      `<meta property="og:image:width" content="${ImageSizes.social.tiktok.width}">`,
      `<meta property="og:image:height" content="${ImageSizes.social.tiktok.height}">`,
      `<meta property="og:image:type" content="image/png">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:image" content="${prefix}tiktok.png">`,
      // TikTok-specific meta tags
      `<meta name="tiktok:app:name" content="${this.config.appName}">`,
      `<meta name="tiktok:app:description" content="${this.config.description || ''}">`,
    ];
  }

  /**
   * Get Next.js metadata configuration for TikTok
   */
  getNextMetadata() {
    const prefix = this.config.output.prefix || '/';
    return {
      openGraph: {
        title: this.config.appName,
        description: this.config.description,
        images: [
          {
            url: `${prefix}tiktok.png`,
            width: ImageSizes.social.tiktok.width,
            height: ImageSizes.social.tiktok.height,
            alt: this.config.appName,
          }
        ],
      },
      other: {
        'tiktok:app:name': this.config.appName,
        'tiktok:app:description': this.config.description || '',
      },
    };
  }

  /**
   * Get list of generated files
   */
  getGeneratedFiles(): string[] {
    return ['tiktok.png', 'tiktok-profile.png'];
  }
} 