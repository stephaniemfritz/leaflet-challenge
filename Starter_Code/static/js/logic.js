

// Create the 'basemap' tile layer that will be the background of our map.
let basemap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map


// Create the map object with center and zoom options.
let myMap=L.map("map", {
  center: [
    37.09, -95.71
  ],
  zoom: 5,
});

// Then add the 'basemap' tile layer to the map.
basemap.addTo(myMap)
// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.


// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {fillColor:getColor(feature.geometry.coordinates[2]),
      radius:getRadius(feature.properties.mag),
      fillOpacity:1,
      color:'black',
      weight:'2'
    }
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth>=90){
      return '#ea2c2c';}
    else if (depth>=70){
      return '#ea822c';
    }
    else if (depth>=50){
      return '#ee9c00';
    }
    else if (depth>=30){
      return '#eecc00';
    }
    else if (depth>=10){
      return '#d4ee00';
    }
    else
      return '#98ee00';
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return Math.sqrt(magnitude)*7.5

  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    style:styleInfo,
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
    
     return new L.CircleMarker(latlng,{style:styleInfo(feature)});
    },
    // Set the style for each circleMarker using our styleInfo function.
    
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
        layer.bindPopup('<h1>'+"Magnitude: "+feature.properties.mag+"</h1><h2>"+"Location:"+feature.geometry.coordinates[0]+','+feature.geometry.coordinates[1]+'</h2>');   }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.

  let legend = L.control({position: "bottomright"});

  legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
  
      // Initialize depth intervals and colors for the legend
      let limits = [90, 70, 50, 30, 10, -10];
      let labels = ['#ea2c2c', '#ea822c', '#ee9c00', '#eecc00', '#d4ee00', '#98ee00'];
      let elements=[]
      // Loop through our depth intervals to generate a label with a colored square for each interval
      for (let i = 0; i < limits.length; i++) {
        let element=''
        if(limits[i]==90){
          element='90+';
        }
        else if (limits[i]==-10){
          element='<10';
        }
        else {
          element=limits[i-1]+'-'+limits[i];
        }
          elements.push("<li style=\"background-color: " + labels[i] + "; top:0px;bottom:0px;\">"+"</li>"+element+"<br>");
      }
      div.innerHTML+='<ul>'+elements.join("")+"</ul>"
      console.log(div.innerHTML)
      return div;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);
  
  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.


    // Then add the tectonic_plates layer to the map.

  });
});
