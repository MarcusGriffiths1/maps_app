(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PoiFilter = require('./PoiFilter');

var _PoiFilter2 = _interopRequireDefault(_PoiFilter);

var _PoiList = require('./PoiList');

var _PoiList2 = _interopRequireDefault(_PoiList);

var _PoiMap = require('./PoiMap');

var _PoiMap2 = _interopRequireDefault(_PoiMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapsApp = function () {
	function MapsApp(mapId, center, poiDetailsArray, options) {
		_classCallCheck(this, MapsApp);

		// Setup
		this._mapId = mapId;
		this._center = center;
		this._poiArray = this._addPoiMarkers(poiDetailsArray);
		this._options = options;

		this._theMap = new _PoiMap2.default(this._mapId, this._center);
		console.log(this._poiArray);

		this._setPoiMarkers();

		// google.maps.event.addDomListener(window, 'load', this.initialise);
		// this._initialise();
	}

	_createClass(MapsApp, [{
		key: '_initialise',
		value: function _initialise() {
			// this._addPoiMarkers();
			this._theMap = new _PoiMap2.default(this._mapId, this._center, this._poiArray, this._options);
		}
	}, {
		key: 'createList',
		value: function createList(listId) {
			this._theList = new _PoiList2.default(listId, this._poiArray, this._theMap);
		}
	}, {
		key: 'createFilter',
		value: function createFilter(filterId) {
			this._theFilter = _PoiFilter2.default.init(filterId, this._poiArray, this._theMap, this._theList);
		}
	}, {
		key: '_addPoiMarkers',
		value: function _addPoiMarkers(poiArray) {
			var _this = this;

			poiArray.forEach(function (item, index) {
				item.marker = _this._createMarker(item.coords);
			});
			return poiArray;
		}
	}, {
		key: '_createMarker',
		value: function _createMarker(position) {
			return new google.maps.Marker({
				position: position,
				map: null
			});
		}
	}, {
		key: '_setPoiMarkers',
		value: function _setPoiMarkers() {
			var _this2 = this;

			this._poiArray.forEach(function (item, index) {
				item.marker.setMap(_this2._theMap.getMap());
			});
		}
	}]);

	return MapsApp;
}();

exports.default = MapsApp;

},{"./PoiFilter":2,"./PoiList":3,"./PoiMap":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});
var PoiFilter = function () {

        var _theMap,
            _theList,
            _poiDetails,
            _filterId,
            _filters,
            //if needed?

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
                        if (typeof temp[_poiDetails[i].type] == "undefined") {
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

                var HTML = '<label for="' + item + '">' + item + '</label><input type="checkbox" id="' + item + '" name="filter" value= "' + item + '" checked>';

                return HTML;
        },
            _addFilterEventListeners = function addFilterEventListeners() {

                var checkboxes = document.getElementsByName('filter');

                Array.prototype.forEach.call(checkboxes, function (item) {

                        item.addEventListener('change', function () {
                                _theMap.filterMarkers(this.value);
                                _theList.filterListItem(this.value);
                        });
                });
        };

        return {
                init: init
        };
}();

