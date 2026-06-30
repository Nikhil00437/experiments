# 🍳 Clean Kitchen - Recipe Finder App

A mobile-first web application that helps you find recipes based on ingredients you already have in your kitchen. Built with vanilla HTML, CSS, and JavaScript.

## Features

### 🎨 Clean Minimalist UI
- Mobile-optimized design for use while cooking
- Intuitive category-based ingredient selection
- Visual feedback for expiring items

### 🥘 Smart Pantry Entry
- **Category Grid**: Click categories (Vegetables, Dairy, Proteins, etc.) to reveal quick-add tags
- **Custom Input**: Add any ingredient not in the predefined lists
- **Expiring Soon Toggle**: Mark items that need to be used today with a visual warning indicator

### 📋 Recipe Cards
Each recipe card displays:
- ✅ **"What you have"** - Highlighted in green
- ❌ **"What you need"** - Highlighted in amber/red
- ⏱️ Cooking time & servings
- 📊 Match percentage with your pantry

### 💾 Local Storage
- Your pantry persists across page refreshes
- No authentication required for basic usage

### 🔌 API Integration
- Uses Spoonacular's `findByIngredients` endpoint
- `ranking=2` parameter minimizes extra ingredients needed
- Falls back to demo data if API is unavailable

## File Structure

```
/workspace
├── src/
│   ├── index.html    # Main HTML structure
│   ├── styles.css    # Clean, mobile-first CSS
│   └── app.js        # Application logic & API integration
└── README.md         # This file
```

## Quick Start

1. Open `src/index.html` in a web browser
2. Select ingredients from categories or add custom ones
3. Toggle "Expiring Soon" for items that need priority use
4. Click "🔍 Forage! Find Recipes"
5. Browse recipe cards and click any card for full details

## Usage Tips

### Adding Ingredients
1. Click a category button (e.g., "🥬 Vegetables")
2. Click ingredient tags to add them to your pantry
3. Use the text input for custom ingredients
4. Toggle "Expiring Soon" before adding items that need immediate use

### Finding Recipes
- The more ingredients you add, the better the matches
- Green items = you have them
- Red items = you need to buy them
- Higher match % = fewer missing ingredients

### Managing Your Pantry
- Click × on any pantry item to remove it
- Click "Clear All" to reset everything
- Your pantry is automatically saved to localStorage

## API Configuration

The app uses Spoonacular's free API. To use your own API key:

1. Sign up at [Spoonacular](https://spoonacular.com/)
2. Get your free API key
3. In `app.js`, replace `'demo'` with your actual key:
   ```javascript
   const apiKey = 'your-api-key-here';
   ```

**Note**: For production, proxy API requests through your backend to keep your API key secure.

## Technical Implementation

### Phase 1: Frontend & State ✅
- HTML structure with semantic sections
- CSS with mobile-first responsive design
- JavaScript state management with `fridgeIngredients` array

### Phase 2: API Connection ✅
- Fetch service using Spoonacular API
- Error handling with demo data fallback
- `ranking=2` for waste-minimizing results

### Phase 3: Display & Render ✅
- Recipe card grid layout
- Modal for detailed recipe view
- Color-coded ingredient status

## Future Enhancements

- [ ] User profiles with saved pantry staples
- [ ] Recipe filtering (dietary restrictions, cuisine type)
- [ ] Meal planning calendar
- [ ] Shopping list generation
- [ ] Backend with Node.js/Python for user accounts
- [ ] Image upload for ingredients
- [ ] Barcode scanning for packaged items

## Browser Support

Works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - Feel free to use and modify for your projects!
