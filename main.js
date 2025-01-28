const SERVER_URL = "https://www.themealdb.com";
const categoriesPage = document.querySelector(".categories");
const categories = document.querySelector(".categories");
const dishes = document.querySelector(".dishes");
const recipe = document.querySelector(".recipe");


const getCategories = async () => {
    try {
        const res = await fetch(`${SERVER_URL}/api/json/v1/1/categories.php`);
        
        const data = await res.json();

        return data.categories.slice(0, -2);
        } catch (error) {
            console.log(error);
        }
}

const getDishesByCategoryName = async (categoryName) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/json/v1/1/filter.php?c=${categoryName}`);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

const getRecipeByDishesID = async (dishID) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/json/v1/1/lookup.php?i=${dishID}`);
        
        const data = await res.json();

        return data;
        } catch (error) {
            console.log(error);
        }
}

const init = async () => {
    const categories = await getCategories();
    
    categories.forEach((category) => {
        categoriesPage.insertAdjacentHTML("beforeend", `
            <div class="categories__card" data-category=${category.strCategory}>
                <img class="categories__card-img" src="${category.strCategoryThumb}" alt="${category.strCategory}">
                <h3 class="categories__card-title">${category.strCategory}</h3>
            </div>`)
    })
}

const insertDishesCards = async (meals) => {
    categoriesPage.classList.add("hide");
    dishes.classList.remove("hide");

    meals.forEach((meals) => {
        dishes.insertAdjacentHTML("beforeend", `
            <div class="dishes__card" data-product-id=${meals.idMeal}>
                <img class="dishes__card-img" src="${meals.strMealThumb}" alt="${meals.strMeal}">
                <h3 class="dishes__card-title">${meals.strMeal}</h3>
            </div>`)
    })
}

const ShowRecipe = async (dish) => {
    categoriesPage.classList.add("hide");
    dishes.classList.add("hide");
    recipe.classList.remove("hide");

    recipe.insertAdjacentHTML("beforeend", `
        <div class="recipe__content">
                <img src="${dish.strMealThumb}" alt="${dish.strMeal}" class="recipe__img">
                <div class="recipe_details">
                    <h3 class="recipe__title">${dish.strMeal}</h3>
                    <div class="recipe__ingredients">
                        <ul class="recipe__ingredients-name"></ul>
                        <ul class="recipe__ingredients-measure"></ul>
                    </div>
                </div>
            </div>
            <div class="recipe__instructions">
                <h3 class="recipe__instructions-title">Instructions</h3>
                <p class="recipe__instructions-text">${dish.strInstructions}</p>
            </div>
            <div class="recipe__video">
                <iframe class ="recipe__youtube" src="https://www.youtube.com/embed/${dish.strYoutube.split('v=')[1]}" frameborder="0"></iframe>
            </div>
    `);

    const recipeIngredientsName = document.querySelector(".recipe__ingredients-name");
    const recipeIngredientsMeasure = document.querySelector(".recipe__ingredients-measure");

    let ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = dish[`strIngredient${i}`];
        const measure = dish[`strMeasure${i}`];
    
        if (ingredient && measure) {
            ingredients.push({ingredient, measure});
        }
    }

    ingredients.forEach((ingredient) => {
        recipeIngredientsName.insertAdjacentHTML("beforeend", `
            <li>${ingredient.ingredient}</li>`)
        recipeIngredientsMeasure.insertAdjacentHTML("beforeend", `
            <li>${ingredient.measure}</li>`)
    })
}



const handleSelectCategory = async (e) => {
    const card = e.target.closest(".categories__card");
    if (card) {
        const categoryName = card.dataset.category;
        const dishes = await getDishesByCategoryName(categoryName);
        console.log(dishes.meals);
        
        insertDishesCards(dishes.meals);
    }
}

const handleSelectRecipe = async (e) => {
    const card = e.target.closest(".dishes__card");
    if (card) {
        const dishID = card.dataset.productId;
        const dish = await getRecipeByDishesID(dishID);
        console.log(dish);
        
        ShowRecipe(dish.meals[0]);
    }
}


init()
categories.addEventListener("click", handleSelectCategory);
dishes.addEventListener("click", handleSelectRecipe);