exports.default = PoiFilter;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiList = function () {
	function PoiList(id, poiArray, map) {
		_classCallCheck(this, PoiList);

		this._listId = id;
		this._poiArray = poiArray;
		this._theMap = map;

		this._createList();
		this._addListEventListeners();
	}

	_createClass(PoiList, [{
		key: '_createList',
		value: function _createList() {
			var listHTML = this._makeListHTML();
			document.getElementById(this._listId).innerHTML = listHTML;
		}
	}, {
		key: '_makeListHTML',
		value: function _makeListHTML() {
			var _this = this;

			var HTML = '<ul id="poi-list">';

			this._poiArray.forEach(function (poiDetail, index) {
				HTML += _this._makeListItemHTML(poiDetail);
			});

			HTML += '</ul>';
			return HTML;
		}
	}, {
		key: '_makeListItemHTML',
		value: function _makeListItemHTML(poiDetail) {
			//TODO: make it dynamic!
			var iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png"; //dynamic
			var title = poiDetail.name;
			var distance = 0.2; //getDistance();
			var rating = 4;

			var HTML = '<li>';
			HTML += '<img class="poi-icon" src="' + iconPath + '">';
			HTML += '<h3>' + title + '</h3>';
			HTML += '<span class="poi-distance">' + distance + ' miles from you</span>';
			HTML += '<span class="poi-rating">Rating: <span>' + rating + '</span></span>';
			HTML += '</li>';

			return HTML;
		}
	}, {
		key: '_addListEventListeners',
		value: function _addListEventListeners() {
			var _this2 = this;

			//TODO: refactor
			this._domList = document.getElementById('poi-list').getElementsByTagName('li');
			this._listItemDisplayValue = this._domList[0].style.display;

			[].forEach.call(this._domList, function (item, index) {
				item.addEventListener('mouseover', _this2._theMap.makeIcon(_this2._poiArray[index].marker, _this2._poiArray[index].type, true, new google.maps.Point(14, 20)));

				item.addEventListener('mouseleave', _this2._theMap.makeIcon(_this2._poiArray[index].marker, _this2._poiArray[index].type, false));

				item.addEventListener('click', function () {
					_this2._theMap.createInfoWindow(index);
				});
			});
		}
	}, {
		key: 'filterListItem',
		value: function filterListItem(filter) {
			var _this3 = this;

			this._poiArray.forEach(function (item, index) {
				if (item.type == filter) {
					if (_this3._domList[index].style.display === 'none') {
						_this3._domList[index].style.display = _this3._listItemDisplayValue;
					} else {
						_this3._domList[index].style.display = 'none';
					}
				}
			});
		}
	}]);

	return PoiList;
}();

exports.default = PoiList;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiMap = function () {
	function PoiMap(id, center) {
		_classCallCheck(this, PoiMap);

		if (this._validateMapData(id, center)) {
			this._mapId = id;
			this._mainLocation = center;

			// Create the map and provide reference to said map
			this._theMap = this._createMap();

			// Create central marker and provide reference
			this._mainMarker = this._createMarker(this._mainLocation);
		}
	}

	// Creates and returns a new Google map. 
	// Places the map inside the DOM element with the provided ID  


	_createClass(PoiMap, [{
		key: '_createMap',
		value: function _createMap() {
			var mapDiv = document.getElementById(this._mapId);

			var map = new google.maps.Map(mapDiv, {
				center: this._mainLocation,
				scrollwheel: false,
				zoom: 15
			});

			return map;
		}
	}, {
		key: '_createMarker',
		value: function _createMarker(position) {
			return new google.maps.Marker({
				position: position,
				map: this._theMap
			});
		}
	}, {
		key: '_validateMapData',
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
		key: 'getMap',
		value: function getMap() {
			return this._theMap;
		}
	}]);

	return PoiMap;
}();

// class PoiMap {
// 	constructor(id, center, poiArray, options) {
// 		// Validate data before proceeding
// 		if (this._validateMapData(id, center)) {

// 			// Store all parameters in local properties
// 			this._mapId = id;
// 			this._mainLocation = center;
// 			this._poiArray = poiArray;

// 			// Create the map and provide reference to said map
// 			this._theMap = this._createMap();

// 			// Create central marker and provide reference
// 			this._mainMarker = this._createMarker(this._mainLocation);

// 			// Create markers using poiArray and add them to each poi
// 			this._addPoiMarkers();

// 			// Set optionals

// 			// If the data includes information for the infowindow initialise it
// 			// and set click events
// 			if (options.infoWindow) {
// 				this._setInfoWindow();
// 				this._addMarkerClickEvents();
// 				this._onDestroyInfoWindow();
// 			}

// 			// If the data includes information for custom markers initialise them
// 			if (options.customMarkers) {
// 				this._customMarkersSettings = options.customMarkers;
// 				this._createCustomMarkers();
// 			}

// 		}
// 	}

