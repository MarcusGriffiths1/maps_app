const places = [
	{
		"name": "Cabot Circus",
		"type": "shopping",
		"description": "Bristol&apos;s Cabot Circus offers the ultimate shopping experience, bringing together a host of high-street and designer brands and confirming the city&apos;s status as the South West&apos;s style capital. With more than 120 stores stocking the latest trends, Cabot Circus has something for every taste, including a four-storey flagship House of Fraser offering clothing, beauty and homewares.",
		"website_url": "https://www.cabotcircus.com/",
		"coords": {
			"lat": 51.458481,
			"lng": -2.5852458
		}
	},
	{
		"name": "Bristol Bierkeller",
		"type": "venue",
		"description": "Do you like alternative music? Then welcome home! Student nights are held twice weekly with all the best alternative music.",
		"website_url": "http://www.bristolbierkeller.co.uk/",
		"coords": {
			"lat": 51.4559925,
			"lng": -2.5925146
		}
	},
	{
		"name": "Lakota",
		"type": "venue",
		"description": "Not for the faint hearted, or if you want to get any coursework done! Lakota is frequently open until the early hours and often offers after parties for local sound system festivals. They offer the bsolute best of Bristol&apos;s local music scene",
		"website_url": "http://www.lakota.co.uk/",
		"coords": {
			"lat": 51.4616571,
			"lng": -2.5895789
		}
	},
	{
		"name": "The Canteen",
		"type": "bar",
		"description": "One of the more chilled out venues on Stokes Croft, they serve excellent food during the day. In the evenings it is transformed into a lively bar with live performances and open mic nights.",
		"website_url": "http://www.lakota.co.uk/",
		"coords": {
			"lat": 51.4628076,
			"lng": -2.5896245
		}
	},
	{
		"name": "King Street",
		"type": "bar",
		"description": "We can't just reccommend a few bars along King Street, go and try out a few! Craft beers and local ciders are itching to be tasted, a sure start to an awesome night.",
		"website_url": "no website",
		"coords": {
			"lat": 51.4516792,
			"lng": -2.5948164
		}
	},
	{
		"name": "Za Za Bazaar",
		"type": "restaurant",
		"description": "Ever wanted an all you can eat buffet encompassing foods from across the globe? Well, you've found it. Go mental, you only get 45 minutes to cram as much as you can in!",
		"website_url": "http://www.zazabazaar.com/",
		"coords": {
			"lat": 51.4503343,
			"lng": -2.5984718
		}
	},
	{
		"name" : "Raj Bari",
		"type" : "restaurant",
		"description" : "Situated amidst the picture perfect harbourside area of Hotwells in Bristol, the extremely popular Raj Bari Indian Restaurant was established in 1991 and can actually trace its humble beginnings back to London in the 1950s.",
		"website_url" : "http://www.rajbaribristol.co.uk/",
		"coords" : {
			"lat" :  51.449712,
			"lng" : -2.6158884
		}
	},
	{
		"name" : "Siam Harbourside Thai Restaurant",
		"type" : "restaurant",
		"description" :  "Here at the Siam Harbourside licensed restaurant we serve delicious authentic Thai food and drink and want to ensure that you capture all the flavours that Thai cuisine has to offer. Thai cuisine is distinctive thanks to the use of herbs and spices that will really tantalise your taste buds, taking you on a journey of culinary adventure.",
		"website_url" : "http://www.siam-harbourside.co.uk/",
		"coords" : {
			"lat" : 51.449361,
			"lng" :  -2.613297
		}
	},
	{
		"name" : "The Blue Lagoon",
		"type" : "bar",
		"description" :  "We’re a smart Cafe Bar & Live Music venue on the vibrant Gloucester Road and our focus is on excellent food, drink and music but above all the service and value for money we provide. The Blue Lagoon is a family owned business which we believe reflects in the way we operate – providing a family friendly atmosphere and specially designed children’s menus and high chairs for your convenience.",
		"website_url" : "http://www.thebluelagooncafebar.com/",
		"coords" : {
			"lat" : 51.4714083,
			"lng" : -2.5929919
		}
	},
	{
		"name" : "The Attic Bar",
		"type" : "venue",
		"description" :  "The Attic Bar is one of Bristol's long-standing and most popular venues in the heart of the cultural hub that is Stokes Croft, fully equipped with an excellent Opus soundsystem and stage lighting - you can find quality gigs of all styles of music every weekend! We host local and internationally renowned Bands and DJs throughout the year and it's also a perfect venue for private parties and events.",
		"website_url" : "http://www.fmbristol.co.uk/attic-bar",
		"coords" : {
			"lat" : 51.4602141,
			"lng" : -2.5904667
		}
	},
	{
		"name" : "Victoria Park",
		"type" : "park",
		"description" :  "Large Victorian park with children’s play area and grassy space.",
		"website_url" : "https://www.bristol.gov.uk/museums-parks-sports-culture/victoria-park",
		"coords" : {
			"lat" : 51.4405213,
			"lng" : -2.5865543
		}
	},
	{
		"name": "Bristol Museum & Art Gallery",
		"type": "culture",
		"description": "Explore our collections of art, nature and history on display in this beautiful building. Find out about the last billion years of Earth’s history, explore the region’s natural wonders and discover more about peoples’ lives, past and present. Entry to the Museum is free",
		"website_url": "https://www.bristolmuseums.org.uk/bristol-museum-and-art-gallery/",
		"coords": {
		  "lat": 51.456100,
		  "lng": -2.605300
		}
	},
	{
		"name": "The Ivy Clifton Brasserie",
		"type": "restaurant",
		"description": "The Ivy Clifton Brasserie is now open in the heart of Clifton Village, Bristol, located on the corner of Caledonia Place and The Mall, overlooking The Mall Gardens.",
		"website_url": "http://theivycliftonbrasserie.com/",
		"coords": {
			"lat": 51.4549,
			"lng": -2.6209
		}
	},
	{
		"name": "The Fleece",
		"type": "venue",
		"description": "Legendary live music venue established in 1982, previously hosting the likes of Oasis, Radiohead, Queens of the Stone Age and White Stripes to name a few!",
		"website_url": "http://thefleece.co.uk/",
		"coords": {
			"lat": 51.452281,
			"lng": -2.589517
		}
	},
	{
		"name": "Bristol Royal Infirmary",
		"type": "medical",
		"description": "Ever wanted an all you can eat buffet encompassing foods from across the globe? Well, you've found it. Go mental, you only get 45 minutes to cram as much as you can in!",
		"website_url": "http://www.uhbristol.nhs.uk/",
		"coords": {
			"lat": 51.45849,
			"lng": -2.596603
		}
	},
	{
		"name": "Bristol Temple Meads",
		"type": "transport",
		"description": "Bristol Temple Meads railway station is the oldest and largest railway station in Bristol. It is an important transport hub for public transport, with bus services to many parts of the city and surrounding districts and a ferry to the city centre in addition to the train services",
		"website_url": "http://www.nationalrail.co.uk/stations/BRI/details.html",
		"coords": {
		  "lat": 51.449000,
		  "lng": -2.580000
		}
	},
	{
    "name": "Bristol Hippodrome",
    "type": "venue",
    "description": "Experience a variety of shows straight from the West End from musicals to comedy and circus shows.",
    "website_url": " http://www.atgtickets.com/venues/bristol-hippodrome/",
    "coords": {
      "lat": 51.4531883,
      "lng": -2.6003972
    }
	},
	{
		"name": "Clifton Suspension Bridge",
		"type": "culture",
		"description": "The Clifton Suspension Bridge, spanning the picturesque Avon Gorge, is the symbol of the city of Bristol. For almost 150 years this Grade I listed structure has attracted visitors from all over the world.",
		"website_url": "http://www.cliftonbridge.org.uk/",
		"coords": {
			"lat": 51.4544538,
			"lng": -2.6311839
		}
	},
	{
		"name": "Bristol Zoo",
		"type": "entertainment",
		"description": "Bristol Zoo Gardens maintains and defends biodiversity through breeding endangered species, conserving threatened species and habitats and promoting a wider understanding of the natural world",
		"website_url": "http://www.bristolzoo.org.uk/",
		"coords": {
      "lat": 51.4637461,
      "lng": -2.6246435
		}
	},
	{
		"name": "Water Sky",
		"type": "restaurant",
		"description": "Water Sky accommodates over 400 diners in extravagant surrounding, serving exceptional, authentic Chinese food. Why not drop by and enjoy an exquisite dining experience in what promises to be one of Bristol’s finest Chinese restaurants?",
		"website_url": "http://www.watersky-bristol.com",
		"coords": {
      "lat": 51.47295,
      "lng": -2.5713694
		}
	},
	{
		"name": "Showcase Cinema De Lux",
		"type": "entertainment",
		"description": "Modern multiscreen cinema with digital projection and sound equipment, plus a custom party service.",
		"website_url": "http://www.showcasecinemas.co.uk/locations/bristol",
		"coords": {
		  "lat": 51.4590247,
		  "lng": -2.5878965
		}
	},
	{
		"name": "Latcham",
		"type": "entertainment",
		"description": "",
		"website_url": "http://www.latchamdirect.co.uk",
		"coords": {
		  "lat": 51.4179959,
		  "lng": -2.5847738
		}
	}
];

const mainMarker = {
	"lat": 51.4573078,
	"lng": -2.5840724
}

export { places, mainMarker };
