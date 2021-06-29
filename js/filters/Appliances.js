'use strict';

import Buttons from '../page/Buttons.js';
import Messages from '../page/Messages.js';
import Search from '../search/Search.js';
import Tags from '../page/Tags.js';
import Utils from '../utilities/Utils.js';

export default class Appliances {
    static appliancesExample = document.getElementById('appareilExample');

    static init(appliances) {
        Utils.clearFilters(this.appliancesExample);
        Buttons.launchButtons(document.querySelector("#appareil > button"),
            document.querySelector("#openAppareilFilter"),
            document.querySelector("#closeAppareilFilter"),
            document.querySelector("#hiddenAppareilFilter"));
        this.fillAppliances(Utils.sortByTitle(appliances));
        this.searchInput(appliances);
        return this;
    }

    // display the appliances in the appliances zone according to the recipes displayed in the 'recipes' section
    static fillAppliances(appliances) {
        appliances.forEach((appliances) => {
            let listAppliances = document.createElement('li');

            listAppliances.innerHTML = `${Utils.upperText(appliances)}`
            this.appliancesExample.appendChild(listAppliances);
            listAppliances.classList.add('list-appareil');
            listAppliances.setAttribute('data-filter', `${appliances}`);
        });
    }

    // allows to search for the appliances in the input from the appliances present in the recipes displayed
    static searchInput(appliances) {
        document.getElementById('inputAppareil').addEventListener('keyup', (key) => {
            let valueSearch = key.target.value;
            if (Utils.isValid(valueSearch)) {
                Utils.clearFilters(this.appliancesExample);
                this.fillAppliances(Search.searchInputFilters(appliances, valueSearch));
                return;
            };
            Utils.clearFilters(this.appliancesExample);
            this.fillAppliances(Utils.sortByTitle(appliances));
        });
    }

    // gives the activated class to the selected tag and searches if it is present in the recipes
    static filterByTags(recipes) {
        let appareilTag = document.getElementById('appareilTag');

        document.querySelectorAll('.list-appareil').forEach(filter => {
            filter.addEventListener('click', (event) => {
                let classValue = event.target.classList.value;

                if (-1 === classValue.indexOf('selected')) {
                    event.target.classList.add('selected');
                    Buttons.hideButtonsOnClick(document.querySelector("#appareil > button"),
                        document.querySelector("#openAppareilFilter"),
                        document.querySelector("#hiddenAppareilFilter"))
                    Tags
                        .buildTags(appareilTag, Utils.upperText(event.target.getAttribute('data-filter')))
                        .removeTagsOnClick(document.querySelector("#appareilTag > i"), event, appareilTag, recipes);
                    Messages.hideMessage();
                    this.searchAndDisplayRecipesFiltered();
                    return;
                } else {
                    Tags.resetSection(event, appareilTag, recipes);
                };
            });
        });
        return this;
    }

    static searchAndDisplayRecipesFiltered() {
        let resultFilters = Search.searchByTags();

        Messages.buildResultMessageWithResult(resultFilters.show);
        Utils.showRecipesFiltered(resultFilters.show);
        Utils.hideRecipesFiltered(resultFilters.hide);
    }
}
