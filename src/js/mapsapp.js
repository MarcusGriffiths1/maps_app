var MapsApp = (function(Map, List) {

	var theMap,
		theList,
		poiArray,

	init = function init(mapId, center, poiDetailsArray, listId) {
			
		// Setup
		theMap = Map.init(mapId, center, poiDetailsArray);

		poiArray = theMap.getPoiArray();

		theList = List.init(listId, poiArray, theMap);
		
		return this;
	},

	customMarkerIcons = function customMarkerIcons(iconPath, smallSuffix, largeSuffix) {
		theMap.customMarkerIcons(iconPath, smallSuffix, largeSuffix);
	};

	return {
		init: init,
		customMarkerIcons: customMarkerIcons
	};

})(MultipleMarkerMap || {}, PoiList || {});