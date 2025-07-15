import path from 'path';
import fs from 'fs/promises';
import { OpenGraphGenerator } from '../opengraph';
import { ImageSizes } from '../../../core/image-processor';
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
    // Create output directory
    await fs.mkdir(testConfig.output.path, { recursive: true });
  });

  afterAll(async () => {
    // Clean up output directory
    await fs.rm(testConfig.output.path, { recursive: true, force: true });
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