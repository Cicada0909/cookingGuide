const SERVER_URL = "https://www.themealdb.com";
const categoriesPage = document.querySelector(".categories");
const categories = document.querySelector(".categories");
const dishes = document.querySelector(".dishes");
const recipe = document.querySelector(".recipe");
const headerForm = document.querySelector(".header__form");
const search = document.querySelector(".search");
const headerInput = document.querySelector(".header__input");
const searchShow = document.querySelector(".search-show");
const random = document.querySelector(".random");
const btnRandom = document.querySelector(".btn-random");
const menuBtn = document.querySelector(".menu-btn");
const headerNavigation = document.querySelector(".header-navigation");
const headerLogo = document.querySelector(".header__logo");
const btnBackWrapper = document.querySelector(".btn-back-wrapper");


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

const getItem = async (dish) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/json/v1/1/search.php?s=${dish}`);
        
        const data = await res.json();

        return data;
    } catch (error) {
            console.log(error);
        }
}

const getRandomRecipe = async (dish) => {
    try {
        const res = await fetch(`${SERVER_URL}/api/json/v1/1/random.php`);
        
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

const BackToSearching = () => {
    search.classList.remove("hide");
    searchShow.classList.add("hide");
    btnBackWrapper.innerHTML = "";
}

const insertBtnBackToMenu = () => {
    btnBackWrapper.removeEventListener("click", backToMenu);
    btnBackWrapper.innerHTML = "";

    btnBackWrapper.insertAdjacentHTML("beforeend", `
    <button class="back-btn">back</button>
    `)

    btnBackWrapper.addEventListener("click", backToMenu);
}

const insertBtnBackToSearching = () => {
    btnBackWrapper.innerHTML = "";

    btnBackWrapper.insertAdjacentHTML("beforeend", `
    <button class="back-btn">back</button>
    `)

    btnBackWrapper.addEventListener("click", BackToSearching);
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

    insertBtnBackToMenu()
}

const ShowRecipe = async (dish) => {
    categoriesPage.classList.add("hide");
    dishes.classList.add("hide");
    recipe.classList.remove("hide");

    btnBackWrapper.innerHTML = "";

    btnBackWrapper.insertAdjacentHTML("beforeend", `
        <button class="back-btn">back</button>
    `)

    const backToDishesCards = () => {
        recipe.classList.add("hide");
        dishes.classList.remove("hide");
        categoriesPage.classList.add("hide");
        btnBackWrapper.removeEventListener("click", backToDishesCards);
        
        insertBtnBackToMenu()
    }

    btnBackWrapper.removeEventListener("click", backToMenu);
    btnBackWrapper.removeEventListener("click", BackToSearching);
    btnBackWrapper.addEventListener("click", backToDishesCards);


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

const insertSearchDishes = async (items) => {
    search.innerHTML = "";

    categoriesPage.classList.add("hide");
    dishes.classList.add("hide");
    recipe.classList.add("hide");
    search.classList.remove("hide");

    search.insertAdjacentHTML("beforeend", `
        <div class="search__items">
                    
            </div>
        `)

    const searchItems = document.querySelector(".search__items");

    items.forEach((items) => {
        searchItems.insertAdjacentHTML("beforeend", `
            <div class="search__card" data-product-id=${items.idMeal}>
                <img class="search__card-img" src="${items.strMealThumb}" alt="${items.strMeal}">
                <h3 class="search__card-title">${items.strMeal}</h3>
            </div>`)
    })
}

const ShowRecipeSearching = async (dish) => {
    categoriesPage.classList.add("hide");
    dishes.classList.add("hide");
    recipe.classList.add("hide");
    search.classList.add("hide");
    searchShow.classList.remove("hide");

    searchShow.innerHTML = "";

    insertBtnBackToSearching();

    searchShow.insertAdjacentHTML("beforeend", `
        <div class="recipe__content">
                <img src="${dish.strMealThumb}" alt="${dish.strMeal}" class="recipe__img">
                <div class="recipe_details">
                    <h3 class="recipe__title">${dish.strMeal}</h3>
                    <div class="recipe__ingredients">
                        <ul class="recipe__ingredients-name-searching"></ul>
                        <ul class="recipe__ingredients-measure-searching"></ul>
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

    const recipeIngredientsNameSearching = document.querySelector(".recipe__ingredients-name-searching");
    const recipeIngredientsMeasureSearching = document.querySelector(".recipe__ingredients-measure-searching");

    let ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = dish[`strIngredient${i}`];
        const measure = dish[`strMeasure${i}`];
    
        if (ingredient && measure) {
            ingredients.push({ingredient, measure});
        }
    }

    ingredients.forEach((ingredient) => {
        recipeIngredientsNameSearching.insertAdjacentHTML("beforeend", `
            <li>${ingredient.ingredient}</li>`)
        recipeIngredientsMeasureSearching.insertAdjacentHTML("beforeend", `
            <li>${ingredient.measure}</li>`)
    })
}

