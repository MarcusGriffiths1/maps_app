(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  This is the central hub of the application. When a user instantiates this class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  the supplied data is fed into a data store object and a new map is defined.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  Any custom options are then processed on the map and the data.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  Public methods are provided to create a list, filter and sort component for
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  more powerful interactivity.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _PoiFilter = require('./PoiFilter');

var _PoiFilter2 = _interopRequireDefault(_PoiFilter);

var _PoiList = require('./PoiList');

var _PoiList2 = _interopRequireDefault(_PoiList);

var _PoiMap = require('./PoiMap');

var _PoiMap2 = _interopRequireDefault(_PoiMap);

var _PoiData = require('./PoiData');

var _PoiData2 = _interopRequireDefault(_PoiData);

var _PubSub = require('./PubSub');

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapsApp = function () {
	function MapsApp(mapId, center, poiDetailsArray, options) {
		_classCallCheck(this, MapsApp);

		// Setup the data and the map
		this._center = center;
		this._theData = new _PoiData2.default(poiDetailsArray);
		this._theMap = new _PoiMap2.default(mapId, this._center, this._theData.getPoiData());

		// Setup any optional extras on the data and the map
		this._options = options;

		if (this._options.infoWindow === true) {
			this._theMap.initialiseInfoWindow();
			this._theData.addMarkerClickEvents();
		}

		if (this._options.customMarkers) {
			this._theData.addCustomMarkers(this._options.customMarkers);
		}

		if (this._options.showDistance) {
			this._theData.addDistances(center);
		}
	}

	// --------------- PUBLIC INTERFACE ----------------------

	// Populates a specified DOM element with data from the data store
	// and creates interactivity with the map through pubSub.


	_createClass(MapsApp, [{
		key: 'createList',
		value: function createList(listId) {
			this._theList = new _PoiList2.default(listId, this._theData.getPoiData());
		}

		// Populates a specified DOM element with a list of clickable filters
		// based on the data in the data store.

	}, {
		key: 'createFilter',
		value: function createFilter(filterId, sortId) {
			this._theFilter = new _PoiFilter2.default(filterId, this._theData.getPoiData());
		}

		// SorterId should point towards an empty select element
		// Provides ability to sort by any specified field of the data

	}, {
		key: 'createSorter',
		value: function createSorter(sorterId) {
			this._theFilter.createSorter(sorterId, this._options.sortBy);
		}
	}]);

	return MapsApp;
}();

exports.default = MapsApp;

},{"./PoiData":2,"./PoiFilter":3,"./PoiList":4,"./PoiMap":5,"./PubSub":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // TODO: Apply pure functions where possible so code is easy to navigate and reason about

var _PubSub = require('./PubSub');

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiData = function () {

	// Takes in data with specific format
	function PoiData(poiData) {
		_classCallCheck(this, PoiData);

		this._poiData = this._formatData(poiData);
		this._filterList = [];

		// This property should only ever be a single value
		this._sortBy = 'type';
		this._subscribers();
	}

	// Adds google maps markers and unique keys to each poi in the data


	_createClass(PoiData, [{
		key: '_formatData',
		value: function _formatData(poiData) {
			var _this = this;

			poiData.forEach(function (item, index) {
				item.marker = _this._createMarker(item.coords, null);
				item.key = index;
			});
			return poiData;
		}

		// Creates and returns a Google maps marker

	}, {
		key: '_createMarker',
		value: function _createMarker(position, map) {
			return new google.maps.Marker({
				position: position,
				map: map
			});
		}

		// Takes all the markers in the data and set's their map property to null

	}, {
		key: '_resetMarkers',
		value: function _resetMarkers(poiData) {
			poiData.forEach(function (item, index) {
				item.marker.setMap(null);
			});
		}

		// Utility Function: Finds the index of an item in array

	}, {
		key: '_indexOf',
		value: function _indexOf(item, array) {
			var i = 0;
			while (i < array.length) {
				if (array[i] === item) {
					return i;
				}
				i++;
			}
			return -1;
		}

		// Takes a string and an array, if the string is in the array the index
		// of that string is sent back. Otherwise it is added to the array and
		// the array is returned.
		// NOTE: Slices array so original is not mutated

	}, {
		key: '_toggleFilter',
		value: function _toggleFilter(filter, array) {
			var filterIndex = this._indexOf(filter, array);
			var filteredArray = array.slice(0);

			if (filterIndex != -1) {
				filteredArray.splice(filterIndex, 1);
			} else {
				filteredArray.push(filter);
			}

			return filteredArray;
		}

		// Takes an array of poiData, a parameter to filter by and an array of filters to
		// iterate though. If the filterBy parameter in any item of the data matches with any
		// of the filters in the filter array, that item is removed from the list.
		// The filtered data is returned.

	}, {
		key: '_filterData',
		value: function _filterData(data, filterBy, filterArray) {
			if (!filterArray.length) {
				return data;
			}

			var filteredData = data.filter(function (item) {
				var isNotFiltered = true;

				for (var i = 0; i < filterArray.length; i++) {
					if (filterArray[i] === item[filterBy]) {
						isNotFiltered = false;
					}
				}

				return isNotFiltered;
			});

			return filteredData;
		}

		// Adds distance in km from a single point to every poi in the data.
		// Function needs to have side effects as it performs an async call to Google Distance Matrix
		// TODO: Google maps only allows 25 requests at a time, fix this!
		// TODO: Add miles and km functionality (maybe give the distance in meters and work it out in the HTML template)

	}, {
		key: '_addDistances',
		value: function _addDistances(markerPositions, currentPos, array) {
			var _this2 = this;

			var fromDest = new google.maps.LatLng(currentPos);
			var dmService = new google.maps.DistanceMatrixService();
			var distance = void 0;

			dmService.getDistanceMatrix({
				origins: [fromDest],
				destinations: markerPositions,
				travelMode: 'WALKING'
			}, function (response, status) {
				response.rows[0].elements.forEach(function (element, index) {
					var distanceInMiles = (element.distance.value / 1000).toFixed(1);
					array[index].distance = distanceInMiles;
				});

				_PubSub2.default.publish('dataUpdated', _this2.getPoiData());
			});
		}

		// Takes the poi data and the field to sort by, returns a new array sorted by that field.

	}, {
		key: '_sortData',
		value: function _sortData(poiData, sortBy) {
			// No point iterating if there is nothing to sort by
			if (typeof sortBy == 'undefined') {
				return poiData;
			}

			// sort() sorts the array in place. Make sure slice is called on array
			// so as not to mutate the original. If the array is not copied it can
			// cause havoc with async tasks later, such as adding distances.
			var sortedData = poiData.slice(0).sort(function (a, b) {
				if (a[sortBy] < b[sortBy]) {
					return -1;
				}
				if (a[sortBy] > b[sortBy]) {
					return 1;
				}
				return 0;
			});

			return sortedData;
		}

		// Sets the icon on a map marker, depending on the parameters passed with it.
		// NOTE:Icons will be changed within event listeners when the zoom option is applied,
		// which causes problems when feeding parameters to the function (it gets called immediately).
		// This function is partially applied so needs to be .call()-ed when used outside of an event listener.

	}, {
		key: '_makeIcon',
		value: function _makeIcon(marker, type, zoom) {
			var _this3 = this;

			var zIndex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
			var anchor = arguments[4];

			return function () {
				var iconPath = _this3._customMarkersSettings.path;

				// If a large version of the icon has been supplied this can be used for things like hover events
				var iconImg = zoom ? _this3._customMarkersSettings.zoom : _this3._customMarkersSettings.icon;

				var icon = {
					url: iconPath + type + iconImg + '.png',
					origin: new google.maps.Point(0, 0),
					anchor: anchor
				};

				marker.setIcon(icon);
				marker.setZIndex(zIndex);
			};
		}

		// This function is called if the user wants to create custom markers for the maps
		// NOTE: Adds listeners to the markers, so not a pure function

	}, {
		key: '_createCustomMarkers',
		value: function _createCustomMarkers(poiData, settings) {
			var _this4 = this;

			poiData.forEach(function (poi, index) {
				var type = poi.type;
				var marker = poi.marker;

				// Set standard icons
				_this4._makeIcon(marker, type, false).call();

				if (settings.zoom) {
					marker.addListener('mouseover', _this4._makeIcon(marker, type, true, 100, new google.maps.Point(14, 20)));
					marker.addListener('mouseout', _this4._makeIcon(marker, type, false));
				}
			});
		}

		// Adds subscribers to hook into events that are called outside of this object's scope.

	}, {
		key: '_addCustomMarkerSubscribers',
		value: function _addCustomMarkerSubscribers(settings) {
			var _this5 = this;

			// Only ever called if the ability to zoom icons is enabled
			if (settings.zoom) {
				_PubSub2.default.subscribe('listItemMouseOver', function (topic, poi) {
					var type = poi.type;
					var marker = poi.marker;
					// Use larger version of the icons
					_this5._makeIcon(marker, type, true, 100, new google.maps.Point(14, 20)).call();
				});

				_PubSub2.default.subscribe('listItemMouseOut', function (topic, poi) {
					var type = poi.type;
					var marker = poi.marker;
					_this5._makeIcon(marker, type, false).call();
				});
			}
		}

		// Adds subscribers to hook into events that are called outside of this object's scope.

	}, {
		key: '_subscribers',
		value: function _subscribers() {
			var _this6 = this;

			_PubSub2.default.subscribe('filterToggled', function (topic, value) {
				_this6._filterList = _this6._toggleFilter(value, _this6._filterList);
				_PubSub2.default.publish('dataUpdated', _this6.getPoiData(true));
			});

			_PubSub2.default.subscribe('sortToggled', function (topic, value) {
				_this6._sortBy = value;
				_PubSub2.default.publish('dataUpdated', _this6.getPoiData(false));
			});
		}

		// ---------- PUBLIC INTERFACE ----------

		// Any time data is retrieved from this object it should be called through
		// this function, no exceptions!

	}, {
		key: 'getPoiData',
		value: function getPoiData(resetMarkers) {
			if (resetMarkers === true) this._resetMarkers(this._poiData);
			var filteredData = this._filterData(this._poiData, "type", this._filterList);
			var sortedData = this._sortData(filteredData, this._sortBy);

			var data = {
				data: sortedData,
				sortedBy: this._sortBy
			};

			return data;
		}

		// This is functionality that is added later if the user wants to include
		// an InfoWindow which opens when a marker is clicked.

	}, {
		key: 'addMarkerClickEvents',
		value: function addMarkerClickEvents() {
			this._poiData.forEach(function (poi, index) {
				poi.marker.addListener('click', function () {
					// Publish a marker click event in case anything is listening to this
					// TODO: Add list events when marker clicked
					_PubSub2.default.publish('poiClicked', poi);
				});
			});
		}

		// This is functionality that is added later if the user wants to include
		// custom markers and zoom effects when they are hovered over

	}, {
		key: 'addCustomMarkers',
		value: function addCustomMarkers(options) {
			this._customMarkersSettings = options;
			this._createCustomMarkers(this._poiData, this._customMarkersSettings);
			this._addCustomMarkerSubscribers(this._customMarkersSettings);
		}

		// If the showDistance flag is true this function is fired

	}, {
		key: 'addDistances',
		value: function addDistances(center) {
			var markerPositions = this._poiData.map(function (poi, index) {
				return poi.marker.getPosition();
			});
			this._addDistances(markerPositions, center, this._poiData);
		}
	}]);

	return PoiData;
}();

exports.default = PoiData;

},{"./PubSub":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
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


var _PubSub = require('./PubSub');

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiFilter = function () {
  function PoiFilter(filterId, poiData) {
    _classCallCheck(this, PoiFilter);

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


  _createClass(PoiFilter, [{
    key: '_getDistinctValues',
    value: function _getDistinctValues(poiData, field) {
      // Add the filter array to the object scope.
      var filteredArray = [];

      // Use a temporary object to store distinct values as keys
      var temp = {};

      for (var i in poiData) {
        if (typeof temp[poiData[i][field]] == "undefined") {
          filteredArray.push(poiData[i][field]);
        }
        temp[poiData[i][field]] = 0;
      }

      return filteredArray;
    }

    // Makes the list of filters and displays them in the DOM element supplied

  }, {
    key: '_createFilterList',
    value: function _createFilterList(filterArray, wrapperElement) {
      var filterFormHTML = this._makeFilterFormHTML(filterArray);
      wrapperElement.innerHTML = filterFormHTML;
    }

    // Iterates through the array of filters and creates HTML elements for
    // each one.

  }, {
    key: '_makeFilterFormHTML',
    value: function _makeFilterFormHTML(filterArray) {
      var _this = this;

      var HTML = '';

      filterArray.forEach(function (item, index) {
        HTML += _this._makeFilterItemHTML(item);
      });

      return HTML;
    }

    // Creates a list item for a single filter item
    // TODO: Make image dynamic, use callbacks so user can set HTML from outside?

  }, {
    key: '_makeFilterItemHTML',
    value: function _makeFilterItemHTML(item) {
      var iconPath = "img/amenity_icons/" + item + "_icon_small.png";

      var HTML = '<li class="filters__item">';
      HTML += '<img class="filters__icon" src="' + iconPath + '">';
      HTML += '<input type="checkbox" id="' + item + '" name="map-filter" value= "' + item + '" checked>';
      HTML += '<label class="filters__label" for="' + item + '">' + (item.charAt(0).toUpperCase() + item.slice(1)) + '</label>';
      HTML += '</li>';

      return HTML;
    }

    // Makes the list of sorters and displays them in the DOM element supplied

  }, {
    key: '_createSorterList',
    value: function _createSorterList(sorterArray, wrapperElement) {
      var sorterListHTML = this._makeSorterHTML(sorterArray);
      wrapperElement.innerHTML = sorterListHTML;
    }

    // Makes an option HTML element for each element in the supplied array

  }, {
    key: '_makeSorterHTML',
    value: function _makeSorterHTML(sorterArray) {
      var HTML = '';

      sorterArray.forEach(function (item, index) {
        HTML += '<option value="' + item + '" >' + item + '</option>';
      });

      return HTML;
    }

    // Fired after all set up is complete, adds event listers to the filter list checkboxes
    // if one is clicked the value of that checkbox is published through the 'filterToggled'
    // event in pubSub

  }, {
    key: '_addFilterEventListeners',
    value: function _addFilterEventListeners() {
      var checkboxes = document.getElementsByName('map-filter');

      Array.prototype.forEach.call(checkboxes, function (item) {
        item.addEventListener('change', function () {
          _PubSub2.default.publish('filterToggled', item.value);
        });
      });
    }
  }, {
    key: '_addSorterEventListeners',


    // Fired after all set up is complete for the sorters, add an event lister to the sorter dropdown
    // if one is clicked the value is published through the 'sorterToggled' event in pubSub
    value: function _addSorterEventListeners(sorterElement) {
      sorterElement.addEventListener('change', function (e) {
        _PubSub2.default.publish('sortToggled', e.target[e.target.selectedIndex].value);
      });
    }

    // ---------- PUBLIC INTERFACE ----------

    // If the user wants to create a filter they can specify in the Public API
    // and this will be called

  }, {
    key: 'createSorter',
    value: function createSorter(sorterId, sortByArray) {
      this._sorterId = sorterId;
      var sorterDOMElement = document.getElementById(this._sorterId);
      this._createSorterList(sortByArray, sorterDOMElement);
      this._addSorterEventListeners(sorterDOMElement);
    }
  }]);

  return PoiFilter;
}();

exports.default = PoiFilter;

},{"./PubSub":6}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  The PoiList object creates the DOM list of pois and populates them with the data provided.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  The data is passed in to populate the DOM elements but is never manipulated here. When instantiated
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  the object subscribes to an event that fires a re-render whenever the data is manipulated.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  Publishers:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *     listItemMouseOver:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	listItemMouseOut:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	markerClicked:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *  Subscribers:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	poiClicked:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     *	dataUpdated:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     */

var _PubSub = require("./PubSub");

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiList = function () {
	function PoiList(listId, poiData) {
		_classCallCheck(this, PoiList);

		this._listId = listId;

		// Subscriptions to pubSub added before the update due to
		// async events in data object. Need to update the list as
		// soon as those events happen.
		this._subscriptions();

		this._updatePoiList(poiData);
	}

	_createClass(PoiList, [{
		key: "_updatePoiList",
		value: function _updatePoiList(poiData) {
			document.getElementById(this._listId).innerHTML = "";
			var listHTML = this._createListHTML(poiData);
			document.getElementById(this._listId).innerHTML = listHTML;

			this._addListEventListeners(poiData);
		}
	}, {
		key: "_createListHTML",
		value: function _createListHTML(poiData) {
			var HTML = void 0;

			if (poiData.sortedBy === "type") {
				HTML = this._makeTitledListHTML(poiData);
			} else {
				HTML = this._makeListHTML(poiData);
			}

			return HTML;
		}
	}, {
		key: "_makeTitledListHTML",
		value: function _makeTitledListHTML(poiData) {
			var _this = this;

			var titleData = this._makeDistinctArray(poiData.data);
			var HTML = '';

			titleData.forEach(function (title, index) {
				HTML += '<li><ul>';
				HTML += '<h3 class="pois__title">' + title + '</h3>';
				poiData.data.forEach(function (poi, index) {
					if (poi.type === title) {
						HTML += _this._makeListItemHTML(poi);
					}
				});
			});

			return HTML;
		}
	}, {
		key: "_makeListHTML",
		value: function _makeListHTML(poiData) {
			var _this2 = this;

			var HTML = '';
			console.log(poiData);
			poiData.data.forEach(function (poiDetail, index) {
				HTML += _this2._makeListItemHTML(poiDetail);
			});

			return HTML;
		}
	}, {
		key: "_makeListItemHTML",
		value: function _makeListItemHTML(poiDetail) {
			//TODO: make it dynamic!
			var iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png"; //dynamic
			var title = poiDetail.name;
			var rating = 4;

			var HTML = '<li class="poi" data-key="' + poiDetail.key + '">';
			HTML += '<img class="poi__icon" src="' + iconPath + '">';
			HTML += '<h4 class="poi__title">' + title + '</h4>';

			if (typeof poiDetail.distance != 'undefined') {
				HTML += '<span class="poi__distance">' + poiDetail.distance + 'km from you</span>';
			}

			HTML += '<span class="poi__rating">Rating: <span>' + rating + '</span></span>';
			HTML += '</li>';

			return HTML;
		}
	}, {
		key: "_addListEventListeners",
		value: function _addListEventListeners(poiData) {
			//TODO: refactor

			// Must obtain lis by class name in case the lists are nested
			var domList = document.getElementById(this._listId).getElementsByClassName('poi');

			[].forEach.call(domList, function (item, index) {

				var key = item.getAttribute('data-key');
				var poi = void 0;

				for (var i = 0; i < poiData.data.length; i++) {
					if (poiData.data[i].key == key.toString()) {
						poi = poiData.data[i];
					}
				}

				item.addEventListener('mouseover', function () {
					_PubSub2.default.publish('listItemMouseOver', poi);
				});

				item.addEventListener('mouseleave', function () {
					_PubSub2.default.publish('listItemMouseOut', poi);
				});

				item.addEventListener('click', function () {
					_PubSub2.default.publish('poiClicked', poi);
				});
				// }
			});
		}
	}, {
		key: "_makeDistinctArray",
		value: function _makeDistinctArray(poiData) {
			// Add the filter array to the object scope.
			var distinctArray = [];

			// Use a temporary object to store distinct values as keys
			var temp = {};

			for (var i in poiData) {
				if (typeof temp[poiData[i].type] == "undefined") {
					distinctArray.push(poiData[i].type);
				}
				temp[poiData[i].type] = 0;
			}

			return distinctArray;
		}

		// --------------- PUBSUB INTERFACE ----------------------
		// Contains all pubSub subscriptions

	}, {
		key: "_subscriptions",
		value: function _subscriptions() {
			var _this3 = this;

			_PubSub2.default.subscribe('poiClicked', function (topic, poi) {
				// add a little highlight animation?
			});

			_PubSub2.default.subscribe('dataUpdated', function (topic, newData) {
				_this3._updatePoiList(newData);
			});
		}
	}]);

	return PoiList;
}();

exports.default = PoiList;

},{"./PubSub":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PubSub = require("./PubSub");

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiMap = function () {
	function PoiMap(id, center, poiData) {
		_classCallCheck(this, PoiMap);

		if (this._validateMapData(id, center)) {
			// Create the map and provide reference to said map
			// TODO: Do the id and center really need storing?
			this._mapId = id;
			this._mainLocation = center;
			this._theMap = this._createMap();
			// Create central marker and provide reference
			this._mainMarker = this._createMarker(this._mainLocation, this._theMap);

			// Initialise markers based on data passed
			// data is not stored as it is updated by a PoiData object
			this.updatePoiMarkers(poiData);
			this._subscriptions();
		}
	}

	// Creates and returns a new Google map.
	// Places the map inside the DOM element with the provided ID


	_createClass(PoiMap, [{
		key: "_createMap",
		value: function _createMap() {
			var mapDiv = document.getElementById(this._mapId);

			var map = new google.maps.Map(mapDiv, {
				center: this._mainLocation,
				scrollwheel: false,
				zoom: 15,
				styles: [{ "featureType": "administrative", "elementType": "labels.text.fill", "stylers": [{ "color": "#444444" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "color": "#f2f2f2" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "poi.business", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 45 }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "water", "elementType": "all", "stylers": [{ "color": "#b4d4e1" }, { "visibility": "on" }] }]
			});

			return map;
		}
	}, {
		key: "_createMarker",
		value: function _createMarker(position, map) {
			return new google.maps.Marker({
				position: position,
				map: map
			});
		}
	}, {
		key: "_validateMapData",
		value: function _validateMapData(id, center) {
			if (id) {
				if (typeof id !== 'string') {
					console.error('Error: Map ID must be a string');
					return false;
				}
				if (!document.getElementById(id)) {
					console.error('Error: Map ID must be part of the DOM!');
					return false;
				}
			} else {
				console.error('Error: No Map ID present');
				return false;
			}

			if (center) {
				if (center.lat && center.lng) {
					if (typeof center.lat !== 'number' || typeof center.lng !== 'number') {
						console.error('Error: Lattitude and longitude must be numbers');
						return false;
					}
				} else {
					console.error('Error: Please provide central location lattitude and longitude');
					return false;
				}
			} else {
				console.error('Error: No central location provided');
				return false;
			}

			return true;
		}
	}, {
		key: "_setBounds",
		value: function _setBounds(poiData) {
			this._bounds = new google.maps.LatLngBounds();

			this._bounds.extend(this._mainMarker.getPosition());
			for (var i = 0; i < poiData.length; i++) {
				this._bounds.extend(poiData[i].marker.getPosition());
			}

			this._fitBounds();
		}

		// Initiates the bounds of the markers in an array

	}, {
		key: "_fitBounds",
		value: function _fitBounds() {
			this._theMap.fitBounds(this._bounds);
		}
	}, {
		key: "_createInfoWindow",
		value: function _createInfoWindow() {
			this._infoWindow = new google.maps.InfoWindow({
				maxWidth: 400
			});
		}
	}, {
		key: "_onDestroyInfoWindow",
		value: function _onDestroyInfoWindow() {
			var _this = this;

			google.maps.event.addListener(this._infoWindow, 'closeclick', function () {
				_this._fitBounds();
			});
		}

		// Applys the map's infoWindow to the marker of the point of interest given

	}, {
		key: "_setInfoWindow",
		value: function _setInfoWindow(poi) {
			var contentString = this._composeInfoWindowString(poi);

			this._infoWindow.setContent(contentString);
			this._infoWindow.open(this._theMap, poi.marker);
			this._theMap.panTo(poi.marker.getPosition());
		}
	}, {
		key: "_composeInfoWindowString",
		value: function _composeInfoWindowString(poi) {
			var HTMLString;
			HTMLString = '<div id="maps-window">';
			HTMLString += '<h3>' + poi.name + '</h3>';
			HTMLString += '<a target="_blank" href="' + poi.website_url + '">Go to website</a>';
			HTMLString += '<p>' + poi.description + '</p>';
			HTMLString += '</div>';

			return HTMLString;
		}

		// --------------- PUBSUB INTERFACE ----------------------
		// Contains all pubSub subscriptions

	}, {
		key: "_subscriptions",
		value: function _subscriptions() {
			var _this2 = this;

			_PubSub2.default.subscribe('poiClicked', function (topic, poi) {
				_this2._setInfoWindow(poi);
			});

			_PubSub2.default.subscribe('dataUpdated', function (topic, newData) {
				_this2.updatePoiMarkers(newData);
			});

			_PubSub2.default.subscribe('filterToggled', function (topic, value) {
				_this2._infoWindow.close();
			});
		}

		// --------------- PUBLIC INTERFACE ----------------------

		// Update interface called when subscribed to a subject

	}, {
		key: "updatePoiMarkers",
		value: function updatePoiMarkers(poiData) {
			var _this3 = this;

			var pois = poiData.data;

			pois.forEach(function (item, index) {
				item.marker.setMap(_this3._theMap);
			});

			this._setBounds(pois);
		}
	}, {
		key: "initialiseInfoWindow",
		value: function initialiseInfoWindow() {
			this._createInfoWindow();
			this._onDestroyInfoWindow();
		}
	}]);

	return PoiMap;
}();

exports.default = PoiMap;

},{"./PubSub":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// This class is a very simple Publish/Subscribe implementation.
// Acts as a mediator between the various modules of an application
// Proudly borrowed from Addy Osmani's minimalist implemenation "pubsubz"
// and simply updated with ES6 syntax.
// Original code: https://github.com/addyosmani/pubsubz

var PubSub = function () {
  function PubSub() {
    _classCallCheck(this, PubSub);

    this.topics = [];
    this.subscriberUid = -1;
  }

  // Broadcasts a topic to any subscribers
  // passes any neccessary data for the subscriber to handle
  // as needed.


  _createClass(PubSub, [{
    key: "publish",
    value: function publish(topic, args) {
      // Why would you publish a topic that doesn't exist?
      // Make sure it's there first
      if (!this.topics[topic]) {
        return false;
      }

      var subscribers = this.topics[topic];
      var subscriberCount = subscribers ? subscribers.length : 0;

      // Fire a given function on each subscriber
      while (subscriberCount--) {
        subscribers[subscriberCount].func(topic, args);
      }

      return this;
    }

    // Allows functionality to be built into code based on the topic
    // broadcasted. When a topic is published the function passed in as a
    // parameter will be fired.

  }, {
    key: "subscribe",
    value: function subscribe(topic, func) {
      if (!this.topics[topic]) {
        this.topics[topic] = [];
      }
      // Add the subscriber to the list of topics with a unique token
      var token = (++this.subscriberUid).toString();

      this.topics[topic].push({
        token: token,
        func: func
      });

      // Return the unique token in case the subscriber wants to
      // unsubscribe from the topic.
      return token;
    }

    // If a subscriber needs to unsubscribe it can pass in it's unique
    // token as a parameter.

  }, {
    key: "unsubscribe",
    value: function unsubscribe(token) {
      for (var m in this.topics) {
        if (this.topics[m]) {
          for (var i = 0, j = this.topics[m].length; i < j; i++) {
            if (this.topics[m][i].token === token) {
              this.topics[m].splice(i, 1);
              return token;
            }
          }
        }
      }
      return this;
    }
  }]);

  return PubSub;
}();

// Instantiate the module so the same instance is shared accross the
// application when imported.


var pubSub = new PubSub();

exports.default = pubSub;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var places = [{
	"name": "Cabot Circus",
	"type": "shopping",
	"description": "Bristol&apos;s Cabot Circus offers the ultimate shopping experience, bringing together a host of high-street and designer brands and confirming the city&apos;s status as the South West&apos;s style capital. With more than 120 stores stocking the latest trends, Cabot Circus has something for every taste, including a four-storey flagship House of Fraser offering clothing, beauty and homewares.",
	"website_url": "https://www.cabotcircus.com/",
	"coords": {
		"lat": 51.458481,
		"lng": -2.5852458
	}
}, {
	"name": "Bristol Bierkeller",
	"type": "venue",
	"description": "Do you like alternative music? Then welcome home! Student nights are held twice weekly with all the best alternative music.",
	"website_url": "http://www.bristolbierkeller.co.uk/",
	"coords": {
		"lat": 51.4559925,
		"lng": -2.5925146
	}
}, {
	"name": "Lakota",
	"type": "venue",
	"description": "Not for the faint hearted, or if you want to get any coursework done! Lakota is frequently open until the early hours and often offers after parties for local sound system festivals. They offer the bsolute best of Bristol&apos;s local music scene",
	"website_url": "http://www.lakota.co.uk/",
	"coords": {
		"lat": 51.4616571,
		"lng": -2.5895789
	}
}, {
	"name": "The Canteen",
	"type": "bar",
	"description": "One of the more chilled out venues on Stokes Croft, they serve excellent food during the day. In the evenings it is transformed into a lively bar with live performances and open mic nights.",
	"website_url": "http://www.lakota.co.uk/",
	"coords": {
		"lat": 51.4628076,
		"lng": -2.5896245
	}
}, {
	"name": "King Street",
	"type": "bar",
	"description": "We can't just reccommend a few bars along King Street, go and try out a few! Craft beers and local ciders are itching to be tasted, a sure start to an awesome night.",
	"website_url": "no website",
	"coords": {
		"lat": 51.4516792,
		"lng": -2.5948164
	}
}, {
	"name": "Za Za Bazaar",
	"type": "restaurant",
	"description": "Ever wanted an all you can eat buffet encompassing foods from across the globe? Well, you've found it. Go mental, you only get 45 minutes to cram as much as you can in!",
	"website_url": "http://www.zazabazaar.com/",
	"coords": {
		"lat": 51.4503343,
		"lng": -2.5984718
	}
}, {
	"name": "Raj Bari",
	"type": "restaurant",
	"description": "Situated amidst the picture perfect harbourside area of Hotwells in Bristol, the extremely popular Raj Bari Indian Restaurant was established in 1991 and can actually trace its humble beginnings back to London in the 1950s.",
	"website_url": "http://www.rajbaribristol.co.uk/",
	"coords": {
		"lat": 51.449712,
		"lng": -2.6158884
	}
}, {
	"name": "Siam Harbourside Thai Restaurant",
	"type": "restaurant",
	"description": "Here at the Siam Harbourside licensed restaurant we serve delicious authentic Thai food and drink and want to ensure that you capture all the flavours that Thai cuisine has to offer. Thai cuisine is distinctive thanks to the use of herbs and spices that will really tantalise your taste buds, taking you on a journey of culinary adventure.",
	"website_url": "http://www.siam-harbourside.co.uk/",
	"coords": {
		"lat": 51.449361,
		"lng": -2.613297
	}
}, {
	"name": "The Blue Lagoon",
	"type": "bar",
	"description": "We’re a smart Cafe Bar & Live Music venue on the vibrant Gloucester Road and our focus is on excellent food, drink and music but above all the service and value for money we provide. The Blue Lagoon is a family owned business which we believe reflects in the way we operate – providing a family friendly atmosphere and specially designed children’s menus and high chairs for your convenience.",
	"website_url": "http://www.thebluelagooncafebar.com/",
	"coords": {
		"lat": 51.4714083,
		"lng": -2.5929919
	}
}, {
	"name": "The Attic Bar",
	"type": "venue",
	"description": "The Attic Bar is one of Bristol's long-standing and most popular venues in the heart of the cultural hub that is Stokes Croft, fully equipped with an excellent Opus soundsystem and stage lighting - you can find quality gigs of all styles of music every weekend! We host local and internationally renowned Bands and DJs throughout the year and it's also a perfect venue for private parties and events.",
	"website_url": "http://www.fmbristol.co.uk/attic-bar",
	"coords": {
		"lat": 51.4602141,
		"lng": -2.5904667
	}
}, {
	"name": "Victoria Park",
	"type": "park",
	"description": "Large Victorian park with children’s play area and grassy space.",
	"website_url": "https://www.bristol.gov.uk/museums-parks-sports-culture/victoria-park",
	"coords": {
		"lat": 51.4405213,
		"lng": -2.5865543
	}
}, {
	"name": "Bristol Museum & Art Gallery",
	"type": "culture",
	"description": "Explore our collections of art, nature and history on display in this beautiful building. Find out about the last billion years of Earth’s history, explore the region’s natural wonders and discover more about peoples’ lives, past and present. Entry to the Museum is free",
	"website_url": "https://www.bristolmuseums.org.uk/bristol-museum-and-art-gallery/",
	"coords": {
		"lat": 51.456100,
		"lng": -2.605300
	}
}, {
	"name": "The Ivy Clifton Brasserie",
	"type": "restaurant",
	"description": "The Ivy Clifton Brasserie is now open in the heart of Clifton Village, Bristol, located on the corner of Caledonia Place and The Mall, overlooking The Mall Gardens.",
	"website_url": "http://theivycliftonbrasserie.com/",
	"coords": {
		"lat": 51.4549,
		"lng": -2.6209
	}
}, {
	"name": "The Fleece",
	"type": "venue",
	"description": "Legendary live music venue established in 1982, previously hosting the likes of Oasis, Radiohead, Queens of the Stone Age and White Stripes to name a few!",
	"website_url": "http://thefleece.co.uk/",
	"coords": {
		"lat": 51.452281,
		"lng": -2.589517
	}
}, {
	"name": "Bristol Royal Infirmary",
	"type": "medical",
	"description": "Ever wanted an all you can eat buffet encompassing foods from across the globe? Well, you've found it. Go mental, you only get 45 minutes to cram as much as you can in!",
	"website_url": "http://www.uhbristol.nhs.uk/",
	"coords": {
		"lat": 51.45849,
		"lng": -2.596603
	}
}, {
	"name": "Bristol Temple Meads",
	"type": "transport",
	"description": "Bristol Temple Meads railway station is the oldest and largest railway station in Bristol. It is an important transport hub for public transport, with bus services to many parts of the city and surrounding districts and a ferry to the city centre in addition to the train services",
	"website_url": "http://www.nationalrail.co.uk/stations/BRI/details.html",
	"coords": {
		"lat": 51.449000,
		"lng": -2.580000
	}
}, {
	"name": "Bristol Hippodrome",
	"type": "venue",
	"description": "Experience a variety of shows straight from the West End from musicals to comedy and circus shows.",
	"website_url": " http://www.atgtickets.com/venues/bristol-hippodrome/",
	"coords": {
		"lat": 51.4531883,
		"lng": -2.6003972
	}
}, {
	"name": "Clifton Suspension Bridge",
	"type": "culture",
	"description": "The Clifton Suspension Bridge, spanning the picturesque Avon Gorge, is the symbol of the city of Bristol. For almost 150 years this Grade I listed structure has attracted visitors from all over the world.",
	"website_url": "http://www.cliftonbridge.org.uk/",
	"coords": {
		"lat": 51.4544538,
		"lng": -2.6311839
	}
}, {
	"name": "Bristol Zoo",
	"type": "entertainment",
	"description": "Bristol Zoo Gardens maintains and defends biodiversity through breeding endangered species, conserving threatened species and habitats and promoting a wider understanding of the natural world",
	"website_url": "http://www.bristolzoo.org.uk/",
	"coords": {
		"lat": 51.4637461,
		"lng": -2.6246435
	}
}, {
	"name": "Water Sky",
	"type": "restaurant",
	"description": "Water Sky accommodates over 400 diners in extravagant surrounding, serving exceptional, authentic Chinese food. Why not drop by and enjoy an exquisite dining experience in what promises to be one of Bristol’s finest Chinese restaurants?",
	"website_url": "http://www.watersky-bristol.com",
	"coords": {
		"lat": 51.47295,
		"lng": -2.5713694
	}
}, {
	"name": "Showcase Cinema De Lux",
	"type": "entertainment",
	"description": "Modern multiscreen cinema with digital projection and sound equipment, plus a custom party service.",
	"website_url": "http://www.showcasecinemas.co.uk/locations/bristol",
	"coords": {
		"lat": 51.4590247,
		"lng": -2.5878965
	}
}, {
	"name": "Latcham",
	"type": "entertainment",
	"description": "",
	"website_url": "http://www.latchamdirect.co.uk",
	"coords": {
		"lat": 51.4179959,
		"lng": -2.5847738
	}
}];

var mainMarker = {
	"lat": 51.4573078,
	"lng": -2.5840724
};

exports.places = places;
exports.mainMarker = mainMarker;

},{}],8:[function(require,module,exports){
'use strict';

var _MapsApp = require('./MapsApp/MapsApp');

var _MapsApp2 = _interopRequireDefault(_MapsApp);

var _mockdata = require('./data/mockdata');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
	infoWindow: true,
	customMarkers: {
		path: './img/amenity_icons/',
		zoom: '_icon_large',
		icon: '_icon_small'
	},
	showDistance: true,
	sortBy: ['type', 'distance']
};

var myMap = new _MapsApp2.default('map', _mockdata.mainMarker, _mockdata.places, options);
myMap.createList('js-amenity-list');
myMap.createFilter('js-filter-controls');
myMap.createSorter('js-sort-list');

},{"./MapsApp/MapsApp":1,"./data/mockdata":7}]},{},[8]);
