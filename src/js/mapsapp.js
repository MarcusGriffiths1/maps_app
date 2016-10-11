import PoiFilter from './PoiFilter';
import PoiList from './PoiList';
import PoiMap from './PoiMap';

class MapsApp {

	constructor(mapId, center, poiDetailsArray, options) {
		// Setup
		this._mapId = mapId;
		this._center = center;
		this._poiArray = poiDetailsArray;
		this._options = options;

		// google.maps.event.addDomListener(window, 'load', this.initialise);
		this._initialise();
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

	_addMarkersToArray() {
		this._poiArray.forEach
	}

	// // Creates and returns a new marker at the position given
	// // Places the marker on the current map
	// _createMarker(position) {
	// 	return new google.maps.Marker({
	// 		position: position,
	// 		map: this._theMap
	// 	});
	// }

	// // Uses the poiArray to create markers for each item in the array,
	// // this function also sets the bounds of the map to make sure the markers fit
	// // TODO: potentially make this immutable/return state so poiArray can be synced across application
	// // ^^^ Think about how Flux does it... maybe Pub/Sub?
	// _addPoiMarkers() {
	// 	this._poiArray.forEach((item, index) => {
	// 		item.marker = this._createMarker(item.coords);
	// 	});
	// }
}

export default MapsApp;
