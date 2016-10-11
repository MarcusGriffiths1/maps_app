import PoiFilter from './PoiFilter';
import PoiList from './PoiList';
import PoiMap from './PoiMap';

class MapsApp {

	constructor(mapId, center, poiDetailsArray, options) {
		// Setup
		this._mapId = mapId;
		this._center = center;
		this._poiArray = this._addPoiMarkers(poiDetailsArray);
		this._options = options;

		this._theMap = new PoiMap(this._mapId, this._center);
		console.log(this._poiArray);

		this._setPoiMarkers();

		// google.maps.event.addDomListener(window, 'load', this.initialise);
		// this._initialise();
	}

	_initialise() {
		// this._addPoiMarkers();
		this._theMap = new PoiMap(this._mapId, this._center, this._poiArray, this._options);
	}

	createList(listId) {
		this._theList = new PoiList(listId, this._poiArray, this._theMap);
	}

	createFilter(filterId) {
		this._theFilter = PoiFilter.init(filterId, this._poiArray, this._theMap, this._theList);
	}

	_addPoiMarkers(poiArray) {
		poiArray.forEach((item, index) => {
			item.marker = this._createMarker(item.coords);
		});
		return poiArray;
	}

	_createMarker(position) {
		return new google.maps.Marker({
			position: position,
			map: null
		});
	}

	_setPoiMarkers() {
		this._poiArray.forEach((item, index) => {
			item.marker.setMap(this._theMap.getMap());
		});
	}
}

export default MapsApp;
