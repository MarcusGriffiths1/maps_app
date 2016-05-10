var poiData = [
	{
		"name": "Supermercados Coviran",
		"type": ["supermarket"],
		"description": "A supermarket offering all your grocery needs",
		"website_url": "http://www.supermarket.com",
		"coords": {
			"lat": 28.05249,
			"lng": -16.71548
		}
	},
	{
		"name": "Mercadona",
		"type": ["supermarket"],
		"description": "Tenerife&apos;s biggest supermarket",
		"website_url": "http://www.mercadona.com",
		"coords": {
			"lat": 28.05457,
			"lng": -16.70861
		}
	},
	{
		"name": "O&apos;Neill&apos;s Bar",
		"type": ["bar"],
		"description": "A lively Irish bar",
		"website_url": "http://www.oneills.com",
		"coords": {
			"lat": 28.05600,
			"lng": -16.72445
		}
	},
	{
		"name": "Claddagh Irish Bar",
		"type": ["bar"],
		"description": "Always a friendly atmosphere",
		"website_url": "http://www.claddagh.com",
		"coords": {
			"lat": 28.05,
			"lng": -16.7166667
		}
	},
	{
		"name": "Taylor&apos;s Lounge",
		"type": ["bar"],
		"description": "A cool bar and stuff",
		"website_url": "http://www.taylors.com",
		"coords": {
			"lat": 28.05176,
			"lng": -16.71619
		}
	}
];

function initMap() {
	var myMap = MapsApp.init('map', {
			"lat": 28.050615,
			"lng": -16.71212
		},
		poiData,
		'amenity-list'
	)
	.customMarkerIcons(
		'./img/amenity_icons/', 
		'_icon_small', 
		'_icon_large'
	);
	
}



