import pubSub from './PubSub';

class PoiMap {
	constructor(id, center, poiData) {
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
	_createMap() {
		const mapDiv = document.getElementById(this._mapId);

		const map = new google.maps.Map(mapDiv, {
			center: this._mainLocation,
			scrollwheel: false,
			zoom: 15,
			styles:[{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi.business","elementType":"geometry.fill","stylers":[{"visibility":"on"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#b4d4e1"},{"visibility":"on"}]}]
		});

		return map;
	}

	_createMarker(position, map) {
		return new google.maps.Marker({
			position: position,
			map: map
		});
	}

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

	_setBounds(poiData) {
		this._bounds = new google.maps.LatLngBounds();

		this._bounds.extend(this._mainMarker.getPosition());
		for(var i = 0; i < poiData.length; i++) {
			this._bounds.extend(poiData[i].marker.getPosition());
		}

		this._fitBounds();
	}

	// Initiates the bounds of the markers in an array
	_fitBounds() {
		this._theMap.fitBounds(this._bounds);
	}

	_createInfoWindow() {
		this._infoWindow = new google.maps.InfoWindow({
			maxWidth: 400
		});
	}

	_onDestroyInfoWindow() {
		google.maps.event.addListener(this._infoWindow, 'closeclick', () => {
			this._fitBounds();
		});
	}

	// Applys the map's infoWindow to the marker of the point of interest given
	_setInfoWindow(poi) {
		let contentString = this._composeInfoWindowString(poi);

		this._infoWindow.setContent(contentString);
		this._infoWindow.open(this._theMap, poi.marker);
		this._theMap.panTo(poi.marker.getPosition());
	}

	_composeInfoWindowString(poi) {
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
	_subscriptions() {
		pubSub.subscribe('markerClicked', (topic, poi) => {
			this._setInfoWindow(poi);
		});

		pubSub.subscribe('dataUpdated', (topic, newData) => {
			this.updatePoiMarkers(newData);
		});

		pubSub.subscribe('filterToggled', (topic, value) => {
			this._infoWindow.close();
		});
	}

	// --------------- PUBLIC INTERFACE ----------------------

	// Update interface called when subscribed to a subject
	updatePoiMarkers(poiData) {
		let pois = poiData;

		pois.forEach((item, index) => {
			item.marker.setMap(this._theMap);
		});

		this._setBounds(pois);
	}

	initialiseInfoWindow() {
		this._createInfoWindow();
		this._onDestroyInfoWindow();
	}

}

export default PoiMap;
