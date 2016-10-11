import MapsApp from './MapsApp';
import { places, mainMarker} from './data/mockdata';

const options = {
	infoWindow: 1,
	customMarkers: {
		path: './img/amenity_icons/',
		zoom: '_icon_large',
		icon: '_icon_small'
	}
};

var myMap = new MapsApp('map', mainMarker, places, options);

myMap.createList('amenity-list');
myMap.createFilter('filter-controls');