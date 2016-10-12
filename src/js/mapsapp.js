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
}

export default MapsApp;
