import sharp from 'sharp';
import path from 'path';
import { promises as fs } from 'fs';

export interface ImageProcessorOptions {
  quality?: number;
  format?: 'png' | 'jpeg' | 'webp';
  background?: string;
  fit?: 'cover' | 'contain' | 'fill';
}

export interface TextOptions {
  text: string;
  font?: string;
  fontSize?: number;
  color?: string;
  position?: 'center' | 'top' | 'bottom';
  offset?: { x: number; y: number };
}

export class ImageProcessor {
  private source: string;
  private sharp: sharp.Sharp;

  constructor(source: string) {
    this.source = source;
    this.sharp = sharp(source);
  }

  /**
   * Resize image to specific dimensions
   */
  resize(width: number, height: number, options: ImageProcessorOptions = {}): ImageProcessor {
    const {
      fit = 'cover',
      background = { r: 0, g: 0, b: 0, alpha: 0 }
    } = options;

    this.sharp = this.sharp.resize(width, height, {
      fit,
      background
    });

    return this;
  }

  /**
   * Add text overlay to image
   */
  async addText(options: TextOptions): Promise<ImageProcessor> {
    const {
      text,
      fontSize = 32,
      color = '#ffffff',
      position = 'center',
      offset = { x: 0, y: 0 }
    } = options;

    // Create text overlay using SVG
    const svg = `
      <svg width="100%" height="100%">
        <style>
          .text { font: ${fontSize}px sans-serif; fill: ${color}; }
        </style>
        <text
          x="50%"
          y="${position === 'top' ? '10%' : position === 'bottom' ? '90%' : '50%'}"
          dx="${offset.x}"
          dy="${offset.y}"
          text-anchor="middle"
          class="text"
        >${text}</text>
      </svg>
    `;

    // Composite text over image
    this.sharp = this.sharp.composite([{
      input: Buffer.from(svg),
      top: 0,
      left: 0
    }]);

    return this;
  }

  /**
   * Apply color overlay or tint
   */
  applyColor(color: string, opacity: number = 0.5): ImageProcessor {
    // Create color overlay
    const overlay = Buffer.from([
      Math.round(opacity * 255),
      Math.round(opacity * 255),
      Math.round(opacity * 255),
      Math.round(opacity * 255)
    ]);

    this.sharp = this.sharp.composite([{
      input: overlay,
      blend: 'overlay'
    }]);

    return this;
  }

  /**
   * Save image to file
   */
  async save(outputPath: string, options: ImageProcessorOptions = {}): Promise<void> {
    const {
      quality = 90,
      format = path.extname(outputPath).slice(1) as 'png' | 'jpeg' | 'webp'
    } = options;

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Process and save image
    await this.sharp
      .toFormat(format, { quality })
      .toFile(outputPath);
  }

  /**
   * Generate multiple sizes of the same image
   */
  async generateSizes(sizes: Array<{ width: number; height: number; name: string }>, outputDir: string, options: ImageProcessorOptions = {}): Promise<void> {
    for (const size of sizes) {
      const processor = new ImageProcessor(this.source);
      await processor
        .resize(size.width, size.height, options)
        .save(path.join(outputDir, size.name));
    }
  }

  /**
   * Create a social media preview with template
   */
  createSocialPreview(options: {
    width: number;
    height: number;
    title?: string;
    description?: string;
    logo?: string;
    template?: 'basic' | 'gradient' | 'custom';
    background?: string;
  }): ImageProcessor {
    const {
      width,
      height,
      title,
      description,
      template = 'basic',
      background = '#000000'
    } = options;

    // Resize base image
    this.resize(width, height, {
      fit: 'cover',
      background
    });

    // Add gradient overlay if template is gradient
    if (template === 'gradient') {
      this.applyColor('linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)', 0.7);
    }

    // Add title if provided
    if (title) {
      this.addText({
        text: title,
        fontSize: Math.floor(height / 10),
        position: 'center',
        offset: { x: 0, y: description ? -height / 8 : 0 }
      });
    }

    // Add description if provided
    if (description) {
      this.addText({
        text: description,
        fontSize: Math.floor(height / 20),
        position: 'center',
        offset: { x: 0, y: height / 8 }
      });
    }

    return this;
  }
}

// Export comprehensive image sizes and formats
export const ImageSizes = {
  // Standard favicon sizes
  favicon: [16, 32, 48, 64, 128, 256],
  apple: [180],
  android: [192, 512],
  mstile: [
    { width: 70, height: 70 },
    { width: 150, height: 150 },
    { width: 310, height: 150 },
    { width: 310, height: 310 }
  ],
  
  // Social Media Platforms
  social: {
    // Standard OpenGraph (1200x630) - Most widely supported
    standard: { width: 1200, height: 630 },
    
    // Facebook variants
    facebook: { width: 1200, height: 630 },
    facebookSquare: { width: 1200, height: 1200 },
    
    // Twitter variants
    twitter: { width: 1200, height: 600 },
    twitterSquare: { width: 1200, height: 1200 },
    
    // LinkedIn
    linkedin: { width: 1200, height: 627 },
    linkedinCompany: { width: 1104, height: 736 },
    
    // Instagram
    instagramSquare: { width: 1080, height: 1080 },
    instagramPortrait: { width: 1080, height: 1350 },
    instagramLandscape: { width: 1080, height: 566 },
    instagramStories: { width: 1080, height: 1920 },
    
    // TikTok
    tiktok: { width: 1080, height: 1920 },
    
    // YouTube
    youtubeThumbnail: { width: 1280, height: 720 },
    youtubeShorts: { width: 1080, height: 1920 },
    
    // Pinterest
    pinterestPin: { width: 1000, height: 1500 },
    pinterestSquare: { width: 1000, height: 1000 },
    
    // Snapchat
    snapchat: { width: 1080, height: 1920 },
    
    // Emerging platforms
    threads: { width: 1080, height: 1080 },
    bluesky: { width: 1200, height: 630 },
    mastodon: { width: 1200, height: 630 }
  },
  
  // Messaging Apps
  messaging: {
    // Standard messaging preview
    standard: { width: 1200, height: 630 },
    
    // WhatsApp
    whatsapp: { width: 400, height: 400 },
    whatsappLink: { width: 1200, height: 630 },
    
    // iMessage (uses OpenGraph)
    imessage: { width: 1200, height: 630 },
    
    // Discord
    discord: { width: 1200, height: 630 },
    
    // Telegram
    telegram: { width: 1200, height: 630 },
    
    // Signal
    signal: { width: 1200, height: 630 },
    
    // Slack
    slack: { width: 1200, height: 630 },
    
    // WeChat
    wechat: { width: 500, height: 400 },
    
    // Line
    line: { width: 1200, height: 630 },
    
    // Android RCS
    androidRcs: { width: 1200, height: 630 },
    
    // Apple Business Chat
    appleBusinessChat: { width: 1200, height: 630 }
  },
  
  // Video thumbnail formats
  video: {
    youtube: { width: 1280, height: 720 },
    vimeo: { width: 1280, height: 720 },
    wistia: { width: 1280, height: 720 }
  },
  
  // Email formats
  email: {
    header: { width: 600, height: 200 },
    featured: { width: 600, height: 400 }
  }
}; 