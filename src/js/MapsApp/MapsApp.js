import PoiFilter from './PoiFilter';
import PoiList from './PoiList';
import PoiMap from './PoiMap';
import PoiData from './PoiData';
import pubSub from './PubSub';

class MapsApp {

	constructor(mapId, center, poiDetailsArray, options) {
		// Setup the data and the map
		this._theData = new PoiData(poiDetailsArray);
		this._theMap = new PoiMap(mapId, center, this._theData.getPoiData());

		// Setup any optional extras
		this._options = options;

		if (this._options.infoWindow === true) {
			this._theMap.initialiseInfoWindow();
			this._theData.addMarkerClickEvents();
		}

		if (this._options.customMarkers) {
			this._theData.addCustomMarkers(this._options.customMarkers);
		}
	}

	// --------------- PUBLIC INTERFACE ----------------------

	createList(listId) {
		this._theList = new PoiList(listId, this._theData.getPoiData());
	}

	createFilter(filterId) {
		this._theFilter = new PoiFilter(filterId, this._theData.getPoiData());
	}
}

export default MapsApp;
