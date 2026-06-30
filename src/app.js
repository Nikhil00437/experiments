// ============================================
// Clean Kitchen - Recipe Finder App
// ============================================

// Data: Ingredient categories and tags
const ingredientData = {
    vegetables: ['Tomato', 'Onion', 'Garlic', 'Ginger', 'Potato', 'Carrot', 'Spinach', 'Bell Pepper', 'Cucumber', 'Broccoli', 'Cauliflower', 'Zucchini', 'Mushroom', 'Lettuce', 'Cabbage'],
    dairy: ['Milk', 'Cheese', 'Butter', 'Yogurt', 'Cream', 'Paneer', 'Eggs', 'Sour Cream', 'Mozzarella', 'Cheddar'],
    proteins: ['Chicken', 'Beef', 'Pork', 'Fish', 'Tofu', 'Lentils', 'Chickpeas', 'Beans', 'Shrimp', 'Turkey', 'Lamb'],
    carbs: ['Rice', 'Pasta', 'Bread', 'Flour', 'Quinoa', 'Oats', 'Potato', 'Sweet Potato', 'Noodles', 'Tortilla', 'Corn'],
    fruits: ['Apple', 'Banana', 'Orange', 'Lemon', 'Lime', 'Strawberry', 'Blueberry', 'Mango', 'Pineapple', 'Grapes', 'Watermelon', 'Avocado'],
    spices: ['Salt', 'Black Pepper', 'Cumin', 'Turmeric', 'Paprika', 'Oregano', 'Basil', 'Thyme', 'Rosemary', 'Cinnamon', 'Garam Masala', 'Chili Powder']
};

// State
let fridgeIngredients = [];
let priorityMode = false;
let currentCategory = null;

// DOM Elements
const categoryBtns = document.querySelectorAll('.category-btn');
const quickAddContainer = document.getElementById('quickAddContainer');
const selectedCategoryEl = document.getElementById('selectedCategory');
const tagsGrid = document.getElementById('tagsGrid');
const closeQuickAdd = document.getElementById('closeQuickAdd');
const customIngredientInput = document.getElementById('customIngredient');
const addCustomBtn = document.getElementById('addCustomBtn');
const pantryItemsEl = document.getElementById('pantryItems');
const pantryCountEl = document.getElementById('pantryCount');
const priorityModeCheckbox = document.getElementById('priorityMode');
const forageBtn = document.getElementById('forageBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingEl = document.getElementById('loading');
const recipesSection = document.getElementById('recipesSection');
const recipeCardsEl = document.getElementById('recipeCards');
const recipeModal = document.getElementById('recipeModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

// ============================================
// Initialization
// ============================================

function init() {
    loadFromLocalStorage();
    renderPantryItems();
    setupEventListeners();
}

// ============================================
// Event Listeners
// ============================================

function setupEventListeners() {
    // Category buttons
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            openQuickAdd(category);
        });
    });

    // Close quick add
    closeQuickAdd.addEventListener('click', closeQuickAddPanel);

    // Custom ingredient
    addCustomBtn.addEventListener('click', addCustomIngredient);
    customIngredientInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addCustomIngredient();
    });

    // Priority toggle
    priorityModeCheckbox.addEventListener('change', (e) => {
        priorityMode = e.target.checked;
    });

    // Forage button
    forageBtn.addEventListener('click', findRecipes);

    // Clear button
    clearBtn.addEventListener('click', clearAll);

    // Modal close
    modalClose.addEventListener('click', closeModal);
    recipeModal.addEventListener('click', (e) => {
        if (e.target === recipeModal) closeModal();
    });
}

// ============================================
// Quick Add Panel
// ============================================

