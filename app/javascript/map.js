async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");
  window.map = new Map(document.getElementById("map"), {
  // window.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 13,
    center: { lat: 35.6586, lng: 139.7454 }, // マップの中心を東京タワーに設定
  });
}

window.initMap = initMap;
