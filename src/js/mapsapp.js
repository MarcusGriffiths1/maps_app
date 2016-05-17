var MapsApp = (function(Map, List, Filter) {

	var _theMap,
		_theList,
		_poiArray,
		_theFilter,

	init = function init(mapId, center, poiDetailsArray, options, listId, filterId) {

		// Setup
		_theMap = Map.init(mapId, center, poiDetailsArray, options);

		_poiArray = _theMap.getPoiArray();

		if (listId) {

			_theList = List.init(listId, _poiArray, _theMap);
		}

		if (options.filter) {

			_theFilter = Filter.init(filterId, _poiArray, _theMap, _theList);
		}

		return this;
	};

	return {
		init: init
	};

})(PoiMap || {}, PoiList || {}, PoiFilter || {});
