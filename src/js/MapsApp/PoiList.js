import pubSub from './PubSub';

class PoiList {
	constructor(listId, poiData) {
		this._listId = listId;

		// Subscriptions to pubSub added before the update due to
		// async events in data object. Need to update the list as
		// soon as those events happen.
		this._subscriptions();

		this._updatePoiList(poiData);
	}

	_updatePoiList(poiData) {
		document.getElementById(this._listId).innerHTML = "";
		let listHTML = this._createListHTML(poiData);
		document.getElementById(this._listId).innerHTML = listHTML;

		this._addListEventListeners(poiData);
	}

	_createListHTML(poiData) {
		let HTML;

		if (poiData.sortedBy === "type") {
			HTML = this._makeTitledListHTML(poiData);
		} else {
			HTML = this._makeListHTML(poiData);
		}

		return HTML;
	}

	_makeTitledListHTML(poiData) {
		let titleData = this._makeDistinctArray(poiData.data);
		let HTML = '';

		titleData.forEach((title, index) => {
			HTML += '<li><ul>';
			HTML += '<h3 class="pois__title">' + title + '</h3>';
			poiData.data.forEach((poi, index) => {
				if (poi.type === title) {
					HTML += this._makeListItemHTML(poi);
				}
			});
		});

		return HTML;
	}

	_makeListHTML(poiData) {
		let HTML = '';
		console.log(poiData);
		poiData.data.forEach((poiDetail, index) => {
			HTML += this._makeListItemHTML(poiDetail);
		});

		return HTML;
	}

	_makeListItemHTML(poiDetail) {
		//TODO: make it dynamic!
		let iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png"; //dynamic
		let	title = poiDetail.name;
		let	rating = 4;

		let HTML = '<li class="poi" data-key="' + poiDetail.key + '">';
		HTML += '<img class="poi__icon" src="' + iconPath + '">';
		HTML += '<h4 class="poi__title">' + title + '</h4>';

		if (typeof(poiDetail.distance) != 'undefined') {
				HTML += '<span class="poi__distance">' + poiDetail.distance + 'km from you</span>';
		}

		HTML += '<span class="poi__rating">Rating: <span>' + rating + '</span></span>';
		HTML += '</li>';

		return HTML;
	}

	_addListEventListeners(poiData) {
		//TODO: refactor

		// Must obtain lis by class name in case the lists are nested
		let domList = document.getElementById(this._listId).getElementsByClassName('poi');

		[].forEach.call(domList, (item, index) => {

				let key = item.getAttribute('data-key');
				let poi;

				for (let i = 0; i < poiData.data.length; i++) {
					if (poiData.data[i].key == key.toString()) {
						poi = poiData.data[i];
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
			// }

		});
	}

	_makeDistinctArray(poiData) {
		// Add the filter array to the object scope.
		let distinctArray = [];

		// Use a temporary object to store distinct values as keys
		let temp = {};

		for (var i in poiData) {
			if (typeof(temp[poiData[i].type]) == "undefined") {
				distinctArray.push(poiData[i].type);
			}
			temp[poiData[i].type] = 0;
		}

		return distinctArray;
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