// 	// Creates and returns a new Google map. 
// 	// Places the map inside DOM element with the provided ID  
// 	_createMap() {
// 		const mapDiv = document.getElementById(this._mapId);

// 		const map = new google.maps.Map(mapDiv, {
// 			center: this._mainLocation,
// 			scrollwheel: false,
// 			zoom: 15
// 		});

// 		return map;
// 	}

// 	// Creates and returns a new marker at the position given
// 	// Places the marker on the current map
// 	_createMarker(position) {
// 		return new google.maps.Marker({
// 			position: position,
// 			map: this._theMap
// 		});
// 	}

// 	// Uses the poiArray to create markers for each item in the array,
// 	// this function also sets the bounds of the map to make sure the markers fit
// 	// TODO: potentially make this immutable/return state so poiArray can be synced across application
// 	// ^^^ Think about how Flux does it... maybe Pub/Sub?
// 	_addPoiMarkers() {

// 		this._poiArray.forEach((item, index) => {
// 			item.marker = this._createMarker(item.coords);
// 		});

// 		this._setBounds();
// 		this._fitBounds();
// 	}

// 	// Uses the poi markers to set the correct zoom level of the map
// 	_setBounds() {
// 		this._bounds = new google.maps.LatLngBounds();

// 		for(var i = 0; i < this._poiArray.length; i++) {
// 			this._bounds.extend(this._poiArray[i].marker.getPosition());
// 		}
// 	}

// 	// Initiates the bounds set on the map
// 	_fitBounds() {
// 		this._theMap.fitBounds(this._bounds);
// 	}

// 	// -- Information window-specific functions

// 	_setInfoWindow() {
// 		this._infoWindow = new google.maps.InfoWindow({
// 			maxWidth: 400
// 		});
// 	}

// 	_addMarkerClickEvents() {
// 		this._poiArray.forEach((poi, index) => {
// 			poi.marker.addListener('click', () => {
// 				this.createInfoWindow(index);
// 			});
// 		});
// 	}

// 	_composeInfoWindowString(poi) {
// 		var HTMLString;
// 		HTMLString = '<div id="maps-window">';
// 		HTMLString += '<h3>' + poi.name + '</h3>';
// 		HTMLString += '<a href="' + poi.website_url + '">' + poi.website_url + '</a>';
// 		HTMLString += '<p>' + poi.description + '</p>';
// 		HTMLString += '</div>';

// 		return HTMLString;
// 	}

// 	_onDestroyInfoWindow() {
// 		google.maps.event.addListener(this._infoWindow, 'closeclick', () => {
// 			this._fitBounds();
// 		});
// 	}

// 	// -- Custom marker functions

// 	_createCustomMarkers() {

// 		this._poiArray.forEach((poi, index) => {
// 			let type = poi.type;
// 			let marker = poi.marker;

// 			// Set standard icons
// 			this.makeIcon(marker, type, false).call();

// 			if (this._customMarkersSettings.zoom) {
// 				marker.addListener('mouseover', this.makeIcon(marker, type, true, new google.maps.Point(14, 20)));
// 				marker.addListener('mouseout', this.makeIcon(marker, type, false));
// 			}
// 		});
// 	}

// 	// -- Utility functions

// 	_validateMapData(id, center) {
// 		if (id) {
// 			if (typeof id !== 'string') {
// 				console.error('Error: Map ID must be a string');
// 				return false;
// 			}
// 			if (!document.getElementById(id)) {
// 				console.error('Error: Map ID must be part of the DOM!');
// 				return false;
// 			}
// 		} else {
// 			console.error('Error: No Map ID present');
// 			return false;
// 		}

// 		if (center) {
// 			if (center.lat && center.lng) {
// 				if (typeof center.lat !== 'number' || typeof center.lng !== 'number') {
// 					console.error('Error: Lattitude and longitude must be numbers');
// 					return false;
// 				}
// 			} else {
// 				console.error('Error: Please provide central location lattitude and longitude');
// 				return false;
// 			}
// 		} else {
// 			console.error('Error: No central location provided');
// 			return false;
// 		}

