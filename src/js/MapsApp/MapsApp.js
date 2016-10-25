/*
*  This is the central hub of the application. When a user instantiates this class
*  the supplied data is fed into a data store object and a new map is defined.
*  Any custom options are then processed on the map and the data.
*
*  Public methods are provided to create a list, filter and sort component for
*  more powerful interactivity.
*/

import PoiFilter from './PoiFilter';
import PoiList from './PoiList';
import PoiMap from './PoiMap';
import PoiData from './PoiData';
import pubSub from './PubSub';

class MapsApp {

	constructor(mapId, center, poiDetailsArray, options) {
		// Setup the data and the map
		this._center = center;
		this._theData = new PoiData(poiDetailsArray);
		this._theMap = new PoiMap(mapId, this._center, this._theData.getPoiData());

		// Setup any optional extras on the data and the map
		this._options = options;

		if (this._options.infoWindow === true) {
			this._theMap.initialiseInfoWindow();
			this._theData.addMarkerClickEvents();
		}

		if (this._options.customMarkers) {
			this._theData.addCustomMarkers(this._options.customMarkers);
		}

		if (this._options.showDistance) {
			this._theData.addDistances(center);
		}
	}

	// --------------- PUBLIC INTERFACE ----------------------

	// Populates a specified DOM element with data from the data store
	// and creates interactivity with the map through pubSub.
	createList(listId) {
		this._theList = new PoiList(listId, this._theData.getPoiData());
	}

	// Populates a specified DOM element with a list of clickable filters
	// based on the data in the data store.
	createFilter(filterId, sortId) {
		this._theFilter = new PoiFilter(filterId, this._theData.getPoiData());
	}

	// SorterId should point towards an empty select element
	// Provides ability to sort by any specified field of the data
	createSorter(sorterId) {
		this._theFilter.createSorter(sorterId, this._options.sortBy);
	};
}

export default MapsApp;
