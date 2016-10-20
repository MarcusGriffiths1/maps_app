/*
*  The PoiFilter object creates the DOM control for filtering and sorting the list of data.
*  This object uses the data to create the filter controls, but never stores the data.
*
*  Once the controls are initialised the only way to filter data is by publishing an event,
*  the data is never manipulated. An event is fired and data is passed along for another
*  part of the app to handle the filtering process.
*
*  Publishers:
*      filterToggled: Fired when one of the filter checkboxes is clicked.
*           Data sent: name of the filter that has been toggled.
*      sortToggled: Fired when the sort field is changed
*           Data sent: name of the sort option that has been chosen.
*/

// Import the PubSub implementation
import pubSub from './PubSub';

class PoiFilter {
  constructor(filterId, poiData) {
    this._filterId = filterId;
    this._setFilterArray(poiData);
    this._createFilterList();
    this._addFilterEventListeners();
  }

  // Loop through the given data, find it's 'type' key and add all descrete
  // values to an array, these will act as the values for the filters.
  _setFilterArray(poiData) {
    // Add the filter array to the object scope.
    this._filterArray = [];

    // Use a temporary object to store distinct values as keys
    let temp = {};

    for (var i in poiData) {
      if (typeof(temp[poiData[i].type]) == "undefined") {
        this._filterArray.push(poiData[i].type);
      }
      temp[poiData[i].type] = 0;
    }
  }

  // Makes the list of filters and displays them in the DOM element
  // given by the filterId parameter
  _createFilterList() {
    let filterFormHTML = this._makeFilterFormHTML();
		document.getElementById(this._filterId).innerHTML = filterFormHTML;
  }

  _makeFilterFormHTML() {
    let HTML = '';

    this._filterArray.forEach((item, index) => {
      HTML += this._makeFilterItemHTML(item);
    });

    return HTML;
  }

  _makeFilterItemHTML(item) {
    let iconPath = "img/amenity_icons/" + item + "_icon_small.png";

    let HTML = '<li class="filters__item">'
    HTML += '<img class="filters__icon" src="' + iconPath + '">';
    HTML += '<input type="checkbox" id="' + item + '" name="filter" value= "' + item + '" checked>';
    HTML += '<label class="filters__label" for="' + item + '">' + (item.charAt(0).toUpperCase() + item.slice(1)) + '</label>';
    HTML += '</li>';

    return HTML;
  }

  // Fired after all set up is complete, adds event listers to the filter list checkboxes
  // if one is clicked the value of that checkbox is published through the 'filterToggled'
  // event in pubSub
  _addFilterEventListeners() {
    var checkboxes = document.getElementsByName('filter');

    Array.prototype.forEach.call(checkboxes, (item) => {
      item.addEventListener('change', () => {
        pubSub.publish('filterToggled', item.value);
      });
    });
  };

}

export default PoiFilter;