const ShowRandomRecipe = async (dish) => {
    categoriesPage.classList.add("hide");
    dishes.classList.add("hide");
    recipe.classList.add("hide");
    search.classList.add("hide");
    searchShow.classList.add("hide");
    random.classList.remove("hide");

    btnBackWrapper.innerHTML = "";

    random.innerHTML = "";

    random.insertAdjacentHTML("beforeend", `
        <div class="recipe__content">
                <img src="${dish.strMealThumb}" alt="${dish.strMeal}" class="recipe__img">
                <div class="recipe_details">
                    <h3 class="recipe__title">${dish.strMeal}</h3>
                    <div class="recipe__ingredients">
                        <ul class="recipe__ingredients-name-random"></ul>
                        <ul class="recipe__ingredients-measure-random"></ul>
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

    const recipeIngredientsNameRandom = document.querySelector(".recipe__ingredients-name-random");
    const recipeIngredientsMeasureRandom = document.querySelector(".recipe__ingredients-measure-random");

    let ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = dish[`strIngredient${i}`];
        const measure = dish[`strMeasure${i}`];
    
        if (ingredient && measure) {
            ingredients.push({ingredient, measure});
        }
    }

    ingredients.forEach((ingredient) => {
        recipeIngredientsNameRandom.insertAdjacentHTML("beforeend", `
            <li>${ingredient.ingredient}</li>`)
            recipeIngredientsMeasureRandom.insertAdjacentHTML("beforeend", `
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
        
        window.scrollTo(0, 0);
        ShowRecipe(dish.meals[0]);
    }
}

const handleSelectRecipeSearching = async (e) => {
    const card = e.target.closest(".search__card");
    if (card) {
        const dishID = card.dataset.productId;
        const dish = await getRecipeByDishesID(dishID);
        
        window.scrollTo(0, 0);
        ShowRecipeSearching(dish.meals[0]);
    }
}

const handleHeaderButtonClick = async () => {

    const randomDish = await getRandomRecipe();

    ShowRandomRecipe(randomDish.meals[0])
    
}

const searchDish = async (event) => {
    event.preventDefault()
    btnBackWrapper.innerHTML = "";
    const inputValue = headerInput.value;
    if (inputValue == "") {
        return
    }
    const dishes = await getItem(inputValue);
    console.log(dishes.meals);
    insertSearchDishes(dishes.meals);
    search.insertAdjacentHTML("afterbegin", `
            <div class="search__message">
                <h3 class="search__message-text">Your search for "${inputValue}" found:</h3>
            </div>
            `)
}

const backToMenu = () => {
    categoriesPage.classList.remove("hide");
    dishes.classList.add("hide");
    recipe.classList.add("hide");
    search.classList.add("hide");
    searchShow.classList.add("hide");
    random.classList.add("hide");
}

const observeCategories = () => {
    const observer = new MutationObserver(() => {
        headerNavigation.classList.toggle("hide", !categories.classList.contains("hide"));
    });

    observer.observe(categories, { attributes: true, attributeFilter: ["class"] });
};

init()

observeCategories();

categories.addEventListener("click", handleSelectCategory);

dishes.addEventListener("click", handleSelectRecipe);

search.addEventListener("click", handleSelectRecipeSearching);

headerForm.addEventListener("submit", searchDish);

btnRandom.addEventListener("click", handleHeaderButtonClick);

menuBtn.addEventListener("click", backToMenu);

headerLogo.addEventListener("click", backToMenu);

// document.body.addEventListener("click", (event) => {
//     if (event.target.matches(".btn-random")) {
//         handleHeaderButtonClick();
//     }
// });
