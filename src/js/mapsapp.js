var MapsApp = (function(Map, List) {

	var _theMap,
		_theList,
		_poiArray,

	init = function init(mapId, center, poiDetailsArray, options, listId) {

		// Setup
		_theMap = Map.init(mapId, center, poiDetailsArray, options);

		if (listId) {
			_poiArray = _theMap.getPoiArray();

			_theList = List.init(listId, _poiArray, _theMap);
		}

		return this;
	};

	return {
		init: init
	};

})(PoiMap || {}, PoiList || {});
