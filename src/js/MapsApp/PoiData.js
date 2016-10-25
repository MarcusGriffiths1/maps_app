import pubSub from './PubSub';

class PoiData {

	constructor(array, window) {
		this._poiData = this._formatData(array);
		this._filterList = [];
		this._sortBy = 'type';
		this._subscribers();
	}

	// Adds google maps markers and unique keys to each poi
	_formatData(poiArray) {
		poiArray.forEach((item, index) => {
			item.marker = this._createMarker(item.coords, null);
			item.key = index;
		});
		return poiArray;
	}

	_createMarker(position, map) {
		return new google.maps.Marker({
			position: position,
			map: map
		});
	}

	_resetMarkers() {
		this._poiData.forEach((item, index) => {
			item.marker.setMap(null);
		});
	}

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

	_toggleFilter(filter) {
		let filterIndex = this._indexOf(filter, this._filterList);

		if(filterIndex != -1) {
			this._filterList.splice(filterIndex, 1);
		} else {
			this._filterList.push(filter);
		}

		pubSub.publish('dataUpdated', this.getPoiData(true));
	}

	_filterData() {
		if (!this._filterList.length) {
			return this._poiData;
		}

		let filteredData = this._poiData.filter((item) => {
				let isNotFiltered = true;

				for(var i = 0; i < this._filterList.length; i++) {
					if (this._filterList[i] === item.type) {
						isNotFiltered = false;
					}
				}

				return isNotFiltered;
		});

		return filteredData;
	}

	_addDistances(markerPositions, currentPos, array) {
		let fromDest = new google.maps.LatLng(currentPos);
		let distance;
		let dmService = new google.maps.DistanceMatrixService();

		dmService.getDistanceMatrix({
			origins: [fromDest],
			destinations: markerPositions,
			travelMode: 'DRIVING'
		}, (response, status) => {
			response.rows[0].elements.forEach((element, index) => {
				let distanceInMiles = (element.distance.value / 1000).toFixed(1);
				array[index].distance = distanceInMiles;
			});

			pubSub.publish('dataUpdated', this.getPoiData());
		});

	}

	_sortData(poiData) {
		// No point iterating if there is nothing to sort by
		if (typeof(this._sortBy) == 'undefined') {
			return poiData;
		}
		// Make sure slice is called on array so as not to mutate the original
		// If the array is not copied it can cause havoc with async tasks later,
		// such as adding distances.
		let sortedData = poiData.slice(0).sort((a, b) => {
			if (a[this._sortBy] < b[this._sortBy]) {
				return -1;
			}
			if (a[this._sortBy] > b[this._sortBy]) {
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
	_makeIcon(marker, type, zoom, zIndex=0, anchor) {
		return (() => {
			let iconPath = this._customMarkersSettings.path;
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

	_createCustomMarkers() {

		this._poiData.forEach((poi, index) => {
			let type = poi.type;
			let marker = poi.marker;

			// Set standard icons
			this._makeIcon(marker, type, false).call();

			if (this._customMarkersSettings.zoom) {
				marker.addListener('mouseover', this._makeIcon(marker, type, true, 100, new google.maps.Point(14, 20)));
				marker.addListener('mouseout', this._makeIcon(marker, type, false));
			}
		});
	}

	_addCustomMarkerSubscribers() {
		pubSub.subscribe('listItemMouseOver', (topic, poi) => {
			let type = poi.type;
			let marker = poi.marker;
			this._makeIcon(marker, type, true, 100, new google.maps.Point(14, 20)).call();
		});

		pubSub.subscribe('listItemMouseOut', (topic, poi) => {
			let type = poi.type;
			let marker = poi.marker;
			this._makeIcon(marker, type, false).call();
		});
	}

	_subscribers() {
		pubSub.subscribe('filterToggled', (topic, value) => {
			this._toggleFilter(value);
		});

		pubSub.subscribe('sortToggled', (topic, value) => {
			this._sortBy = value;
			pubSub.publish('dataUpdated', this.getPoiData(false));
		});
	}

	// ---------- PUBLIC INTERFACE ----------

	getPoiData(resetMarkers) {
		if (resetMarkers === true) {
			this._resetMarkers();
		}
		let filteredData = this._filterData();
		let sortedData = this._sortData(filteredData);

		let data = {
			data: sortedData,
			sortedBy: this._sortBy
		};

		return data;
	}

	addMarkerClickEvents() {
		this._poiData.forEach((poi, index) => {
			poi.marker.addListener('click', () => {
				pubSub.publish('markerClicked', poi);
			});
		});
	}

	addCustomMarkers(options) {
		this._customMarkersSettings = options;
		this._createCustomMarkers();
		this._addCustomMarkerSubscribers();
	}

	addDistances(center) {
		let markerPositions = this._poiData.map((poi, index) => {
			return poi.marker.getPosition();
		});
		this._addDistances(markerPositions, center, this._poiData);
	}
}

export default PoiData;
