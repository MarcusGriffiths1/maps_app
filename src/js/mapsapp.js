var MapsApp = (function(Map, List, Filter) {

	var _theMap,
		_theList,
		_poiArray,
		_theFilter,

	init = function init(mapId, center, poiDetailsArray, options) {

		// Setup
		_theMap = Map.init(mapId, center, poiDetailsArray, options);

		_poiArray = _theMap.getPoiArray();

		return this;
	},

	createList = function createList(listId) {

			_theList = List.init(listId, _poiArray, _theMap);
	},

	createFilter = function createFilter(filterId) {

		_theFilter = Filter.init(filterId, _poiArray, _theMap, _theList);
	};

	return {
		init: init,
		createList: createList,
		createFilter: createFilter
	};

})(PoiMap || {}, PoiList || {}, PoiFilter || {});
