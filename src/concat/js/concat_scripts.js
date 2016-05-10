var SimpleMap = (function(document) {
	
	var _simpleMap,
		_centralLocation,
		_mainMarker,

		init = function init(id, center) {

			// Validate data before proceeding
			if (_validateMapData(id, center)) {

				// Setup
				_setCenter(center);
				_simpleMap = _createMap(id, _centralLocation);
				_mainMarker = addMarker(_centralLocation);

				// Make sure public API is available
				return this;
			}
		},
		
		_setCenter = function setCenter(center) {
			
			_centralLocation = center;
		},

		// The init() function returns the API, sometimes 
		// operations may need to be performed on the map itself,
		// this makes the map available via the API if needed
		getMap = function getMap() {

			return _simpleMap;
		},
		
		_createMap = function createMap(id, center) {
	
			var mapDiv = document.getElementById(id),
				map;

			map = new google.maps.Map(mapDiv, {
				center: center,
				scrollwheel: false,
				zoom: 15
			});

			return map;
		},
		
		// Public method: adds a marker in the specified position
		addMarker = function addMarker(position) {
	
			return new google.maps.Marker({
				position: position,
				map: _simpleMap
			});
		},
		
		// Simple validation
		_validateMapData = function validateMapData(id, center) {
	
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
		};
	
	return {
		init: init,
		addMarker: addMarker,
		getMap: getMap
	};
	
})(document);
var MultipleMarkerMap = (function(Map) {
	
	var _theMap,
		// _poiMarkers = [],
		_poiDetails,
		_infoWindow,
		_bounds,

		init = function init(id, center, poiDetailsArray) {
			
			// Setup
			_theMap = Map.init(id, center);
			_setInfoWindow();
			_setPoiDetails(poiDetailsArray);
			_addMarkers();
			_setBounds();
			_fitBounds();
			
			// Events
			_destroyInfoWindow();
			_addMarkerClickEvents();
			
			return this;
			
		},

		getPoiArray = function getPoiArray() {
			return _poiDetails;
		},
		
		_setInfoWindow = function setInfoWindow() {
			
			_infoWindow = new google.maps.InfoWindow({
				maxWidth: 400
			});
		},
		
		_setPoiDetails = function setPoiDetails(poiDetailsArray) {
			
			_poiDetails = poiDetailsArray;
		},
		
		createInfoWindow = function createInfoWindow(markerIndex) {
			
			var contentString = _createInfoWindowString(_poiDetails[markerIndex]);
			
			_infoWindow.setContent(contentString);
			_infoWindow.open(_theMap.getMap(), _poiDetails[markerIndex].marker);
		},
		
		_destroyInfoWindow = function _destroyInfoWindow() {
			
			google.maps.event.addListener(_infoWindow, 'closeclick', function() {
				_fitBounds();
			});
		},
		
		_createInfoWindowString = function createInfoWindowString(poiDetail) {
			
			var HTMLString;
			HTMLString = '<div class="maps-window">';
			HTMLString += '<h3>' + poiDetail.name + '</h3>';
			HTMLString += '<a href="' + poiDetail.website_url + '">' + poiDetail.website_url + '</a>';
			HTMLString += '<p>' + poiDetail.description + '</p>';
			HTMLString += '</div>';

			return HTMLString;
		},
		
		_addMarkers = function addMarkers(/*markerArray*/) {
			
			_poiDetails.forEach(function(item, index) {
				item.marker = _theMap.addMarker(item.coords);
			});

			// var markerArrayLength = markerArray.length;
			
			// for(var i = 0; i < markerArrayLength; i++) {
			// 	_poiMarkers.push(_theMap.addMarker(markerArray[i].coords));
			// }
		},
		
		_setBounds = function setBounds() {
			_bounds = new google.maps.LatLngBounds();
			
			for(var i = 0; i < _poiDetails.length; i++) {
				_bounds.extend(_poiDetails[i].marker.getPosition());
			}
		},
		
		_fitBounds = function fitBounds() {

			_theMap.getMap().fitBounds(_bounds);
		},
		
		_addMarkerClickEvents = function _addMarkerClickEvents() {

			_poiDetails.forEach(function(poi, index) {
				poi.marker.addListener('click', function() {
					_createInfoWindow(index);
				});
			});
		},

		customMarkerIcons = function customMarkerIcons(iconPath, smallSuffix, largeSuffix) {
			var poi, marker;

			_poiDetails.forEach(function(poi, index) {
				var type = poi.type[0];
				var marker = poi.marker;
				
				changeIcon(marker, iconPath, type, smallSuffix).call();

				marker.addListener('mouseover', changeIcon(marker, iconPath, type, largeSuffix, new google.maps.Point(14, 20)));

				marker.addListener('mouseout', changeIcon(marker, iconPath, type, smallSuffix));
			});
		},

		// Icons can be changed within event listeners, which causes problems when
		// feeding parameters to the function (it gets called immediately).
		// Currying to the rescue, this function is partially applied so needs to be 
		// .call()...ed when used outside of an event listener.
		changeIcon = function changeIcon(marker, iconPath, type, suffix, anchor) {

			return function() {
				var icon = { 
					url: iconPath + type + suffix + '.png',
					origin: new google.maps.Point(0, 0),
					anchor: anchor
				};

				marker.setIcon(icon);
			};
		};
	
	return {
		init: init,
		customMarkerIcons: customMarkerIcons,
		getPoiArray: getPoiArray,
		changeIcon: changeIcon,
		createInfoWindow: createInfoWindow
	};
	
})(SimpleMap || {});
var PoiList = (function() {

	var _listId,
		_poiArray,
		theMap,

		init = function init(listId, poiDetailsArray, map) {
			
			_listId = listId;
			_poiArray = poiDetailsArray;
			// markers = markerArray;
			theMap = map;

			_createList();
			_addListEventListeners();
		},

		_createList = function createList() {

			
			var listHTML = _makeListHTML(_poiArray);

			document.getElementById(_listId).innerHTML = listHTML;
		},

		_makeListHTML = function makeListHTML(detailsArray) {
			var HTML;

			HTML = '<ul id="poi-list">';

			detailsArray.forEach(function(item, index) {
				HTML += _makeListItemHTML(item);
				console.log(HTML);
			});

			HTML += '</ul>';
			return HTML;
		},

		_makeListItemHTML = function makeListItemHTML(item) {
			//TODO: make it dynamic!
			var iconPath = "img/amenity_icons/bar_icon_large.png", //dynamic
				title = "Sparky's Bar",
				distance = 0.2, //getDistance();
				rating = 4,
				HTML;

			HTML = '<li>';
			HTML += '<img class="poi-icon" src="' + iconPath + '">';
			HTML += '<h3>' + title + '</h3>';
			HTML += '<span class="poi-distance">' + distance + ' miles from you</span>';
			HTML += '<span class="poi-rating">Rating: <span>' + rating + '</span></span>';
			HTML += '</li>';

			return HTML;
		},

		_addListEventListeners = function addListEventListeners() {
			//TODO: refactor
			var list = document.getElementById('poi-list').getElementsByTagName('li');

			Array.prototype.forEach.call(list, function(item, index) {
				item.addEventListener('mouseover', function() {

					theMap.changeIcon(_poiArray[index].marker, './img/amenity_icons/', _poiArray[index].type[0], '_icon_large', new google.maps.Point(14, 20))();
				});

				item.addEventListener('mouseleave', function() {

					theMap.changeIcon(_poiArray[index].marker, './img/amenity_icons/', _poiArray[index].type[0], '_icon_small')();
				});

				item.addEventListener('click', function() {

					theMap.createInfoWindow(index);
				});
			});
		};

	return {
		init: init
	};
})();

