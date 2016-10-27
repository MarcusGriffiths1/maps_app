// TODO: Apply pure functions where possible so code is easy to navigate and reason about

import pubSub from './PubSub';

class PoiData {

	// Takes in data with specific format
	constructor(poiData) {
		this._poiData = this._formatData(poiData);
		this._filterList = [];

		// This property should only ever be a single value
		this._sortBy = 'type';
		this._subscribers();
	}

	// Adds google maps markers and unique keys to each poi in the data
	_formatData(poiData) {
		poiData.forEach((item, index) => {
			item.marker = this._createMarker(item.coords, null);
			item.key = index;
		});
		return poiData;
	}

	// Creates and returns a Google maps marker
	_createMarker(position, map) {
		return new google.maps.Marker({
			position: position,
			map: map
		});
	}

	// Takes all the markers in the data and set's their map property to null
	_resetMarkers(poiData) {
		poiData.forEach((item, index) => {
			item.marker.setMap(null);
		});
	}

	// Utility Function: Finds the index of an item in array
	_indexOf(item, array) {
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
	_toggleFilter(filter, array) {
		let filterIndex = this._indexOf(filter, array);
		let filteredArray = array.slice(0);

		if(filterIndex != -1) {
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
	_filterData(data, filterBy, filterArray) {
		if (!filterArray.length) {
			return data;
		}

		let filteredData = data.filter((item) => {
				let isNotFiltered = true;

				for(var i = 0; i < filterArray.length; i++) {
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
	_addDistances(markerPositions, currentPos, array) {
		let fromDest = new google.maps.LatLng(currentPos);
		let dmService = new google.maps.DistanceMatrixService();
		let distance;

		dmService.getDistanceMatrix({
			origins: [fromDest],
			destinations: markerPositions,
			travelMode: 'WALKING'
		}, (response, status) => {
			response.rows[0].elements.forEach((element, index) => {
				let distanceInMiles = (element.distance.value / 1000).toFixed(1);
				array[index].distance = distanceInMiles;
			});

			pubSub.publish('dataUpdated', this.getPoiData());
		});

	}

	// Takes the poi data and the field to sort by, returns a new array sorted by that field.
	_sortData(poiData, sortBy) {
		// No point iterating if there is nothing to sort by
		if (typeof(sortBy) == 'undefined') {
			return poiData;
		}

		// sort() sorts the array in place. Make sure slice is called on array
		// so as not to mutate the original. If the array is not copied it can
		// cause havoc with async tasks later, such as adding distances.
		let sortedData = poiData.slice(0).sort((a, b) => {
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
	_makeIcon(marker, type, zoom, zIndex=0, anchor) {
		return (() => {
			let iconPath = this._customMarkersSettings.path;

			// If a large version of the icon has been supplied this can be used for things like hover events
			let iconImg = zoom ? this._customMarkersSettings.zoom : this._customMarkersSettings.icon;

			let icon = {
				url: iconPath + type + iconImg + '.png',
				origin: new google.maps.Point(0, 0),
				anchor: anchor
			};

			marker.setIcon(icon);
			marker.setZIndex(zIndex);
		});
	}

	// This function is called if the user wants to create custom markers for the maps
	// NOTE: Adds listeners to the markers, so not a pure function
	_createCustomMarkers(poiData, settings) {
		poiData.forEach((poi, index) => {
			let type = poi.type;
			let marker = poi.marker;

			// Set standard icons
			this._makeIcon(marker, type, false).call();

			if (settings.zoom) {
				marker.addListener('mouseover', this._makeIcon(marker, type, true, 100, new google.maps.Point(14, 20)));
				marker.addListener('mouseout', this._makeIcon(marker, type, false));
			}
		});
	}

	// Adds subscribers to hook into events that are called outside of this object's scope.
	_addCustomMarkerSubscribers(settings) {
		// Only ever called if the ability to zoom icons is enabled
		if (settings.zoom) {
			pubSub.subscribe('listItemMouseOver', (topic, poi) => {
				let type = poi.type;
				let marker = poi.marker;
				// Use larger version of the icons
				this._makeIcon(marker, type, true, 100, new google.maps.Point(14, 20)).call();
			});

			pubSub.subscribe('listItemMouseOut', (topic, poi) => {
				let type = poi.type;
				let marker = poi.marker;
				this._makeIcon(marker, type, false).call();
			});
		}
	}

	// Adds subscribers to hook into events that are called outside of this object's scope.
	_subscribers() {
		pubSub.subscribe('filterToggled', (topic, value) => {
			this._filterList = this._toggleFilter(value, this._filterList);
			pubSub.publish('dataUpdated', this.getPoiData(true));
		});

		pubSub.subscribe('sortToggled', (topic, value) => {
			this._sortBy = value;
			pubSub.publish('dataUpdated', this.getPoiData(false));
		});
	}

	// ---------- PUBLIC INTERFACE ----------

	// Any time data is retrieved from this object it should be called through
	// this function, no exceptions!
	getPoiData(resetMarkers) {
		if (resetMarkers === true)
			this._resetMarkers(this._poiData);
		let filteredData = this._filterData(this._poiData, "type", this._filterList);
		let sortedData = this._sortData(filteredData, this._sortBy);

		let data = {
			data: sortedData,
			sortedBy: this._sortBy
		};

		return data;
	}

	// This is functionality that is added later if the user wants to include
	// an InfoWindow which opens when a marker is clicked.
	addMarkerClickEvents() {
		this._poiData.forEach((poi, index) => {
			poi.marker.addListener('click', () => {
				// Publish a marker click event in case anything is listening to this
				// TODO: Add list events when marker clicked
				pubSub.publish('poiClicked', poi);
			});
		});
	}

	// This is functionality that is added later if the user wants to include
	// custom markers and zoom effects when they are hovered over
	addCustomMarkers(options) {
		this._customMarkersSettings = options;
		this._createCustomMarkers(this._poiData, this._customMarkersSettings);
		this._addCustomMarkerSubscribers(this._customMarkersSettings);
	}

	// If the showDistance flag is true this function is fired
	addDistances(center) {
		let markerPositions = this._poiData.map((poi, index) => {
			return poi.marker.getPosition();
		});
		this._addDistances(markerPositions, center, this._poiData);
	}
}

export default PoiData;
