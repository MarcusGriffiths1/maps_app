/*
* Name: Point of Interest Map
* Dependencies: Browser, Google Maps JavaScript API
* Author: Marcus Griffiths
* 
* Initialising this module will provide a map with a
* single main marker and separate markers indicating 
* points of interest. 
*
* Current customisations include custom marker icons 
* (with an option for a secondary icon on hovering over 
* the point of interest) and an infowindow after clicking 
* a point of interest marker.
*
* Parameters:
* 
* @id: string: The id of the container the map is to be 
* placed in
*
* @center: Object :The location of the main marker, containing 
* two properties; 'lat' and 'lng';
*
* @poiDetailsArray: Array<Object>: An array of objects 
* with details of each point of interest. The format of each 
* object should be:
* 
* 	{
*		"name": "Taylor&apos;s Lounge",
*		"type": "bar",
*		"description": "A cool bar and stuff",
*		"website_url": "http://www.taylors.com",
*		"coords": {
*			"lat": 28.05176,
*			"lng": -16.71619
*		}
*	}
*
* The only required parameters are the 'coords', however the 
* optional functionality requires further details. 
* Using the infowindow requires a name, description and 
* website_url to display. The type is required by the icons 
* option, which will be explained below.
*
* @options: An object containing config for optional extras
* 
* - options.infoWindow: boolean: true or false. Depends on the 
*   addition of the parameters metioned above.
*
* - options.customMarkers: Object: Contains 3 parameters, if 
*   provided will create paths to images provided and initialise
*   custom markers.
*   IMPORTANT: requires icon images to be in .png format and be 
*   prefixed with the type as in the 'type' parameter in the 
*   poiDetailsArray objects. The suffix of the icon files must 
*   be provided.
*
*      -> customMarkers.path: String: Path to folder containing custom
*         icons.
*      -> customMarkers.icon: String: Suffix to icon images. 
*         e.g. Filename: bar_icon.png. Where '_icon' is the suffix.
*      -> customMarkers.zoom: String: Suffix to icon images when the
*         marker is hovered over.
*         e.g. Filename: bar_icon_hover.png. Where '_icon_hover' is
*         the suffix.
*
*
* TODOS:
* - Add validation for POI data
*/

var PoiMap = (function(document) {
	
	var _theMap,
		_mapId,
		_centralLocation,
		_centralMarker,
		_poiDetails,
		_bounds,

		init = function init(id, center, poiDetailsArray, options) {

			// Validate data before proceeding
			if (_validateMapData(id, center)) { 

				// Store all parameters in local properties
				_mapId = id;
				_centralLocation = center;
				_poiDetails = poiDetailsArray;

				// Create the map and provide reference to said map
				_theMap = _createMap();

				// Create central marker and provide reference
				_centralMarker = _addMarker(_centralLocation);

				// Create markers using list and add them to each poi detail
				_createPoiMarkers();

				// Set optionals

				// If the data includes information for the infowindow initialise it
				// and set click events
				if (options.infoWindow) {
					_setInfoWindow();
					_addMarkerClickEvents();
					_onDestroyInfoWindow();
				}

				if (options.customMarkers) {
					_createCustomMarkers(options.customMarkers);
				}
			}

			return this;
		},

		_createMap = function createMap() {
	
			var mapDiv = document.getElementById(_mapId),
				map;

			map = new google.maps.Map(mapDiv, {
				center: _centralLocation,
				scrollwheel: false,
				zoom: 15
			});

			return map;
		},

		_addMarker = function addMarker(position) {
	
			return new google.maps.Marker({
				position: position,
				map: _theMap
			});
		},

		_createPoiMarkers = function createPoiMarkers() {
	
			_poiDetails.forEach(function(item, index) {
				item.marker = _addMarker(item.coords);
			});

			_setBounds();
			_fitBounds();
		},

		_setBounds = function setBounds() {
			_bounds = new google.maps.LatLngBounds();
			
			for(var i = 0; i < _poiDetails.length; i++) {
				_bounds.extend(_poiDetails[i].marker.getPosition());
			}
		},
		
		_fitBounds = function fitBounds() {

			_theMap.fitBounds(_bounds);
		},

		_filterMarkers = function filterMarkers(filter) {

			_poiDetails.forEach(function(item, index) {
				if (item.type !== filter) {
					item.marker.setMap(null);
				}
			});
		},

		_createCustomMarkers = function createCustomMarkers(settings) {

			_poiDetails.forEach(function(poi, index) {
				var type = poi.type;
				var marker = poi.marker;

				// Set standard icons
				_changeIcon(marker, settings.path, type, settings.icon).call();

				if (settings.zoom) {
					marker.addListener('mouseover', _changeIcon(marker, settings.path, type, settings.zoom, new google.maps.Point(14, 20)));
					marker.addListener('mouseout', _changeIcon(marker, settings.path, type, settings.icon));
				}
			});
		}, 

		// Icons can be changed within event listeners, which causes problems when
		// feeding parameters to the function (it gets called immediately).
		// Currying to the rescue, this function is partially applied so needs to be 
		// .call()...ed when used outside of an event listener.
		_changeIcon = function changeIcon(marker, iconPath, type, suffix, anchor) {

			return function() {
				var icon = { 
					url: iconPath + type + suffix + '.png',
					origin: new google.maps.Point(0, 0),
					anchor: anchor
				};

				marker.setIcon(icon);
			};
		}, 

		_setInfoWindow = function setInfoWindow() {

			_infoWindow = new google.maps.InfoWindow({
				maxWidth: 400
			});
		},

		_createInfoWindow = function createInfoWindow(poiIndex) {
			
			var contentString = _createInfoWindowString(_poiDetails[poiIndex]);
			
			_infoWindow.setContent(contentString);
			_infoWindow.open(_theMap, _poiDetails[poiIndex].marker);
		},
		
		_onDestroyInfoWindow = function _onDestroyInfoWindow() {
			
			google.maps.event.addListener(_infoWindow, 'closeclick', function() {
				_fitBounds();
			});
		},
		
		_createInfoWindowString = function createInfoWindowString(poiDetail) {
			
			var HTMLString;
			HTMLString = '<div id="maps-window">';
			HTMLString += '<h3>' + poiDetail.name + '</h3>';
			HTMLString += '<a href="' + poiDetail.website_url + '">' + poiDetail.website_url + '</a>';
			HTMLString += '<p>' + poiDetail.description + '</p>';
			HTMLString += '</div>';

			return HTMLString;
		},

		_addMarkerClickEvents = function _addMarkerClickEvents() {

			_poiDetails.forEach(function(poi, index) {
				poi.marker.addListener('click', function() {
					_createInfoWindow(index);
				});
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
		init: init
	};
	
})(document);