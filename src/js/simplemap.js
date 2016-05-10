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