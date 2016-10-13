import pubSub from './PubSub';

class PoiList {
	constructor(listId, poiArray) {
		this._listId = listId;

		this._updatePoiList(poiArray);

		this._subscriptions();
	}

	_updatePoiList(poiArray) {
		document.getElementById(this._listId).innerHTML = "";
		let listHTML = this._makeListHTML(poiArray);
		document.getElementById(this._listId).innerHTML = listHTML;

		this._addListEventListeners(poiArray);
	}

	_makeListHTML(poiArray) {
		let HTML = '<ul id="poi-list">';

		poiArray.forEach((poiDetail, index) => {
			HTML += this._makeListItemHTML(poiDetail);
		});

		HTML += '</ul>';
		return HTML;
	}

	_makeListItemHTML(poiDetail) {
		//TODO: make it dynamic!
		let iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png"; //dynamic
		let	title = poiDetail.name;
		let	distance = 0.2; //getDistance();
		let	rating = 4;

		let HTML = '<li data-key="' + poiDetail.key + '">';
		HTML += '<img class="poi-icon" src="' + iconPath + '">';
		HTML += '<h3>' + title + '</h3>';
		HTML += '<span class="poi-distance">' + distance + ' miles from you</span>';
		HTML += '<span class="poi-rating">Rating: <span>' + rating + '</span></span>';
		HTML += '</li>';

		return HTML;
	}

	_addListEventListeners(poiArray) {
		//TODO: refactor
		let domList = document.getElementById('poi-list').getElementsByTagName('li');

		[].forEach.call(domList, (item, index) => {
			let key = item.getAttribute('data-key');
			let poi;

			for (let i = 0; i < poiArray.length; i++) {
				if (poiArray[i].key == key.toString()) {
					poi = poiArray[i];
				}
			}

			item.addEventListener('mouseover', () => {
				pubSub.publish('listItemMouseOver', poi);
			});

			item.addEventListener('mouseleave', () => {
				pubSub.publish('listItemMouseOut', poi);
			});

			item.addEventListener('click', () => {
				pubSub.publish('markerClicked', poi);
			});
		});
	}

	// --------------- PUBSUB INTERFACE ----------------------
	// Contains all pubSub subscriptions
	_subscriptions() {
		pubSub.subscribe('markerClicked', (topic, poi) => {
			// add a little highlight animation?
		});

		pubSub.subscribe('dataUpdated', (topic, newData) => {
			this._updatePoiList(newData);
		});
	}
}

export default PoiList;

// class PoiList {
// 	constructor(id, poiArray, map) {
// 		this._listId = id;
// 		this._poiArray = poiArray;
// 		this._theMap = map;

// 		this._createList();
// 		this._addListEventListeners();
// 	}

// 	_createList() {
// 		let listHTML = this._makeListHTML();
// 		document.getElementById(this._listId).innerHTML = listHTML;
// 	}

// 	_makeListHTML() {
// 		let HTML = '<ul id="poi-list">';

// 		this._poiArray.forEach((poiDetail, index) => {
// 			HTML += this._makeListItemHTML(poiDetail);
// 		});

// 		HTML += '</ul>';
// 		return HTML;
// 	}

// 	_makeListItemHTML(poiDetail) {
// 		//TODO: make it dynamic!
// 		let iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png"; //dynamic
// 		let	title = poiDetail.name;
// 		let	distance = 0.2; //getDistance();
// 		let	rating = 4;

// 		let HTML = '<li>';
// 		HTML += '<img class="poi-icon" src="' + iconPath + '">';
// 		HTML += '<h3>' + title + '</h3>';
// 		HTML += '<span class="poi-distance">' + distance + ' miles from you</span>';
// 		HTML += '<span class="poi-rating">Rating: <span>' + rating + '</span></span>';
// 		HTML += '</li>';

// 		return HTML;
// 	}

// 	_addListEventListeners() {
// 		//TODO: refactor
// 		this._domList = document.getElementById('poi-list').getElementsByTagName('li');
// 		this._listItemDisplayValue = this._domList[0].style.display;

// 		[].forEach.call(this._domList, (item, index) => {
// 			item.addEventListener('mouseover', 	this._theMap.makeIcon(this._poiArray[index].marker, this._poiArray[index].type, true, new google.maps.Point(14, 20)));

// 			item.addEventListener('mouseleave', this._theMap.makeIcon(this._poiArray[index].marker, this._poiArray[index].type, false));

// 			item.addEventListener('click', () => {
// 				this._theMap.createInfoWindow(index);
// 			});
// 		});
// 	}

// 	filterListItem(filter) {

// 		this._poiArray.forEach((item, index) => {
// 			if (item.type == filter) {
// 				if (this._domList[index].style.display === 'none') {
// 					this._domList[index].style.display = this._listItemDisplayValue;
// 				} else {
// 					this._domList[index].style.display = 'none';
// 				}
// 			}
// 		});
// 	}
// }