// changeIcon = function changeIcon(marker, iconPath, type, suffix, anchor) {

// 			return function() {
// 				var icon = { 
// 					url: iconPath + type + suffix + '.png',
// 					origin: new google.maps.Point(0, 0),
// 					anchor: anchor
// 				};

// 				marker.setIcon(icon);
// 			};
// 		};
var MapsApp = (function(Map, List) {

	var theMap,
		theList,
		poiArray,

	init = function init(mapId, center, poiDetailsArray, listId) {
			
		// Setup
		theMap = Map.init(mapId, center, poiDetailsArray);

		poiArray = theMap.getPoiArray();

		theList = List.init(listId, poiArray, theMap);
		
		return this;
	},

	customMarkerIcons = function customMarkerIcons(iconPath, smallSuffix, largeSuffix) {
		theMap.customMarkerIcons(iconPath, smallSuffix, largeSuffix);
	};

	return {
		init: init,
		customMarkerIcons: customMarkerIcons
	};

})(MultipleMarkerMap || {}, PoiList || {});
var poiData = [
	{
		"name": "Supermercados Coviran",
		"type": ["supermarket"],
		"description": "A supermarket offering all your grocery needs",
		"website_url": "http://www.supermarket.com",
		"coords": {
			"lat": 28.05249,
			"lng": -16.71548
		}
	},
	{
		"name": "Mercadona",
		"type": ["supermarket"],
		"description": "Tenerife&apos;s biggest supermarket",
		"website_url": "http://www.mercadona.com",
		"coords": {
			"lat": 28.05457,
			"lng": -16.70861
		}
	},
	{
		"name": "O&apos;Neill&apos;s Bar",
		"type": ["bar"],
		"description": "A lively Irish bar",
		"website_url": "http://www.oneills.com",
		"coords": {
			"lat": 28.05600,
			"lng": -16.72445
		}
	},
	{
		"name": "Claddagh Irish Bar",
		"type": ["bar"],
		"description": "Always a friendly atmosphere",
		"website_url": "http://www.claddagh.com",
		"coords": {
			"lat": 28.05,
			"lng": -16.7166667
		}
	},
	{
		"name": "Taylor&apos;s Lounge",
		"type": ["bar"],
		"description": "A cool bar and stuff",
		"website_url": "http://www.taylors.com",
		"coords": {
			"lat": 28.05176,
			"lng": -16.71619
		}
	}
];

function initMap() {
	var myMap = MapsApp.init('map', {
			"lat": 28.050615,
			"lng": -16.71212
		},
		poiData,
		'amenity-list'
	)
	.customMarkerIcons(
		'./img/amenity_icons/', 
		'_icon_small', 
		'_icon_large'
	);
	
}



