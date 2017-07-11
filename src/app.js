var map;
var mapContainer = document.getElementById('map');
var cityList = document.getElementById('city-list');
var cityPlaceholder = document.getElementById('city-placeholder');
var stateList = document.getElementById('state-list');
var statePlaceholder = document.getElementById('state-placeholder');
var mapStyle = [
  {
    'featureType': 'all',
    'elementType': 'all',
    'stylers': [{ 'visibility': 'off' }]
  },
  {
    'featureType': 'administrative',
    'elementType': 'labels.text',
    'stylers': [{ 'visibility': 'on' }]
  },
  {
    'featureType': 'administrative',
    'elementType': 'geometry',
    'stylers': [{ 'visibility': 'on' }, { 'color': '#dddddd' }]
  },
  {
    'featureType': 'landscape',
    'elementType': 'geometry',
    'stylers': [{ 'visibility': 'on' }, { 'color': '#fafafa' }]
  },
  {
    'featureType': 'water',
    'elementType': 'labels',
    'stylers': [{ 'visibility': 'off' }]
  },
  {
    'featureType': 'water',
    'elementType': 'geometry',
    'stylers': [{ 'visibility': 'on' }, { 'hue': '#5f94ff' }, { 'lightness': 60 }]
  },
];

var colorMap = {
  'Haryana': '#DCEDC8',
  'Himachal Pradesh': '#BBDEFB',
  'Punjab': '#FFECB3',
  'Mandi': '#B71C1C',
  'Chamba': '#4A148C'
};

function initMap() {
  map = new google.maps.Map(mapContainer, {
    center: { lat: 31.1048, lng: 77.1734 },
    zoom: 6,
    styles: mapStyle,
  });

  map.data.setStyle(styleFeature);
  map.data.addListener('mouseover', mouseInToRegion);
  map.data.addListener('mouseout', mouseOutOfRegion);
  map.data.addListener('click', clickInTheRegion);
  map.data.addListener('dblclick', dblClickInTheRegion);

  loadMapShapes();
}

function loadMapShapes() {
  map.data.loadGeoJson('cities.geojson');
  map.data.loadGeoJson('states.geojson');
}

function styleFeature(feature) {
  var adminLevel = parseInt(feature.getProperty('admin_level'));

  var outlineWeight = 0.25;
  if(feature.getProperty('state') === 'hover') {
    outlineWeight *= adminLevel;
  }

  var fillOpacity = 0.4;
  if(adminLevel === 5) {
    fillOpacity: 0.8;
  }

  return {
    strokeWeight: outlineWeight,
    strokeColor: '#333',
    fillColor: colorMap[feature.getProperty('name')],
    zIndex: adminLevel,
    fillOpacity: fillOpacity
  };
}

function mouseInToRegion(e) {
  e.feature.setProperty('state', 'hover');
}

function mouseOutOfRegion(e) {
  e.feature.setProperty('state', 'normal');
}

function clickInTheRegion(e) {
  if(e.feature.getProperty('admin_level') !== "5") return;

  var props = {};
  var list = [];

  props['name'] = e.feature.getProperty('name');
  props['state'] = e.feature.getProperty('census2001:STATE');
  props['total population'] = e.feature.getProperty('census2001:TOTPOP');
  props['male population'] = e.feature.getProperty('census2001:MALEPOP');
  props['female population'] = e.feature.getProperty('census2001:FEMPOP');
  props['literacy rate'] = e.feature.getProperty('census2001:LITRATE') + ' %';
  props['male literacy'] = e.feature.getProperty('census2001:MALELITRAT') + ' %';
  props['female literacy'] = e.feature.getProperty('census2001:FEMLITRATE') + ' %';

  Object.keys(props).forEach(function (key) {
    var newLi = document.createElement('li');
    var content = document.createTextNode(key + ': ' + props[key]);
    newLi.appendChild(content);
    list.push(newLi);
  });

  removeAllChildren(cityList);

  cityPlaceholder.style.display = 'none';
  list.forEach(function (li) {
    cityList.appendChild(li);
  });
}

function dblClickInTheRegion(e) {
  if(e.feature.getProperty('admin_level') !== "4") return;

  var props = {};
  var list = [];

  props['name'] = e.feature.getProperty('name');
  props['ref'] = e.feature.getProperty('ref');
  props['wikipedia'] = e.feature.getProperty('wikipedia');

  Object.keys(props).forEach(function (key) {
    var newLi = document.createElement('li');
    if(key === 'wikipedia') {
      var newLiChild = document.createElement('a');
      newLiChild.href = "https://en.wikipedia.org/wiki/" + props[key];
      newLiChild.target = "_blank";
      newLiChild.rel = "noopener";
      var text = document.createTextNode('Link To Wikipedia');
      newLiChild.appendChild(text);
    }
    else {
      var newLiChild = document.createTextNode(key + ': ' + props[key]);
    }
    newLi.appendChild(newLiChild);
    list.push(newLi);
  });

  removeAllChildren(stateList);

  statePlaceholder.style.display = 'none';
  list.forEach(function (li) {
    stateList.appendChild(li);
  });
}

function removeAllChildren(node) {
  while(node.firstChild) {
    node.removeChild(node.firstChild);
  }
}
