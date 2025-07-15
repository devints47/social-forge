const sharp = require('sharp');

// Create a 1200x630 blue rectangle
sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 0, g: 0, b: 255, alpha: 1 }
  }
})
.png()
.toFile('test-assets/test-logo.png')
.then(() => console.log('Test image created successfully'))
.catch(err => console.error('Error creating test image:', err)); 