function openQuickAdd(category) {
    currentCategory = category;
    selectedCategoryEl.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    tagsGrid.innerHTML = '';
    
    const items = ingredientData[category];
    items.forEach(item => {
        const tagBtn = document.createElement('button');
        tagBtn.className = 'tag-btn';
        tagBtn.textContent = item;
        tagBtn.dataset.item = item;
        
        // Check if already added
        if (fridgeIngredients.some(ing => ing.name.toLowerCase() === item.toLowerCase())) {
            tagBtn.classList.add('added');
        }
        
        tagBtn.addEventListener('click', () => toggleIngredient(item, tagBtn));
        tagsGrid.appendChild(tagBtn);
    });
    
    quickAddContainer.classList.add('active');
}

function closeQuickAddPanel() {
    quickAddContainer.classList.remove('active');
    currentCategory = null;
}

function toggleIngredient(item, btnElement) {
    const existingIndex = fridgeIngredients.findIndex(ing => ing.name.toLowerCase() === item.toLowerCase());
    
    if (existingIndex >= 0) {
        // Remove ingredient
        fridgeIngredients.splice(existingIndex, 1);
        btnElement.classList.remove('added');
    } else {
        // Add ingredient
        fridgeIngredients.push({
            name: item,
            expiring: priorityMode
        });
        btnElement.classList.add('added');
        
        // Turn off priority mode after adding
        if (priorityMode) {
            priorityMode = false;
            priorityModeCheckbox.checked = false;
        }
    }
    
    saveToLocalStorage();
    renderPantryItems();
    updateTagButtons();
}

function updateTagButtons() {
    const tagBtns = tagsGrid.querySelectorAll('.tag-btn');
    tagBtns.forEach(btn => {
        const item = btn.dataset.item;
        const exists = fridgeIngredients.some(ing => ing.name.toLowerCase() === item.toLowerCase());
        btn.classList.toggle('added', exists);
    });
}

// ============================================
// Custom Ingredient
// ============================================

function addCustomIngredient() {
    const value = customIngredientInput.value.trim();
    if (!value) return;
    
    const exists = fridgeIngredients.some(ing => ing.name.toLowerCase() === value.toLowerCase());
    if (exists) {
        customIngredientInput.value = '';
        return;
    }
    
    fridgeIngredients.push({
        name: value,
        expiring: priorityMode
    });
    
    if (priorityMode) {
        priorityMode = false;
        priorityModeCheckbox.checked = false;
    }
    
    customIngredientInput.value = '';
    saveToLocalStorage();
    renderPantryItems();
    
    // Update tag buttons if panel is open
    if (currentCategory) {
        updateTagButtons();
    }
}

// ============================================
// Render Pantry Items
// ============================================

function renderPantryItems() {
    pantryItemsEl.innerHTML = '';
    pantryCountEl.textContent = fridgeIngredients.length;
    
    if (fridgeIngredients.length === 0) {
        pantryItemsEl.innerHTML = '<p style="color: #b2bec3; font-style: italic;">No ingredients yet. Add some from the categories above!</p>';
        return;
    }
    
    fridgeIngredients.forEach((ing, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = `pantry-item ${ing.expiring ? 'expiring' : ''}`;
        itemEl.innerHTML = `
            <span>${ing.name}</span>
            <span class="remove" data-index="${index}">&times;</span>
        `;
        
        const removeBtn = itemEl.querySelector('.remove');
        removeBtn.addEventListener('click', () => removeIngredient(index));
        
        pantryItemsEl.appendChild(itemEl);
    });
}

function removeIngredient(index) {
    fridgeIngredients.splice(index, 1);
    saveToLocalStorage();
    renderPantryItems();
    
    // Update tag buttons if panel is open
    if (currentCategory) {
        updateTagButtons();
    }
}

function clearAll() {
    fridgeIngredients = [];
    saveToLocalStorage();
    renderPantryItems();
    recipesSection.classList.remove('active');
    recipeCardsEl.innerHTML = '';
}

// ============================================
// Local Storage
// ============================================

function saveToLocalStorage() {
    localStorage.setItem('fridgeIngredients', JSON.stringify(fridgeIngredients));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('fridgeIngredients');
    if (saved) {
        fridgeIngredients = JSON.parse(saved);
    }
}

