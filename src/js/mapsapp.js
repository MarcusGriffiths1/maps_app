import PoiFilter from './PoiFilter';
import PoiList from './PoiList';
import PoiMap from './PoiMap';
import Marker from './Marker';

class MapsApp {

	constructor(mapId, center, poiDetailsArray, options) {
		// Setup the map
		this._mapId = mapId;
		this._center = center;
		this._theMap = new PoiMap(this._mapId, this._center);

		// Setup the markers
		this._originalPoiArray = Marker.addMarkersToArray(poiDetailsArray);
		this._filteredArray = this._originalPoiArray.slice(0); // Sliced so array is passed by value, not by reference
		this._setMarkersToMap(this._originalPoiArray, this._filteredArray, this._theMap);

		// Setup any optional extras
		this._options = options;
	}

	// Resets any markers on the map according to the original list of POIs
	// and replaces them with the filtered list
	_setMarkersToMap(resetArray, markerArray, map) {
		Marker.resetMarkers(resetArray);
		Marker.setMarkers(markerArray, map.getGMap());
		map.fitBounds(markerArray);
	}

	// --------------- PUBLIC INTERFACE ----------------------

	createList(listId) {
		this._theList = new PoiList(listId, this._filteredArray);
	}

	createFilter(filterId) {
		this._theFilter = PoiFilter.init(filterId, this._poiArray, this._theMap, this._theList);
	}
}

export default MapsApp;
