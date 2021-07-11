import {recipes} from './recipe-rawdata.js';

let recipesArray = Object.entries(recipes);

console.log(recipesArray);
//function to create element
const create = (elm, attributes) => {
    const element = document.createElement(elm);
    for (let key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    return element;
}

let createCard = (recipe) => {
    //image
    let image = create("div", {class: "card-img-top card-img-placeholder", alt: "card-image"});
    //title
    let title = create("h2", {class: "card-title w-50 card-content-title"});
    title.textContent = recipe[1].name;

    let timeParent = create("div", {class: "d-flex font-weight-bold"});
    timeParent.innerHTML = "<span class='far fa-clock mt-2' style='font-size:1.5rem'></span>"
        + "<p class='ml-2' style='font-size:1.5rem'>" + recipe[1].time + " min</p>"

    //grouping the header elements
    let headerParent = create("div", {class: "d-flex justify-content-between mt-3 px-3"});
    headerParent.appendChild(title);
    headerParent.appendChild(timeParent);

    //ingredients list
    let ingredients = create("div", {class: "ingredient-container"});

    let eachIngredient = recipe[1].ingredients.map(function(ingredients) {
        if (Object.prototype.hasOwnProperty.call(ingredients, "quantity") && Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
            return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span>: "+ ingredients.quantity + ingredients.unit + "</p>";
        } else if (Object.prototype.hasOwnProperty.call(ingredients, "quantity") && !Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
            return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span>: "+ ingredients.quantity + "</p>";
        } else if (!Object.prototype.hasOwnProperty.call(ingredients, "quantity") && !Object.prototype.hasOwnProperty.call(ingredients, "unit")) {
            return "<p class='mb-0'><span class='font-weight-bold ingredient'>" + ingredients.ingredient + "</span></p>";
        }
    }).join("");

    ingredients.innerHTML = eachIngredient;

    //cook method
    let method = create("p", {class: "description w-50"});
    method.textContent = recipe[1].description;

    //appliance section
    let appliances = create("p", {class: "sr-only appliance"});
    appliances.textContent = recipe[1].appliance;
    //utensils section
    let utensils = create("div", {class: "sr-only"});
    let eachUtensils = recipe[1].ustensils.map(function(utensil) {
        return "<p class='utensil'>" + utensil + "</p>";
    }).join("");
    utensils.innerHTML = eachUtensils;


    //card body
    let cardBody = create("div", {class: "card-body d-flex justify-content-between card-content"});
    //combine in card body
    cardBody.appendChild(ingredients);
    cardBody.appendChild(method);
    cardBody.appendChild(appliances);
    cardBody.appendChild(utensils);

    //card container
    let cardContainer = create("article", {class: "card recipe-card pb-3 mb-5"});

    //combine to DOM
    cardContainer.appendChild(image);
    cardContainer.appendChild(headerParent);
    cardContainer.appendChild(cardBody);

    let mainSection = document.getElementById("main");
    //put into DOM
    mainSection.appendChild(cardContainer);
}

recipesArray.forEach(recipe => createCard(recipe));
