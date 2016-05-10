var PoiList = (function() {

	var _listId,
		_poiArray,
		theMap,

		init = function init(listId, poiDetailsArray, map) {
			
			_listId = listId;
			_poiArray = poiDetailsArray;
			// markers = markerArray;
			theMap = map;

			_createList();
			_addListEventListeners();
		},

		_createList = function createList() {

			
			var listHTML = _makeListHTML(_poiArray);

			document.getElementById(_listId).innerHTML = listHTML;
		},

		_makeListHTML = function makeListHTML(detailsArray) {
			var HTML;

			HTML = '<ul id="poi-list">';

			detailsArray.forEach(function(item, index) {
				HTML += _makeListItemHTML(item);
				console.log(HTML);
			});

			HTML += '</ul>';
			return HTML;
		},

		_makeListItemHTML = function makeListItemHTML(item) {
			//TODO: make it dynamic!
			var iconPath = "img/amenity_icons/bar_icon_large.png", //dynamic
				title = "Sparky's Bar",
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

					theMap.changeIcon(_poiArray[index].marker, './img/amenity_icons/', _poiArray[index].type[0], '_icon_large', new google.maps.Point(14, 20))();
				});

				item.addEventListener('mouseleave', function() {

					theMap.changeIcon(_poiArray[index].marker, './img/amenity_icons/', _poiArray[index].type[0], '_icon_small')();
				});

				item.addEventListener('click', function() {

					theMap.createInfoWindow(index);
				});
			});
		};

	return {
		init: init
	};
})();

// changeIcon = function changeIcon(marker, iconPath, type, suffix, anchor) {

// 			return function() {
// 				var icon = { 
// 					url: iconPath + type + suffix + '.png',
// 					origin: new google.maps.Point(0, 0),
// 					anchor: anchor
// 				};

// 				marker.setIcon(icon);
// 			};
// 		};