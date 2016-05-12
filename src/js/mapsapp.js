var MapsApp = (function(Map, List) {

	var theMap,
		theList,
		poiArray,

	init = function init(mapId, center, poiDetailsArray, options, listId) {
			
		// Setup
		theMap = Map.init(mapId, center, poiDetailsArray, options);

		// theList = List.init(listId, poiDetailsArray, theMap);
		
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