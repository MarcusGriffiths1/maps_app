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
    this._filterListDOMElement = document.getElementById(this._filterId);

    // Create an array of distinct filters
    this._filterArray = this._getDistinctValues(poiData.data, 'type');
    // Create list HTML and populate given DOM element
    this._createFilterList(this._filterArray, this._filterListDOMElement);
    this._addFilterEventListeners();
  }

  // Loops through the given data, find it's 'type' key and adds all descrete
  // values to an array, these will act as the values for the filters.
  _getDistinctValues(poiData, field) {
    // Add the filter array to the object scope.
    let filteredArray = [];

    // Use a temporary object to store distinct values as keys
    let temp = {};

    for (var i in poiData) {
      if (typeof(temp[poiData[i][field]]) == "undefined") {
        filteredArray.push(poiData[i][field]);
      }
      temp[poiData[i][field]] = 0;
    }

    return filteredArray;
  }

  // Makes the list of filters and displays them in the DOM element supplied
  _createFilterList(filterArray, wrapperElement) {
    let filterFormHTML = this._makeFilterFormHTML(filterArray);
    wrapperElement.innerHTML = filterFormHTML;
  }

  // Iterates through the array of filters and creates HTML elements for
  // each one.
  _makeFilterFormHTML(filterArray) {
    let HTML = '';

    filterArray.forEach((item, index) => {
      HTML += this._makeFilterItemHTML(item);
    });

    return HTML;
  }

  // Creates a list item for a single filter item
  // TODO: Make image dynamic, use callbacks so user can set HTML from outside?
  _makeFilterItemHTML(item) {
    let iconPath = "img/amenity_icons/" + item + "_icon_small.png";

    let HTML = '<li class="filters__item">'
    HTML += '<img class="filters__icon" src="' + iconPath + '">';
    HTML += '<input type="checkbox" id="' + item + '" name="map-filter" value= "' + item + '" checked>';
    HTML += '<label class="filters__label" for="' + item + '">' + (item.charAt(0).toUpperCase() + item.slice(1)) + '</label>';
    HTML += '</li>';

    return HTML;
  }

  // Makes the list of sorters and displays them in the DOM element supplied
  _createSorterList(sorterArray, wrapperElement) {
    let sorterListHTML = this._makeSorterHTML(sorterArray);
    wrapperElement.innerHTML = sorterListHTML;
  }

  // Makes an option HTML element for each element in the supplied array
  _makeSorterHTML(sorterArray) {
    let HTML = '';

    sorterArray.forEach((item, index) => {
      HTML += '<option value="' + item + '" >' + item + '</option>';
    });

    return HTML;
  }

  // Fired after all set up is complete, adds event listers to the filter list checkboxes
  // if one is clicked the value of that checkbox is published through the 'filterToggled'
  // event in pubSub
  _addFilterEventListeners() {
    var checkboxes = document.getElementsByName('map-filter');

    Array.prototype.forEach.call(checkboxes, (item) => {
      item.addEventListener('change', () => {
        pubSub.publish('filterToggled', item.value);
      });
    });
  };

  // Fired after all set up is complete for the sorters, add an event lister to the sorter dropdown
  // if one is clicked the value is published through the 'sorterToggled' event in pubSub
  _addSorterEventListeners(sorterElement) {
    sorterElement.addEventListener('change', (e) => {
      pubSub.publish('sortToggled', e.target[e.target.selectedIndex].value);
    });
  }

  // ---------- PUBLIC INTERFACE ----------

  // If the user wants to create a filter they can specify in the Public API
  // and this will be called
  createSorter(sorterId, sortByArray) {
    this._sorterId = sorterId;
    let sorterDOMElement = document.getElementById(this._sorterId);
    this._createSorterList(sortByArray, sorterDOMElement);
    this._addSorterEventListeners(sorterDOMElement);
  }

}

export default PoiFilter;
