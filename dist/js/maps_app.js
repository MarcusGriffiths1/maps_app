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

		// Setup any optional extras
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

	_createClass(MapsApp, [{
		key: 'createList',
		value: function createList(listId) {
			this._theList = new _PoiList2.default(listId, this._theData.getPoiData());
		}
	}, {
		key: 'createFilter',
		value: function createFilter(filterId) {
			this._theFilter = new _PoiFilter2.default(filterId, this._theData.getPoiData());
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PubSub = require('./PubSub');

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiData = function () {
	function PoiData(array) {
		_classCallCheck(this, PoiData);

		this._poiData = this._formatData(array);
		this._filterList = [];
		this._sortBy;
		this._subscribers();
	}

	// Adds google maps markers and unique keys to each poi


	_createClass(PoiData, [{
		key: '_formatData',
		value: function _formatData(poiArray) {
			var _this = this;

			poiArray.forEach(function (item, index) {
				item.marker = _this._createMarker(item.coords, null);
				item.key = index;
			});
			return poiArray;
		}
	}, {
		key: '_createMarker',
		value: function _createMarker(position, map) {
			return new google.maps.Marker({
				position: position,
				map: map
			});
		}
	}, {
		key: '_resetMarkers',
		value: function _resetMarkers() {
			this._poiData.forEach(function (item, index) {
				item.marker.setMap(null);
			});
		}
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
	}, {
		key: '_toggleFilter',
		value: function _toggleFilter(filter) {
			var filterIndex = this._indexOf(filter, this._filterList);

			if (filterIndex != -1) {
				this._filterList.splice(filterIndex, 1);
			} else {
				this._filterList.push(filter);
			}

			_PubSub2.default.publish('dataUpdated', this.getPoiData(true));
		}
	}, {
		key: '_filterData',
		value: function _filterData() {
			var _this2 = this;

			if (!this._filterList.length) {
				return this._poiData;
			}

			var filteredData = this._poiData.filter(function (item) {
				var isNotFiltered = true;

				for (var i = 0; i < _this2._filterList.length; i++) {
					if (_this2._filterList[i] === item.type) {
						isNotFiltered = false;
					}
				}

				return isNotFiltered;
			});

			return filteredData;
		}
	}, {
		key: '_addDistances',
		value: function _addDistances(poi, currentPos, index) {
			var _this3 = this;

			var fromDest = new google.maps.LatLng(currentPos);
			var toDest = poi.marker.getPosition();
			var distance = void 0;
			var dmService = new google.maps.DistanceMatrixService();

			var callback = function callback(response, status) {
				var distanceInMiles = (response.rows[0].elements[0].distance.value / 1000).toFixed(1);
				poi.distance = distanceInMiles;
				if (index == _this3._poiData.length - 1) {
					_PubSub2.default.publish('dataUpdated', _this3.getPoiData());
				}
			};

			dmService.getDistanceMatrix({
				origins: [fromDest],
				destinations: [toDest],
				travelMode: 'DRIVING'
			}, callback);
		}
	}, {
		key: '_sortData',
		value: function _sortData(poiData) {
			var _this4 = this;

			if (typeof this._sortBy == 'undefined') {
				return poiData;
			}

			var sortedData = poiData.sort(function (a, b) {
				if (a[_this4._sortBy] < b[_this4._sortBy]) {
					return -1;
				}
				if (a[_this4._sortBy] > b[_this4._sortBy]) {
					return 1;
				}
				return 0;
			});

			return sortedData;
		}

		// Icons will be changed within event listeners when the zoom option is applied,
		// which causes problems when feeding parameters to the function (it gets called immediately).
		// Currying to the rescue, this function is partially applied so needs to be
		// .call()-ed when used outside of an event listener.

	}, {
		key: '_makeIcon',
		value: function _makeIcon(marker, type, zoom, anchor) {
			var _this5 = this;

			return function () {
				var iconImg = zoom ? _this5._customMarkersSettings.zoom : _this5._customMarkersSettings.icon;

				var icon = {
					url: _this5._customMarkersSettings.path + type + iconImg + '.png',
					origin: new google.maps.Point(0, 0),
					anchor: anchor
				};

				marker.setIcon(icon);
			};
		}
	}, {
		key: '_createCustomMarkers',
		value: function _createCustomMarkers() {
			var _this6 = this;

			this._poiData.forEach(function (poi, index) {
				var type = poi.type;
				var marker = poi.marker;

				// Set standard icons
				_this6._makeIcon(marker, type, false).call();

				if (_this6._customMarkersSettings.zoom) {
					marker.addListener('mouseover', _this6._makeIcon(marker, type, true, new google.maps.Point(14, 20)));
					marker.addListener('mouseout', _this6._makeIcon(marker, type, false));
				}
			});
		}
	}, {
		key: '_addCustomMarkerSubscribers',
		value: function _addCustomMarkerSubscribers() {
			var _this7 = this;

			_PubSub2.default.subscribe('listItemMouseOver', function (topic, poi) {
				var type = poi.type;
				var marker = poi.marker;
				_this7._makeIcon(marker, type, true, new google.maps.Point(14, 20)).call();
			});

			_PubSub2.default.subscribe('listItemMouseOut', function (topic, poi) {
				var type = poi.type;
				var marker = poi.marker;
				_this7._makeIcon(marker, type, false).call();
			});
		}
	}, {
		key: '_subscribers',
		value: function _subscribers() {
			var _this8 = this;

			_PubSub2.default.subscribe('filterToggled', function (topic, value) {
				console.log(value);
				_this8._toggleFilter(value);
			});
		}

		// ---------- PUBLIC INTERFACE ----------

	}, {
		key: 'getPoiData',
		value: function getPoiData(resetMarkers) {
			if (resetMarkers === true) {
				this._resetMarkers();
			}
			var filteredData = this._filterData();
			var sortedData = this._sortData(filteredData);
			return sortedData;
		}
	}, {
		key: 'addMarkerClickEvents',
		value: function addMarkerClickEvents() {
			this._poiData.forEach(function (poi, index) {
				poi.marker.addListener('click', function () {
					_PubSub2.default.publish('markerClicked', poi);
				});
			});
		}
	}, {
		key: 'addCustomMarkers',
		value: function addCustomMarkers(options) {
			this._customMarkersSettings = options;
			this._createCustomMarkers();
			this._addCustomMarkerSubscribers();
		}
	}, {
		key: 'addDistances',
		value: function addDistances(center) {
			var _this9 = this;

			this._poiData.forEach(function (poi, index) {
				_this9._addDistances(poi, center, index);
			});
		}
	}]);

	return PoiData;
}();

exports.default = PoiData;

},{"./PubSub":6}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PubSub = require("./PubSub");

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiFilter = function () {
  function PoiFilter(filterId, poiData) {
    _classCallCheck(this, PoiFilter);

    this._filterId = filterId;

    this._setFilterArray(poiData);
    this._createFilterForm();
    this._addFilterEventListeners();
  }

  _createClass(PoiFilter, [{
    key: "_setFilterArray",
    value: function _setFilterArray(poiData) {
      this._filterArray = [];
      var temp = {};

      for (var i in poiData) {
        if (typeof temp[poiData[i].type] == "undefined") {
          this._filterArray.push(poiData[i].type);
        }
        temp[poiData[i].type] = 0;
      }
    }
  }, {
    key: "_createFilterForm",
    value: function _createFilterForm() {
      var filterFormHTML = this._makeFilterFormHTML();

      document.getElementById(this._filterId).innerHTML = filterFormHTML;
    }
  }, {
    key: "_makeFilterFormHTML",
    value: function _makeFilterFormHTML() {
      var _this = this;

      var HTML = "";

      this._filterArray.forEach(function (item, index) {
        HTML += _this._makeFilterItemHTML(item);
      });

      return HTML;
    }
  }, {
    key: "_makeFilterItemHTML",
    value: function _makeFilterItemHTML(item) {
      var HTML = '<li class="filters__item">';
      HTML += '<input type="checkbox" id="' + item + '" name="filter" value= "' + item + '" checked>';
      HTML += '<label for="' + item + '">' + item + '</label>';
      HTML += '</li>';

      return HTML;
    }
  }, {
    key: "_addFilterEventListeners",
    value: function _addFilterEventListeners() {
      var checkboxes = document.getElementsByName('filter');

      Array.prototype.forEach.call(checkboxes, function (item) {
        item.addEventListener('change', function () {
          _PubSub2.default.publish('filterToggled', item.value);
        });
      });
    }
  }]);

  return PoiFilter;
}();

exports.default = PoiFilter;

},{"./PubSub":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PubSub = require('./PubSub');

var _PubSub2 = _interopRequireDefault(_PubSub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PoiList = function () {
	function PoiList(listId, poiArray) {
		_classCallCheck(this, PoiList);

		this._listId = listId;

		this._updatePoiList(poiArray);

		this._subscriptions();
	}

	_createClass(PoiList, [{
		key: '_updatePoiList',
		value: function _updatePoiList(poiArray) {
			document.getElementById(this._listId).innerHTML = "";
			var listHTML = this._makeListHTML(poiArray);
			document.getElementById(this._listId).innerHTML = listHTML;

			this._addListEventListeners(poiArray);
		}
	}, {
		key: '_makeListHTML',
		value: function _makeListHTML(poiArray) {
			var _this = this;

			var HTML = '';

			poiArray.forEach(function (poiDetail, index) {
				HTML += _this._makeListItemHTML(poiDetail);
			});

			HTML += '';
			return HTML;
		}
	}, {
		key: '_makeListItemHTML',
		value: function _makeListItemHTML(poiDetail) {
			//TODO: make it dynamic!
			var iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png"; //dynamic
			var title = poiDetail.name;
			var rating = 4;

			var HTML = '<li class="poi" data-key="' + poiDetail.key + '">';
			HTML += '<img class="poi__icon" src="' + iconPath + '">';
			HTML += '<h3 class="poi__title">' + title + '</h3>';

			if (typeof poiDetail.distance != 'undefined') {
				HTML += '<span class="poi__distance">' + poiDetail.distance + ' from you</span>';
			}

			HTML += '<span class="poi__rating">Rating: <span>' + rating + '</span></span>';
			HTML += '</li>';

			return HTML;
		}
	}, {
		key: '_addListEventListeners',
		value: function _addListEventListeners(poiArray) {
			//TODO: refactor
			var domList = document.getElementById(this._listId).getElementsByTagName('li');

			[].forEach.call(domList, function (item, index) {
				var key = item.getAttribute('data-key');
				var poi = void 0;

				for (var i = 0; i < poiArray.length; i++) {
					if (poiArray[i].key == key.toString()) {
						poi = poiArray[i];
					}
				}

				item.addEventListener('mouseover', function () {
					_PubSub2.default.publish('listItemMouseOver', poi);
				});

				item.addEventListener('mouseleave', function () {
					_PubSub2.default.publish('listItemMouseOut', poi);
				});

				item.addEventListener('click', function () {
					_PubSub2.default.publish('markerClicked', poi);
				});
			});
		}

		// --------------- PUBSUB INTERFACE ----------------------
		// Contains all pubSub subscriptions

	}, {
		key: '_subscriptions',
		value: function _subscriptions() {
			var _this2 = this;

			_PubSub2.default.subscribe('markerClicked', function (topic, poi) {
				// add a little highlight animation?
			});

			_PubSub2.default.subscribe('dataUpdated', function (topic, newData) {
				_this2._updatePoiList(newData);
			});
		}
	}]);

	return PoiList;
}();

exports.default = PoiList;

},{"./PubSub":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _PubSub = require('./PubSub');

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
		value: function _createMarker(position, map) {
			return new google.maps.Marker({
				position: position,
				map: map
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
		key: '_setBounds',
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
		key: '_fitBounds',
		value: function _fitBounds() {
			this._theMap.fitBounds(this._bounds);
		}
	}, {
		key: '_createInfoWindow',
		value: function _createInfoWindow() {
			this._infoWindow = new google.maps.InfoWindow({
				maxWidth: 400
			});
		}
	}, {
		key: '_onDestroyInfoWindow',
		value: function _onDestroyInfoWindow() {
			var _this = this;

			google.maps.event.addListener(this._infoWindow, 'closeclick', function () {
				_this._fitBounds();
			});
		}

		// Applys the map's infoWindow to the marker of the point of interest given

	}, {
		key: '_setInfoWindow',
		value: function _setInfoWindow(poi) {
			var contentString = this._composeInfoWindowString(poi);

			this._infoWindow.setContent(contentString);
			this._infoWindow.open(this._theMap, poi.marker);
			this._theMap.panTo(poi.marker.getPosition());
		}
	}, {
		key: '_composeInfoWindowString',
		value: function _composeInfoWindowString(poi) {
			var HTMLString;
			HTMLString = '<div id="maps-window">';
			HTMLString += '<h3>' + poi.name + '</h3>';
			HTMLString += '<a href="' + poi.website_url + '">' + poi.website_url + '</a>';
			HTMLString += '<p>' + poi.description + '</p>';
			HTMLString += '</div>';

			return HTMLString;
		}

		// --------------- PUBSUB INTERFACE ----------------------
		// Contains all pubSub subscriptions

	}, {
		key: '_subscriptions',
		value: function _subscriptions() {
			var _this2 = this;

			_PubSub2.default.subscribe('markerClicked', function (topic, poi) {
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
		key: 'updatePoiMarkers',
		value: function updatePoiMarkers(poiData) {
			var _this3 = this;

			var pois = poiData;

			pois.forEach(function (item, index) {
				item.marker.setMap(_this3._theMap);
			});

			this._setBounds(pois);
		}
	}, {
		key: 'initialiseInfoWindow',
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
	"name": "Taylor&apos;s Lounge",
	"type": "bar",
	"description": "A cool bar and stuff",
	"website_url": "http://www.taylors.com",
	"coords": {
		"lat": 28.05176,
		"lng": -16.71619
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
}];

var mainMarker = {
	"lat": 28.050615,
	"lng": -16.71212
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

},{"./MapsApp/MapsApp":1,"./data/mockdata":7}]},{},[8]);
