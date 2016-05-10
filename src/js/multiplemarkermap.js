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