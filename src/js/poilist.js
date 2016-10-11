class PoiList {
	constructor(id, poiArray, map) {
		this._listId = id;
		this._poiArray = poiArray;
		this._theMap = map;

		this._createList();
		this._addListEventListeners();
	}

	_createList() {
		let listHTML = this._makeListHTML();
		document.getElementById(this._listId).innerHTML = listHTML;
	}

	_makeListHTML() {
		let HTML = '<ul id="poi-list">';

		this._poiArray.forEach((poiDetail, index) => {
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

		let HTML = '<li>';
		HTML += '<img class="poi-icon" src="' + iconPath + '">';
		HTML += '<h3>' + title + '</h3>';
		HTML += '<span class="poi-distance">' + distance + ' miles from you</span>';
		HTML += '<span class="poi-rating">Rating: <span>' + rating + '</span></span>';
		HTML += '</li>';

		return HTML;
	}

	_addListEventListeners() {
		//TODO: refactor
		this._domList = document.getElementById('poi-list').getElementsByTagName('li');
		this._listItemDisplayValue = this._domList[0].style.display;

		[].forEach.call(this._domList, (item, index) => {
			item.addEventListener('mouseover', 	this._theMap.makeIcon(this._poiArray[index].marker, this._poiArray[index].type, true, new google.maps.Point(14, 20)));

			item.addEventListener('mouseleave', this._theMap.makeIcon(this._poiArray[index].marker, this._poiArray[index].type, false));

			item.addEventListener('click', () => {
				this._theMap.createInfoWindow(index);
			});
		});
	}

	filterListItem(filter) {

		this._poiArray.forEach((item, index) => {
			if (item.type == filter) {
				if (this._domList[index].style.display === 'none') {
					this._domList[index].style.display = this._listItemDisplayValue;
				} else {
					this._domList[index].style.display = 'none';
				}
			}
		});
	}
}

export default PoiList;
