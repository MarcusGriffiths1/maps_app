var PoiFilter = (function() {

  var _theMap,
      _theList,
      _poiDetails,
      _filterId,
      _filters, //if needed?

      init = function init(id, poiDetailsArray, map, list) {

        _filterId = id;
        _poiDetails = poiDetailsArray;
        _theMap = map;
        _theList = list;
        _setFilters();

        _createFilterForm();
        _addFilterEventListeners();

      },

      // Credit where credit's due: http://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
      _setFilters = function setFilters() {

        _filters = [];
        var temp = {};

        for (var i in _poiDetails) {
          if (typeof(temp[_poiDetails[i].type]) == "undefined") {
            _filters.push(_poiDetails[i].type);
          }
          temp[_poiDetails[i].type] = 0;
        }
      },

      _createFilterForm = function createFilterForm() {

        var filterFormHTML = _makeFilterFormHTML();

				document.getElementById(_filterId).innerHTML = filterFormHTML;
      },

      _makeFilterFormHTML = function makeFilterFormHTML() {

        var HTML;

        HTML = '<form action="">';

        _filters.forEach(function (item, index) {
          HTML += _makeFilterItemHTML(item);
        });

        HTML += '</form>';

        return HTML;
      },

      _makeFilterItemHTML = function makeFilterItemHTML(item) {

        var HTML = '<input type="checkbox" name="filter" value= "' + item + '" checked>' + item;

        return HTML;
      },

      _addFilterEventListeners = function addFilterEventListeners() {

        var checkboxes = document.getElementsByName('filter');

        Array.prototype.forEach.call(checkboxes, function(item) {

          item.addEventListener('change', function() {
            _theMap.filterMarkers(this.value);
            _theList.filterListItem(this.value);
          });
        });
      };

  return {
    init: init
  };
})();
