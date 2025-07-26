import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { promises as fs } from 'fs';

const execFileAsync = promisify(execFile);

export interface ImageProcessorOptions {
  quality?: number;
  format?: 'png' | 'jpeg' | 'jpg' | 'webp' | 'avif' | 'tiff' | 'tif' | 'gif' | 'heif' | 'svg' | 'ico';
  background?: string;
  fit?: 'cover' | 'contain' | 'fill';
  zoom?: number; // Zoom factor (e.g., 1.1 for 10% zoom)
}

export interface TextOptions {
  text: string;
  font?: string;
  fontSize?: number;
  color?: string;
  position?: 'center' | 'top' | 'bottom';
  offset?: { x: number; y: number };
}

// List of supported input formats
export const SUPPORTED_INPUT_FORMATS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff', '.tif', '.gif', '.svg', '.bmp'];

export class ImageProcessor {
  private source: string;
  private tempFiles: string[] = [];

  constructor(source: string) {
    this.source = source;
  }

  /**
   * Check if ImageMagick is available
   */
  static async checkImageMagick(): Promise<boolean> {
    try {
      await execFileAsync('magick', ['-version']);
      return true;
    } catch (error) {
      try {
        // Fallback to legacy 'convert' command
        await execFileAsync('convert', ['-version']);
        return true;
      } catch (fallbackError) {
        return false;
      }
    }
  }

  /**
   * Get the appropriate ImageMagick command
   */
  private static async getMagickCommand(): Promise<string> {
    try {
      await execFileAsync('magick', ['-version']);
      return 'magick';
    } catch (error) {
      // Fallback to legacy 'convert' command
      return 'convert';
    }
  }

