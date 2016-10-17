import pubSub from './PubSub';

class PoiFilter {
  constructor(filterId, poiData) {
    this._filterId = filterId;

    this._setFilterArray(poiData);
    this._createFilterForm();
    this._addFilterEventListeners();
  }

  _setFilterArray(poiData) {
    this._filterArray = [];
    let temp = {};

    for (var i in poiData) {
      if (typeof(temp[poiData[i].type]) == "undefined") {
        this._filterArray.push(poiData[i].type);
      }
      temp[poiData[i].type] = 0;
    }
  }

  _createFilterForm() {
    let filterFormHTML = this._makeFilterFormHTML();

		document.getElementById(this._filterId).innerHTML = filterFormHTML;
  }

  _makeFilterFormHTML() {

    let HTML = "";

    this._filterArray.forEach((item, index) => {
      HTML += this._makeFilterItemHTML(item);
    });

    return HTML;
  }

  _makeFilterItemHTML(item) {
    let HTML = '<li class="filters__item">'
    HTML += '<input type="checkbox" id="' + item + '" name="filter" value= "' + item + '" checked>';
    HTML += '<label for="' + item + '">' + item + '</label>';
    HTML += '</li>';

    return HTML;
  }

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
