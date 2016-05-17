var PoiList = (function() {

	var	_listId,
			_poiDetails,
			_theMap,
			_list,
			_listItemDisplayValue,

			init = function init(id, poiDetailsArray, map) {

				_listId = id;
				_poiDetails = poiDetailsArray;
				_theMap = map;

				_createList();
				_addListEventListeners();

				// _filterListItem('bar');
				// _filterListItem('restaurant');

				return this;
			},

			_createList = function createList() {

				var listHTML = _makeListHTML();

				document.getElementById(_listId).innerHTML = listHTML;

			},

			_makeListHTML = function makeListHTML() {

				var HTML;

				HTML = '<ul id="poi-list">';

				_poiDetails.forEach(function(poiDetail, index) {
					HTML += _makeListItemHTML(poiDetail);
				});

				HTML += '</ul>';
				return HTML;
			},

			_makeListItemHTML = function makeListItemHTML(poiDetail) {
				//TODO: make it dynamic!
				var iconPath = "img/amenity_icons/" + poiDetail.type + "_icon_large.png", //dynamic
						title = poiDetail.name,
						distance = 0.2, //getDistance();
						rating = 4,
						HTML;

				HTML = '<li>';
				HTML += '<img class="poi-icon" src="' + iconPath + '">';
				HTML += '<h3>' + title + '</h3>';
				HTML += '<span class="poi-distance">' + distance + ' miles from you</span>';
				HTML += '<span class="poi-rating">Rating: <span>' + rating + '</span></span>';
				HTML += '</li>';

				return HTML;
			},

			filterListItem = function filterListItem(filter) {

				_poiDetails.forEach(function(item, index) {
					if (item.type == filter) {
						if (_list[index].style.display === 'none') {
							_list[index].style.display = _listItemDisplayValue;
						} else {
							_list[index].style.display = 'none';
						}
					}
				});
			},

			_addListEventListeners = function addListEventListeners() {
				//TODO: refactor
				_list = document.getElementById('poi-list').getElementsByTagName('li');
				_listItemDisplayValue = _list[0].style.display;

				Array.prototype.forEach.call(_list, function(item, index) {
					item.addEventListener('mouseover', 	_theMap.changeIcon(_poiDetails[index].marker, _poiDetails[index].type, true, new google.maps.Point(14, 20)));

					item.addEventListener('mouseleave', _theMap.changeIcon(_poiDetails[index].marker, _poiDetails[index].type, false));

					item.addEventListener('click', function() {

						_theMap.createInfoWindow(index);
					});
				});
			};

	return {
		init: init,
		filterListItem: filterListItem
	};

})();
