class Marker {
	
	static addMarkersToArray(poiArray) {
		poiArray.forEach((item, index) => {
			item.marker = this.createMarker(item.coords, null);
		});
		return poiArray;
	}

	static setMarkers(markerArray, map) {
		markerArray.forEach((item, index) => {
			item.marker.setMap(map);
		});
	}

	static resetMarkers(markerArray) {
		this.setMarkers(markerArray, null);
	}

	static createMarker(position, map) {
		return new google.maps.Marker({
			position: position,
			map: map
		});
	}
}

export default Marker;