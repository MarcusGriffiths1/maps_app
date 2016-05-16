var PoiList = (function() {

	var	_listId,
			_poiDetails,
			_theMap,

			init = function init(id, poiDetailsArray, map) {

				_listId = id;
				_poiDetails = poiDetailsArray;
				_theMap = map;

				_createList();
				_addListEventListeners();

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
				var iconPath = "img/amenity_icons/" + poiDetail.type[0] + "_icon_large.png", //dynamic
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

			_addListEventListeners = function addListEventListeners() {
				//TODO: refactor
				var list = document.getElementById('poi-list').getElementsByTagName('li');

				Array.prototype.forEach.call(list, function(item, index) {
					item.addEventListener('mouseover', function() {

						_theMap.changeIcon(_poiDetails[index].marker, _poiDetails[index].type, true, new google.maps.Point(14, 20))();
					});

					item.addEventListener('mouseleave', function() {

						_theMap.changeIcon(_poiDetails[index].marker, _poiDetails[index].type, false)();
					});

					item.addEventListener('click', function() {

						_theMap.createInfoWindow(index);
					});
				});
			};

	return {
		init: init
	};

})();