// ============================================
// API Integration - Spoonacular
// ============================================

async function findRecipes() {
    if (fridgeIngredients.length === 0) {
        alert('Please add some ingredients first!');
        return;
    }
    
    // Show loading
    loadingEl.classList.add('active');
    recipesSection.classList.remove('active');
    forageBtn.disabled = true;
    
    try {
        // Get ingredient names as comma-separated string
        const ingredientNames = fridgeIngredients.map(ing => ing.name).join(',');
        
        // Using Spoonacular API
        // Note: In production, you should proxy this through your backend to hide the API key
        const apiKey = 'demo'; // Use 'demo' for testing, replace with actual key in production
        const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientNames)}&ranking=2&number=10&apiKey=${apiKey}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        renderRecipeCards(data);
        
    } catch (error) {
        console.error('Error fetching recipes:', error);
        
        // Fallback: Show demo data if API fails (for demo purposes)
        const demoData = getDemoRecipes();
        renderRecipeCards(demoData);
    } finally {
        loadingEl.classList.remove('active');
        forageBtn.disabled = false;
    }
}

// ============================================
// Render Recipe Cards
// ============================================

function renderRecipeCards(recipes) {
    recipeCardsEl.innerHTML = '';
    
    if (recipes.length === 0) {
        recipeCardsEl.innerHTML = '<p style="text-align: center; color: #636e72;">No recipes found. Try different ingredients!</p>';
        recipesSection.classList.add('active');
        return;
    }
    
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.dataset.recipe = JSON.stringify(recipe);
        
        // Calculate match percentage
        const matchPercent = Math.round(recipe.usedIngredientCount / (recipe.usedIngredientCount + recipe.missedIngredientCount) * 100) || 0;
        
        // Format ingredients lists
        const haveItems = recipe.usedIngredients.map(i => i.name).join(', ');
        const missingItems = recipe.missedIngredients.map(i => i.name).join(', ');
        
        card.innerHTML = `
            <img src="${recipe.image || 'https://via.placeholder.com/400x200?text=Recipe'}" alt="${recipe.title}" class="recipe-image" onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span>⏱️ ${recipe.readyInMinutes || '?'} min</span>
                    <span>👥 ${recipe.servings || '?'} servings</span>
                </div>
                <div class="ingredients-status">
                    ${haveItems ? `<p class="have-items">✅ You have: ${haveItems}</p>` : ''}
                    ${missingItems ? `<p class="missing-items">❌ Missing: ${missingItems}</p>` : ''}
                </div>
                <div class="match-score">
                    <div class="match-percent">${matchPercent}%</div>
                    <div class="match-label">match with your pantry</div>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => openRecipeModal(recipe));
        recipeCardsEl.appendChild(card);
    });
    
    recipesSection.classList.add('active');
    
    // Scroll to results
    recipesSection.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// Recipe Modal
// ============================================

async function openRecipeModal(recipe) {
    modalBody.innerHTML = '<p>Loading recipe details...</p>';
    recipeModal.classList.add('active');
    
    try {
        // Fetch full recipe details
        const apiKey = 'demo';
        const url = `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        displayRecipeDetails(data);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        // Display basic info if detailed fetch fails
        displayRecipeDetails(recipe);
    }
}

