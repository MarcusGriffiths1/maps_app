import pubSub from './PubSub';

class PoiList {
	constructor(listId, poiArray) {
		this._listId = listId;

		// Subscriptions to pubSub added before the update due to
		// async events in data object. Need to update the list as
		// soon as those events happen.
		this._subscriptions();

		this._updatePoiList(poiArray);
	}

	_updatePoiList(poiArray) {
		document.getElementById(this._listId).innerHTML = "";
		let listHTML = this._makeListHTML(poiArray);
		document.getElementById(this._listId).innerHTML = listHTML;

		this._addListEventListeners(poiArray);
	}

	_makeListHTML(poiArray) {
		let HTML = '';

		poiArray.forEach((poiDetail, index) => {
			HTML += this._makeListItemHTML(poiDetail);
		});

		HTML += '';
		return HTML;
	}

	_makeListItemHTML(poiDetail) {
		//TODO: make it dynamic!
		let iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png"; //dynamic
		let	title = poiDetail.name;
		let	rating = 4;

		let HTML = '<li class="poi" data-key="' + poiDetail.key + '">';
		HTML += '<img class="poi__icon" src="' + iconPath + '">';
		HTML += '<h3 class="poi__title">' + title + '</h3>';

		if (typeof(poiDetail.distance) != 'undefined') {
				HTML += '<span class="poi__distance">' + poiDetail.distance + 'km from you</span>';
		}

		HTML += '<span class="poi__rating">Rating: <span>' + rating + '</span></span>';
		HTML += '</li>';

		return HTML;
	}

	_addListEventListeners(poiArray) {
		//TODO: refactor
		let domList = document.getElementById(this._listId).getElementsByTagName('li');

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
