class PoiMap {
	constructor(id, center, poiArray, options) {
		// Validate data before proceeding
		if (this._validateMapData(id, center)) {

			// Store all parameters in local properties
			this._mapId = id;
			this._mainLocation = center;
			this._poiArray = poiArray;

			// Create the map and provide reference to said map
			this._theMap = this._createMap();

			// Create central marker and provide reference
			this._mainMarker = this._createMarker(this._mainLocation);

			// Create markers using poiArray and add them to each poi
			this._addPoiMarkers();

			// Set optionals

			// If the data includes information for the infowindow initialise it
			// and set click events
			if (options.infoWindow) {
				this._setInfoWindow();
				this._addMarkerClickEvents();
				this._onDestroyInfoWindow();
			}

			// If the data includes information for custom markers initialise them
			if (options.customMarkers) {
				this._customMarkersSettings = options.customMarkers;
				this._createCustomMarkers();
			}

		}
	}

	// Creates and returns a new Google map. 
	// Places the map inside DOM element with the provided ID  
	_createMap() {
		const mapDiv = document.getElementById(this._mapId);

		const map = new google.maps.Map(mapDiv, {
			center: this._mainLocation,
			scrollwheel: false,
			zoom: 15
		});

		return map;
	}

	// Creates and returns a new marker at the position given
	// Places the marker on the current map
	_createMarker(position) {
		return new google.maps.Marker({
			position: position,
			map: this._theMap
		});
	}

	// Uses the poiArray to create markers for each item in the array,
	// this function also sets the bounds of the map to make sure the markers fit
	// TODO: potentially make this immutable/return state so poiArray can be synced across application
	// ^^^ Think about how Flux does it... maybe Pub/Sub?
	_addPoiMarkers() {

		this._poiArray.forEach((item, index) => {
			item.marker = this._createMarker(item.coords);
		});

		this._setBounds();
		this._fitBounds();
	}

	// Uses the poi markers to set the correct zoom level of the map
	_setBounds() {
		this._bounds = new google.maps.LatLngBounds();

		for(var i = 0; i < this._poiArray.length; i++) {
			this._bounds.extend(this._poiArray[i].marker.getPosition());
		}
	}

	// Initiates the bounds set on the map
	_fitBounds() {
		this._theMap.fitBounds(this._bounds);
	}

	// -- Information window-specific functions

	_setInfoWindow() {
		this._infoWindow = new google.maps.InfoWindow({
			maxWidth: 400
		});
	}

	_addMarkerClickEvents() {
		this._poiArray.forEach((poi, index) => {
			poi.marker.addListener('click', () => {
				this.createInfoWindow(index);
			});
		});
	}

	_composeInfoWindowString(poi) {
		var HTMLString;
		HTMLString = '<div id="maps-window">';
		HTMLString += '<h3>' + poi.name + '</h3>';
		HTMLString += '<a href="' + poi.website_url + '">' + poi.website_url + '</a>';
		HTMLString += '<p>' + poi.description + '</p>';
		HTMLString += '</div>';

		return HTMLString;
	}

	_onDestroyInfoWindow() {
		google.maps.event.addListener(this._infoWindow, 'closeclick', () => {
			this._fitBounds();
		});
	}

	// -- Custom marker functions

	_createCustomMarkers() {

		this._poiArray.forEach((poi, index) => {
			let type = poi.type;
			let marker = poi.marker;

			// Set standard icons
			this.makeIcon(marker, type, false).call();

			if (this._customMarkersSettings.zoom) {
				marker.addListener('mouseover', this.makeIcon(marker, type, true, new google.maps.Point(14, 20)));
				marker.addListener('mouseout', this.makeIcon(marker, type, false));
			}
		});
	}

	// -- Utility functions

	_validateMapData(id, center) {
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

	// ----------------------- PUBLIC INTERFACE -------------------------------

	// Applys the map's infoWindow to the marker of the point of interest given
	// TODO: Does this need to take a poi instead of an index? 
	createInfoWindow(poiIndex) {
		let poi = this._poiArray[poiIndex];
		let contentString = this._composeInfoWindowString(poi);

		this._infoWindow.setContent(contentString);
		this._infoWindow.open(this._theMap, poi.marker);
		this._theMap.panTo(poi.marker.getPosition());
	}

	// Icons will be changed within event listeners when the zoom option is applied,
	// which causes problems when feeding parameters to the function (it gets called immediately).
	// Currying to the rescue, this function is partially applied so needs to be
	// .call()-ed when used outside of an event listener.
	makeIcon(marker, type, zoom, anchor) {
		return (() => {
			var iconImg = zoom ? this._customMarkersSettings.zoom : this._customMarkersSettings.icon;

			var icon = {
				url: this._customMarkersSettings.path + type + iconImg + '.png',
				origin: new google.maps.Point(0, 0),
				anchor: anchor
			};

			marker.setIcon(icon);
		});
	}

	// Removes any markers from the map who's 'type' property matches the filter
	// TODO: potentially make this immutable/return state so poiArray can be synced across application
	// ^^^ Think about how Flux does it...
	filterMarkers(filter) {
		this._poiArray.forEach((item, index) => {
			if (item.type === filter) {
				if (item.marker.getMap() !== null) {
					item.marker.setMap(null);
				} else {
					item.marker.setMap(this._theMap);
				}
			}
		});
	}

	getPoiArray() {
		return this._poiArray;
	}
}

export default PoiMap;
