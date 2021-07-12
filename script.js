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


//PRINCIPAL SEARCH
//function sets to extract and sort all keywords
//sorting functions
let quickSort = (array, left, right) => {
    let index;
    if (array.length > 1) {
        index = partition(array, left, right); //take index from partition
        if (left<index-1) { //more elements on the left
            quickSort(array, left, index-1);
        }
        if (index<right) { //more elements on the right
            quickSort(array, index, right);
        }
    }
    return array;
}
//function to swap position
let swap = (items, leftIndex, rightIndex) => {
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}
//partition code, to make a left and right elements list
let partition = (array, left, right) => {
    let pivot = array[Math.floor((right + left) / 2)]; //middle element
    while (left <= right) {
        while (array[left].localeCompare(pivot) < 0) {
            left++;
        }
        while (array[right].localeCompare(pivot) > 0) {
            right--;
        }
        if (left <= right) {
            swap(array, left, right);
            left++;
            right--;
        }
    }
    return left;
}
//filter and extract only id, name, ingredients, and description
let createFilteredArr = (arr) => {
    let filteredArr = [];
    for (let i = 0; i<arr.length; i++) {
        let filtered = (({id, ingredients, name, description}) => ({id, ingredients, name, description}))(arr[i][1]);
        filteredArr.push(filtered);
    }
    return filteredArr;
}
let filteredArr = createFilteredArr(recipesArray);

function FilterKeyword(item) {
    this.id = item.id;
    let thisIngre = item.ingredients.map(b => b.ingredient.toLowerCase()).flat();
    let keywordString = item.name + " " + thisIngre + " " + item.description;
    let uniqueValue = [...new Set(keywordString.split(/[\s,().]+/))];
    this.keyword = quickSort(uniqueValue, 0, uniqueValue.length-1);
}

let extractKeyword = (arr) => {
    let newArr = [];
    for (let i=0; i<arr.length; i++) {
        let keyword = new FilterKeyword(arr[i]);
        newArr.push(keyword);
    }
    return newArr;
}
let filteredKeywordArr = extractKeyword(filteredArr);
console.log(filteredKeywordArr);
//take only the keywords
let allKeywords = [];
filteredKeywordArr.forEach(item => {allKeywords.push(item.keyword)});
let flatKeyword = allKeywords.flat();
let allKeywordsLowerCase = [];
flatKeyword.forEach(word => {allKeywordsLowerCase.push(word.toLowerCase())});
let searchOptionsNotSorted = [...new Set(allKeywordsLowerCase.flat())];
//sort by alphabetical order
let searchOptions = quickSort(searchOptionsNotSorted, 0, searchOptionsNotSorted.length-1);
console.log(searchOptions);

function KeywordObject(item) {
    this.keyword = item;
    let recipeIds = [];
    for (let i=0; i<filteredKeywordArr.length; i++) {
        if (filteredKeywordArr[i].keyword.indexOf(item) >= 0 ) {
            recipeIds.push(filteredKeywordArr[i].id);
        }
    }
    this.ids = recipeIds;
}

let keywordArray = (arr) => {
    let newArr = [];
    for (let i=0; i<arr.length; i++) {
        let keyword = new KeywordObject(arr[i]);
        newArr.push(keyword);
    }
    return newArr;
}

let keywordObjectArray = keywordArray(searchOptions);
console.log(keywordObjectArray);

//autocomplete function
let autocomplete = (input, arr, minLength) => {
    let currentFocus; //to catch when user input something new

    input.addEventListener("input", function(e) {
        if (input.value.length > minLength) {
            let val = this.value;
            //take out all of current autocompleted values
            closeLists();
            if (!val) { return false;}
            currentFocus = -1;
            //create div element that will contain the suggestions
            let a = create("div", {class: "autocomplete-items", id: this.id+"-autocomplete-lists"});
            //append to parent element
            this.parentNode.appendChild(a);
            ///iterate the array
            for (let i=0; i<arr.length; i++) {
                if (arr[i].substr(0, val.length).toLowerCase() == val.toLowerCase()) {
                    let b = create("p");
                    b.textContent = arr[i];
                    //when click on the value
                    b.addEventListener("click", function() {
                        //insert value
                        input.value = this.textContent;
                        launchSearch(e);
                        //close list
                        closeLists();
                    });
                    a.appendChild(b);
                }
            }
        } else {
            closeLists();
        }
    });
    //execute function on keydown
    input.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "-autocomplete-lists");
        if (x) x = x.getElementsByTagName("p");
        if (e.keyCode == 40) { //key down
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //key up
            currentFocus--;
            addActive(x)
        } else if (e.keyCode == 13) { //enter
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        } else if (e.keyCode == 27) { //escape
            closeLists();
        }
    });
    let addActive = (x) => {
        if (!x) return false;
        //remove other active class
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        //add active class
        x[currentFocus].classList.add("autocomplete-active");
    }
    let removeActive = (x) => {
        for (let i=0; i<x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    let closeLists = (element) => {
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i=0; i<x.length; i++) {
            if (element != x[i] && element != input) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function(e) {
        closeLists(e.target);
    })

}
let searchInput = document.getElementById("search-input");
//implement the function on key press
autocomplete(searchInput, searchOptions, 2);
//simple binary search, to give the first found result
let binarySearch = (array, target) => {
    let start = 0;
    let end = array.length-1;
    if (start > end) {
        return -1;
    }
    while(start <= end) {
        let middleIndex = Math.floor((start+end)/2);
        if (array[middleIndex].keyword.toLowerCase().includes(target.toLowerCase())) {
            return middleIndex;
        } else if (target.toLowerCase().localeCompare(array[middleIndex].keyword.toLowerCase()) < 0) {
            end = middleIndex - 1;
        } else if (target.toLowerCase().localeCompare(array[middleIndex].keyword.toLowerCase()) > 0) {
            start = middleIndex +1;
        } else {
            return -1;
        }
    }
}

//binary search to get the range of all fitting result
let binarySearchMultiple = (array, target) => {
    let firstMatch = binarySearch(array, target);
    let resultArr = [-1, -1];
    if (firstMatch == -1) {
        return resultArr;
    }

    let leftMost = firstMatch;
    let rightMost = firstMatch;

    if (firstMatch >= 0) {
        while (leftMost > 0 && array[leftMost-1].keyword.includes(target)) {
            leftMost--;
        }
        while (rightMost < array.length-1 && array[rightMost+1].keyword.includes(target)) {
            rightMost++;
        }
    }

    resultArr[0] = leftMost;
    resultArr[1] = rightMost;

    let allSelectedIndex = [];
    for (let i=resultArr[0]; i<=resultArr[1]; i++) {
        allSelectedIndex.push(i);
    }

    let selectedIds = [];
    allSelectedIndex.forEach(index => {
        selectedIds.push(array[index].ids);
    });

    return [...new Set(selectedIds.flat())].sort(function(a,b) {return a-b});
}

//searching function
let launchSearch = (e) => {
    let mainSection = document.getElementById("main");
    if (searchInput.value.length > 2) {
        mainSection.innerHTML = "";
        let input = e.target.value.toLowerCase();
        let selectedArr = binarySearchMultiple(keywordObjectArray, input);

        if (selectedArr.length > 0) {
            selectedArr.forEach(recipeId => {
                createCard(recipesArray[recipeId-1]);
            });
        } else {
            mainSection.innerHTML = "<p id='noresult-msg'>Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>";
        }
    } else {
        mainSection.innerHTML = "";
        recipesArray.forEach(recipe => createCard(recipe));
    }
}
searchInput.addEventListener("keyup", function(e) {launchSearch(e)});

