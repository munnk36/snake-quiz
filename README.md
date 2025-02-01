# Scale Scout 🐍

A snake identification quiz game using real observations from iNaturalist.

[Play Scale Scout Here!](https://scale-scout.surge.sh)

## Features

- Quiz yourself on snake identification using real wildlife observations
- Shareable quiz links - send the same quiz to friends
- Zoom-capable images for detailed scale pattern examination
- Educational content with both common and scientific names
- Attribution to original observers and photographers
- Progressive difficulty based on performance

## How to Play

1. Start a new quiz session
2. Examine the snake photograph carefully (use zoom for details)
3. Choose from multiple choice!
4. Learn from correct/incorrect answers
5. Share your quiz with friends using the link

## Known Issues

### Won't Fix

- Taxonomy/species names are only as accurate as iNaturalist's database
- Some image quality may vary based on original observations
- Should be filtering out anything that is dead, but sometimes these are not properly categorized
- Location Guess text is not always useful or specific enough

## Planned Features

- Increased guess diversity
  - current quizes are dominated with T. sirtalis
- Detect locale/ increased globalization support
- Show additional photos for each guess, if there are any
- Quiz modes dedicated to specific, frequently confused species
  - e.g. a Cotton-Water mode (is it a cottonmouth or a watersnake???)
- HARD mode, you must type in the full scientific name instead of multi choice
- Mapped coordinates are shown for each question

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