  /**
   * Resize image to specific dimensions using ImageMagick
   */
  async resize(width: number, height: number, options: ImageProcessorOptions = {}): Promise<string> {
    const {
      fit = 'cover',
      background = 'transparent',
      zoom = 1.0
    } = options;

    const tempOutput = path.join(path.dirname(this.source), `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
    this.tempFiles.push(tempOutput);

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args: string[] = [];

    // Input file
    args.push(this.source);

    // Apply high-quality filtering for better transparency handling
    args.push('-filter', 'lanczos');

    // Apply zoom if specified (with transparency preservation)
    if (zoom !== 1.0) {
      const zoomPercent = Math.round(zoom * 100);
      args.push('-resize', `${zoomPercent}%`);
    }

    // Handle different fit modes with transparency preservation
    if (fit === 'contain') {
      args.push('-resize', `${width}x${height}`);
      args.push('-gravity', 'center');
      // Preserve transparency during extent operation
      if (background === 'transparent') {
        args.push('-background', 'none');
      } else {
        args.push('-background', background);
      }
      args.push('-extent', `${width}x${height}`);
    } else if (fit === 'cover') {
      args.push('-resize', `${width}x${height}^`);
      args.push('-gravity', 'center');
      args.push('-extent', `${width}x${height}`);
    } else {
      // fill mode
      args.push('-resize', `${width}x${height}!`);
    }

    // Output file
    args.push(tempOutput);

    try {
      await execFileAsync(magickCmd, args);
      return tempOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick resize failed: ${errorMessage}`);
    }
  }

  /**
   * Add text overlay to image using ImageMagick
   */
  async addText(inputFile: string, options: TextOptions): Promise<string> {
    const {
      text,
      fontSize = 32,
      color = '#ffffff',
      position = 'center',
      offset = { x: 0, y: 0 }
    } = options;

    const tempOutput = path.join(path.dirname(this.source), `temp-text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
    this.tempFiles.push(tempOutput);

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args: string[] = [];

    args.push(inputFile);
    args.push('-fill', color);
    args.push('-pointsize', fontSize.toString());
    args.push('-gravity', position === 'center' ? 'center' : position === 'top' ? 'north' : 'south');

    // Add offset if specified
    if (offset.x !== 0 || offset.y !== 0) {
      args.push('-geometry', `+${offset.x}+${offset.y}`);
    }

    args.push('-annotate', '0', text);
    args.push(tempOutput);

    try {
      await execFileAsync(magickCmd, args);
      return tempOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick text overlay failed: ${errorMessage}`);
    }
  }

  /**
   * Apply color overlay or tint using ImageMagick
   */
  async applyColor(inputFile: string, color: string, opacity: number = 0.5): Promise<string> {
    const tempOutput = path.join(path.dirname(this.source), `temp-color-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`);
    this.tempFiles.push(tempOutput);

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args = [
      inputFile,
      '-fill', color,
      '-colorize', `${Math.round(opacity * 100)}%`,
      tempOutput
    ];

    try {
      await execFileAsync(magickCmd, args);
      return tempOutput;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick color overlay failed: ${errorMessage}`);
    }
  }

  /**
   * Save image to file with format conversion and transparency preservation
   */
  async save(outputPath: string, options: ImageProcessorOptions = {}): Promise<void> {
    // Get format from output path or options
    let format = path.extname(outputPath).slice(1).toLowerCase();
    if (options.format) {
      format = options.format;
    }
    
    // Normalize format names
    if (format === 'jpg') format = 'jpeg';
    if (format === 'tif') format = 'tiff';
    
    const quality = options.quality || 90;

    // Ensure output directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const magickCmd = await ImageProcessor.getMagickCommand();
    const args: string[] = [];

    args.push(this.source);

    // PNG-specific transparency preservation (critical fix from debugging)
    if (format === 'png') {
      // Force RGBA transparency preservation - prevents 8-bit colormap conversion
      args.push('-define', 'png:color-type=6');
      
      // Ensure proper bit depth for transparency
      args.push('-define', 'png:bit-depth=8');
      
      // Optimize PNG compression
      if (quality < 95) {
        // Use adaptive filtering for better compression
        args.push('-define', 'png:compression-filter=5');
        args.push('-define', 'png:compression-level=9');
      }
      
      // Ensure full range for web images
      args.push('-define', 'png:format=png32');
    }

    // Set quality for lossy formats
    if (['jpeg', 'webp', 'avif'].includes(format)) {
      args.push('-quality', quality.toString());
    }

    // ICO format requires special handling
    if (format === 'ico') {
      // Create proper ICO file with multiple sizes
      args.push('-define', 'icon:auto-resize=256,128,64,48,32,16');
      args.push('-compress', 'zip');
    }

    // WebP format optimization
    if (format === 'webp') {
      args.push('-define', 'webp:alpha-quality=100');
      if (options.background === 'transparent') {
        args.push('-define', 'webp:alpha-compression=1');
      }
    }

    // Set output format with proper specification
    args.push(`${format.toUpperCase()}:${outputPath}`);

    try {
      await execFileAsync(magickCmd, args);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`ImageMagick save failed: ${errorMessage}`);
    }
  }

  /**
   * Generate multiple sizes of the same image
   */
  async generateSizes(sizes: Array<{ width: number; height: number; name: string }>, outputDir: string, options: ImageProcessorOptions = {}): Promise<void> {
    // Check ImageMagick availability first
    const isAvailable = await ImageProcessor.checkImageMagick();
    if (!isAvailable) {
      throw new Error(
        'ImageMagick is not installed or not found in PATH. ' +
        'Please install ImageMagick:\n' +
        '- macOS: brew install imagemagick\n' +
        '- Ubuntu/Debian: apt-get install imagemagick\n' +
        '- Windows: choco install imagemagick or download from https://imagemagick.org'
      );
    }

    const results: Promise<void>[] = [];

    for (const size of sizes) {
      const promise = (async () => {
        try {
          const resizedFile = await this.resize(size.width, size.height, options);
          const processor = new ImageProcessor(resizedFile);
          await processor.save(path.join(outputDir, size.name), options);
                 } catch (error) {
           const errorMessage = error instanceof Error ? error.message : String(error);
           throw new Error(`Failed to generate size ${size.width}x${size.height}: ${errorMessage}`);
         }
      })();
      
      results.push(promise);
    }

    try {
      await Promise.all(results);
    } finally {
      // Clean up temporary files
      await this.cleanup();
    }
  }

  /**
   * Create a social media preview with template
   */
  async createSocialPreview(options: {
    width: number;
    height: number;
    title?: string;
    description?: string;
    logo?: string;
    template?: 'basic' | 'gradient' | 'custom';
    background?: string;
  }): Promise<string> {
    const {
      width,
      height,
      title,
      description,
      template = 'basic',
      background = '#000000'
    } = options;

    // Start with resized base image
    let currentFile = await this.resize(width, height, {
      fit: 'cover',
      background
    });

    // Add gradient overlay if template is gradient
    if (template === 'gradient') {
      currentFile = await this.applyColor(currentFile, 'black', 0.4);
    }

    // Add title if provided
    if (title) {
      currentFile = await this.addText(currentFile, {
        text: title,
        fontSize: Math.floor(height / 10),
        position: 'center',
        offset: { x: 0, y: description ? -height / 8 : 0 }
      });
    }

    // Add description if provided
    if (description) {
      currentFile = await this.addText(currentFile, {
        text: description,
        fontSize: Math.floor(height / 20),
        position: 'center',
        offset: { x: 0, y: height / 8 }
      });
    }

    return currentFile;
  }

  /**
   * Clean up temporary files
   */
  async cleanup(): Promise<void> {
    const cleanupPromises = this.tempFiles.map(async (file) => {
      try {
        await fs.unlink(file);
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    await Promise.allSettled(cleanupPromises);
    this.tempFiles = [];
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