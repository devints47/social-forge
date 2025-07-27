import path from 'path';
import fs from 'fs/promises';
import { OpenGraphGenerator } from '../opengraph';
import { ImageSizes, enableMockMode, disableMockMode } from '../../../core/image-processor';
import type { PixelForgeConfig } from '../../../core/config-validator';

describe('OpenGraphGenerator', () => {
  const testConfig: PixelForgeConfig = {
    appName: 'Test App',
    themeColor: '#000000',
    backgroundColor: '#ffffff',
    output: {
      path: path.join(__dirname, 'output'),
      quality: 90
    },
    socialPreview: {
      title: 'Test Title',
      description: 'Test Description',
      template: 'basic'
    }
  };

  beforeAll(async () => {
    // Enable mock mode for testing without ImageMagick
    enableMockMode();
    
    // Create output directory
    await fs.mkdir(testConfig.output.path, { recursive: true });
    
    // Create a test image if it doesn't exist
    const testImageDir = path.join(__dirname, 'fixtures');
    const testImagePath = path.join(testImageDir, 'test-image.png');
    
    try {
      await fs.mkdir(testImageDir, { recursive: true });
      // Check if test image exists, if not create a simple one
      try {
        await fs.access(testImagePath);
      } catch {
        // Create a small empty file as a placeholder
        await fs.writeFile(testImagePath, Buffer.from([
          0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 
          0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 
          0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4, 0x89, 0x00, 0x00, 0x00, 
          0x0A, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0x60, 0x00, 0x00, 0x00, 
          0x02, 0x00, 0x01, 0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00, 0x49, 
          0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
        ]));
      }
    } catch (error) {
      console.error('Error setting up test image:', error);
    }
  });

  afterAll(async () => {
    // Clean up output directory
    await fs.rm(testConfig.output.path, { recursive: true, force: true });
    
    // Disable mock mode
    disableMockMode();
  });

  it('should generate all required social media images', async () => {
    const generator = new OpenGraphGenerator(
      path.join(__dirname, 'fixtures', 'test-image.png'),
      testConfig
    );

    await generator.generate();

    // Check if files were created
    const files = await fs.readdir(testConfig.output.path);
    expect(files).toContain('og-facebook.png');
    expect(files).toContain('og-linkedin.png');
    expect(files).toContain('twitter-card.png');
  });

  it('should generate correct meta tags', () => {
    const generator = new OpenGraphGenerator(
      path.join(__dirname, 'fixtures', 'test-image.png'),
      testConfig
    );

    const tags = generator.getMetaTags();

    // Check Facebook tags
    expect(tags).toContain(`<meta property="og:image" content="/og-facebook.png" />`);
    expect(tags).toContain(`<meta property="og:image:width" content="${ImageSizes.social.facebook.width}" />`);
    expect(tags).toContain(`<meta property="og:image:height" content="${ImageSizes.social.facebook.height}" />`);

    // Check Twitter tags
    expect(tags).toContain(`<meta name="twitter:card" content="summary_large_image" />`);
    expect(tags).toContain(`<meta name="twitter:image" content="/twitter-card.png" />`);
  });

  it('should generate Next.js metadata', () => {
    const generator = new OpenGraphGenerator(
      path.join(__dirname, 'fixtures', 'test-image.png'),
      testConfig
    );

    const metadata = generator.getNextMetadata();

    // Check OpenGraph images
    expect(metadata.openGraph.images).toHaveLength(2);
    expect(metadata.openGraph.images[0]).toEqual({
      url: '/og-facebook.png',
      width: ImageSizes.social.facebook.width,
      height: ImageSizes.social.facebook.height
    });

    // Check Twitter card
    expect(metadata.twitter.card).toBe('summary_large_image');
    expect(metadata.twitter.images).toContain('/twitter-card.png');
  });
}); 