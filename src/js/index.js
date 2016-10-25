import MapsApp from './MapsApp/MapsApp';
import { places, mainMarker } from './data/mockdata';

const options = {
	infoWindow: true,
	customMarkers: {
		path: './img/amenity_icons/',
		zoom: '_icon_large',
		icon: '_icon_small'
	},
	showDistance: true,
	sortBy: ['type', 'distance']
};

var myMap = new MapsApp('map', mainMarker, places, options);
myMap.createList('js-amenity-list');
myMap.createFilter('js-filter-controls');
myMap.createSorter('js-sort-list');
