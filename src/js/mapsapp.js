var MapsApp = (function(Map, List) {

	var theMap,
		theList,
		poiArray,

	init = function init(mapId, center, poiDetailsArray, options, listId) {

		// Setup
		theMap = Map.init(mapId, center, poiDetailsArray, options);

		if (listId) {
			poiArray = theMap.getPoiArray();

			theList = List.init(listId, poiArray, theMap);
		}

		return this;
	},

	customMarkerIcons = function customMarkerIcons(iconPath, smallSuffix, largeSuffix) {
		theMap.customMarkerIcons(iconPath, smallSuffix, largeSuffix);
	};

	return {
		init: init,
		customMarkerIcons: customMarkerIcons
	};


})(PoiMap || {}, PoiList || {});
