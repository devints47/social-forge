import { promises as fs } from 'fs';
import path from 'path';

export interface SocialForgeConfig {
  // Basic Info
  appName: string;
  description?: string;
  themeColor: string;
  backgroundColor: string;

  // Social Media
  socialPreview?: {
    title?: string;
    description?: string;
    imageText?: string;
    template?: 'basic' | 'gradient' | 'custom';
    font?: string;
  };

  // Platform Specific
  platforms?: {
    social?: boolean;
    favicon?: boolean;
    pwa?: boolean;
    apple?: boolean;
    android?: boolean;
    windows?: boolean;
  };

  // Output Options
  output: {
    path: string;
    prefix?: string;
    quality?: number;
    format?: 'png' | 'jpeg' | 'webp';
  };
}

export class ConfigValidator {
  private config: SocialForgeConfig;
  private errors: string[] = [];

  constructor(config: SocialForgeConfig) {
    this.config = config;
  }

  /**
   * Validate the entire configuration
   */
  async validate(): Promise<{ isValid: boolean; errors: string[] }> {
    this.errors = [];

    // Validate required fields
    this.validateRequired();

    // Validate colors
    this.validateColors();

    // Validate output configuration
    await this.validateOutput();

    // Validate social preview configuration
    if (this.config.socialPreview) {
      this.validateSocialPreview();
    }

    return {
      isValid: this.errors.length === 0,
      errors: this.errors
    };
  }

  /**
   * Validate required fields
   */
  private validateRequired() {
    if (!this.config.appName) {
      this.errors.push('appName is required');
    }

    if (!this.config.output?.path) {
      this.errors.push('output.path is required');
    }
  }

  /**
   * Validate color formats
   */
  private validateColors() {
    const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (this.config.themeColor && !colorRegex.test(this.config.themeColor)) {
      this.errors.push('themeColor must be a valid hex color (e.g., #ff0000)');
    }

    if (this.config.backgroundColor && !colorRegex.test(this.config.backgroundColor)) {
      this.errors.push('backgroundColor must be a valid hex color (e.g., #ff0000)');
    }
  }

  /**
   * Validate output configuration
   */
  private async validateOutput() {
    const { output } = this.config;

    // Validate quality
    if (output.quality !== undefined) {
      if (output.quality < 1 || output.quality > 100) {
        this.errors.push('output.quality must be between 1 and 100');
      }
    }

    // Validate format
    if (output.format && !['png', 'jpeg', 'webp'].includes(output.format)) {
      this.errors.push('output.format must be one of: png, jpeg, webp');
    }

    // Validate output path
    try {
      const outputPath = path.resolve(output.path);
      await fs.access(path.dirname(outputPath));
    } catch (error) {
      this.errors.push(`Output directory ${output.path} is not accessible`);
    }

    // Validate prefix
    if (output.prefix) {
      if (!output.prefix.startsWith('/')) {
        this.errors.push('output.prefix must start with /');
      }
    }
  }

  /**
   * Validate social preview configuration
   */
  private validateSocialPreview() {
    const { socialPreview } = this.config;

    // Early return if socialPreview is undefined
    if (!socialPreview) return;

    if (socialPreview.template && !['basic', 'gradient', 'custom'].includes(socialPreview.template)) {
      this.errors.push('socialPreview.template must be one of: basic, gradient, custom');
    }

    // Validate text lengths
    if (socialPreview.title && socialPreview.title.length > 100) {
      this.errors.push('socialPreview.title must be less than 100 characters');
    }

    if (socialPreview.description && socialPreview.description.length > 200) {
      this.errors.push('socialPreview.description must be less than 200 characters');
    }
  }

  /**
   * Get default configuration
   */
  static getDefaultConfig(): Partial<SocialForgeConfig> {
    return {
      platforms: {
        social: true,
        favicon: true,
        pwa: true,
        apple: true,
        android: true,
        windows: true
      },
      socialPreview: {
        template: 'basic'
      }
    };
  }
} 