function displayRecipeDetails(recipe) {
    const haveItems = recipe.usedIngredients ? recipe.usedIngredients.map(i => i.name).join(', ') : '';
    const missingItems = recipe.missedIngredients ? recipe.missedIngredients.map(i => i.name).join(', ') : '';
    
    modalBody.innerHTML = `
        <h2>${recipe.title}</h2>
        <img src="${recipe.image || 'https://via.placeholder.com/600x300?text=Recipe'}" alt="${recipe.title}" onerror="this.src='https://via.placeholder.com/600x300?text=No+Image'">
        <div class="meta-info">
            <span>⏱️ ${recipe.readyInMinutes || '?'} minutes</span>
            <span>👥 ${recipe.servings || '?'} servings</span>
            <span>📊 ${recipe.healthScore || 0}% healthy</span>
        </div>
        
        ${haveItems ? `
            <h3>✅ What You Have</h3>
            <p style="color: #00b894; margin-bottom: 16px;">${haveItems}</p>
        ` : ''}
        
        ${missingItems ? `
            <h3>❌ What You Need</h3>
            <p style="color: #e17055; margin-bottom: 16px;">${missingItems}</p>
        ` : ''}
        
        <h3>🛒 Ingredients</h3>
        <ul>
            ${recipe.extendedIngredients ? recipe.extendedIngredients.map(i => `<li>${i.original}</li>`).join('') : '<li>Ingredients not available</li>'}
        </ul>
        
        <h3>👨‍🍳 Instructions</h3>
        <ol>
            ${recipe.analyzedInstructions && recipe.analyzedInstructions[0] ? recipe.analyzedInstructions[0].steps.map(s => `<li>${s.step}</li>`).join('') : '<li>Instructions not available</li>'}
        </ol>
        
        ${recipe.sourceUrl ? `
            <p style="margin-top: 20px;">
                <a href="${recipe.sourceUrl}" target="_blank" rel="noopener noreferrer" style="color: #6c5ce7; text-decoration: none;">
                    View original recipe →
                </a>
            </p>
        ` : ''}
    `;
}

function closeModal() {
    recipeModal.classList.remove('active');
}

// ============================================
// Demo Data (Fallback)
// ============================================

function getDemoRecipes() {
    return [
        {
            id: 1,
            title: "Classic Tomato Pasta",
            image: "https://images.unsplash.com/photo-1626844131082-256783844137?w=400",
            readyInMinutes: 25,
            servings: 4,
            usedIngredientCount: 3,
            missedIngredientCount: 2,
            usedIngredients: [{name: 'Tomato'}, {name: 'Garlic'}, {name: 'Pasta'}],
            missedIngredients: [{name: 'Olive Oil'}, {name: 'Basil'}]
        },
        {
            id: 2,
            title: "Vegetable Stir Fry",
            image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
            readyInMinutes: 20,
            servings: 2,
            usedIngredientCount: 4,
            missedIngredientCount: 1,
            usedIngredients: [{name: 'Bell Pepper'}, {name: 'Onion'}, {name: 'Carrot'}, {name: 'Rice'}],
            missedIngredients: [{name: 'Soy Sauce'}]
        },
        {
            id: 3,
            title: "Cheesy Egg Scramble",
            image: "https://images.unsplash.com/photo-1525351484163-7529414395d8?w=400",
            readyInMinutes: 10,
            servings: 1,
            usedIngredientCount: 2,
            missedIngredientCount: 1,
            usedIngredients: [{name: 'Eggs'}, {name: 'Cheese'}],
            missedIngredients: [{name: 'Butter'}]
        },
        {
            id: 4,
            title: "Spinach & Paneer Curry",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
            readyInMinutes: 35,
            servings: 4,
            usedIngredientCount: 4,
            missedIngredientCount: 2,
            usedIngredients: [{name: 'Spinach'}, {name: 'Paneer'}, {name: 'Onion'}, {name: 'Garlic'}],
            missedIngredients: [{name: 'Garam Masala'}, {name: 'Cream'}]
        },
        {
            id: 5,
            title: "Grilled Chicken Salad",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
            readyInMinutes: 30,
            servings: 2,
            usedIngredientCount: 3,
            missedIngredientCount: 2,
            usedIngredients: [{name: 'Chicken'}, {name: 'Lettuce'}, {name: 'Tomato'}],
            missedIngredients: [{name: 'Olive Oil'}, {name: 'Lemon'}]
        }
    ];
}

// ============================================
// Start the App
// ============================================

document.addEventListener('DOMContentLoaded', init);