// 		return true;
// 	}

// 	// ----------------------- PUBLIC INTERFACE -------------------------------

// 	// Applys the map's infoWindow to the marker of the point of interest given
// 	// TODO: Does this need to take a poi instead of an index? 
// 	createInfoWindow(poiIndex) {
// 		let poi = this._poiArray[poiIndex];
// 		let contentString = this._composeInfoWindowString(poi);

// 		this._infoWindow.setContent(contentString);
// 		this._infoWindow.open(this._theMap, poi.marker);
// 		this._theMap.panTo(poi.marker.getPosition());
// 	}

// 	// Icons will be changed within event listeners when the zoom option is applied,
// 	// which causes problems when feeding parameters to the function (it gets called immediately).
// 	// Currying to the rescue, this function is partially applied so needs to be
// 	// .call()-ed when used outside of an event listener.
// 	makeIcon(marker, type, zoom, anchor) {
// 		return (() => {
// 			var iconImg = zoom ? this._customMarkersSettings.zoom : this._customMarkersSettings.icon;

// 			var icon = {
// 				url: this._customMarkersSettings.path + type + iconImg + '.png',
// 				origin: new google.maps.Point(0, 0),
// 				anchor: anchor
// 			};

// 			marker.setIcon(icon);
// 		});
// 	}

// 	// Removes any markers from the map who's 'type' property matches the filter
// 	// TODO: potentially make this immutable/return state so poiArray can be synced across application
// 	// ^^^ Think about how Flux does it...
// 	filterMarkers(filter) {
// 		this._poiArray.forEach((item, index) => {
// 			if (item.type === filter) {
// 				if (item.marker.getMap() !== null) {
// 					item.marker.setMap(null);
// 				} else {
// 					item.marker.setMap(this._theMap);
// 				}
// 			}
// 		});
// 	}

// 	getPoiArray() {
// 		return this._poiArray;
// 	}
// }

exports.default = PoiMap;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var places = [{
	"name": "Supermercados Coviran",
	"type": "supermarket",
	"description": "A supermarket offering all your grocery needs",
	"website_url": "http://www.supermarket.com",
	"coords": {
		"lat": 28.05249,
		"lng": -16.71548
	}
}, {
	"name": "Mercadona",
	"type": "supermarket",
	"description": "Tenerife&apos;s biggest supermarket",
	"website_url": "http://www.mercadona.com",
	"coords": {
		"lat": 28.05457,
		"lng": -16.70861
	}
}, {
	"name": "O&apos;Neill&apos;s Bar",
	"type": "bar",
	"description": "A lively Irish bar",
	"website_url": "http://www.oneills.com",
	"coords": {
		"lat": 28.05600,
		"lng": -16.72445
	}
}, {
	"name": "Claddagh Irish Bar",
	"type": "restaurant",
	"description": "Always a friendly atmosphere",
	"website_url": "http://www.claddagh.com",
	"coords": {
		"lat": 28.05,
		"lng": -16.7166667
	}
}, {
	"name": "Taylor&apos;s Lounge",
	"type": "bar",
	"description": "A cool bar and stuff",
	"website_url": "http://www.taylors.com",
	"coords": {
		"lat": 28.05176,
		"lng": -16.71619
	}
}];

var mainMarker = {
	"lat": 28.050615,
	"lng": -16.71212
};

exports.places = places;
exports.mainMarker = mainMarker;

},{}],6:[function(require,module,exports){
'use strict';

var _MapsApp = require('./MapsApp');

var _MapsApp2 = _interopRequireDefault(_MapsApp);

var _mockdata = require('./data/mockdata');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
	infoWindow: 1,
	customMarkers: {
		path: './img/amenity_icons/',
		zoom: '_icon_large',
		icon: '_icon_small'
	}
};

var myMap = new _MapsApp2.default('map', _mockdata.mainMarker, _mockdata.places, options);

// myMap.createList('amenity-list');
// myMap.createFilter('filter-controls');

},{"./MapsApp":1,"./data/mockdata":5}]},{},[6]);
