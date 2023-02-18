

var map = L.map('map').setView([39.617696, -105.603473], 17);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/satellite-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic2xvYW5tb29yZTMxIiwiYSI6ImNsYTM1anB5NzAxMmczb3BqcGlpMW9xeTYifQ.YwqRi3XLnVSFNFDmYvg9dw'
}).addTo(map);

// Create a custom control that includes a button and a container for the text
var myControl = L.Control.extend({
    options: {
      position: 'topleft'
    },
  
    onAdd: function(map) {
      // Create a container for the control
      var container = L.DomUtil.create('div', 'my-control');
  
      // Create a button and add it to the container
      var button = L.DomUtil.create('button', 'my-button', container);
      button.innerHTML = 'Info';
      
  
      // Create a container for the text and add it to the container
      var textContainer = L.DomUtil.create('div', 'my-text', container);
      textContainer.innerHTML = 'This interactive map allows climbers to create a map detailing the location, trail, and information for their area of interest. Use the toolbar on the left hand side to draw with a shape of your choice. After creating a shape or line try clicking it, this prompts a text box with questions about the boulder of interest. If you make a mistake, utilize the delete or edit option at the bottom of the tool bar. Have Fun!';
      
      // Add a click event listener to the button to toggle the display of the text container
      L.DomEvent.addListener(button, 'click', function() {
        if (textContainer.style.display === 'none') {
          textContainer.style.display = 'block';
          
        } else {
          textContainer.style.display = 'none';

        }
      });
  
      return container;
    }
  });
  
  // Add the custom control to the map
  map.addControl(new myControl());
 
//   toolbar with shape, edit etc.
var drawnItems = L.featureGroup().addTo(map);

new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : true,
        rectangle : true,     // Rectangles disabled
        circle : true,        
        circlemarker : true,  // Circle markers disabled
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);


//add this
function createFormPopup() {
    var popupContent = 
    '<form>' + 
    '    Boulder Name:<br><input type="text" id="input_name"><br>' + 
    '    Description of Boulder:<br><input type="text" id="input_desc"><br>' + 
    '    Number of routes on boulder:<input type="number" id="input_route"><br>' + 
    '    Date Boulder Discovered:<input type="date" id="input_discover"><br>' + 
    '    Date of First Ascent:<input type="date" id="input_FA"><br>' + 
    '' + 
    '    <input type="button" value="Submit" id="submit">' + 
    '    </form>' + 
    '';
    drawnItems.bindPopup(popupContent).openPopup();
}

//change the event listener code to this
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});


function setData(e) {
    if(e.target && e.target.id == "submit") {
        // Get user name and description
        var enteredUsername = document.getElementById("input_name").value;
        var enteredDescription = document.getElementById("input_desc").value;
        var enteredNumber = document.getElementById("input_route").value;
        var enteredDiscover = document.getElementById("input_discover").value;
        var enteredFA = document.getElementById("input_FA").value;
        // Print user name and description
        console.log(enteredUsername);
        console.log(enteredDescription);
        console.log(enteredNumber);
        console.log(enteredDiscover);
        console.log(enteredFA);
        // Get and print GeoJSON for each drawn layer
        drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log(drawing);
        });
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
    }
}

document.addEventListener("click", setData);

map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});

console.log(geojson);