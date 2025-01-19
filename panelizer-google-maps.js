// Author: Austin C Arledge (austin.c.arledge@gmail.com) 1 Mar 22

//
// Google Map Creation
//


// The DOM's lat value inserted there by 4D
const getStoredLat = () => {
    let lat = $("#rp_Latitude").text();

    try {
        // Attempt to convert the text into an int
        let numLat = Number(lat);

        // Return it if so
        return numLat;
    } catch(err) {
        // Inform end user of error
        alert(`The latitude coordinate is not properly defined in the DOM.\n\nThe default value will be used.`);

        // Return HEC geo location
        return 21.373313613645447;
    }
}

// The DOM's lng value inserted there by 4D
const getStoredLng = () => {
    let lng = $("#rp_Longitude").text();

    try {
        // Attempt to convert the text into an int
        let numLng = Number(lng);

        // Return it if so
        return numLng;
    } catch(err) {
        // Inform end user of error
        alert(`The longitude coordinate is not properly defined in the DOM.\n\nThe default value will be used.`);

        // Return HEC geo location
        return -157.90145860643744;
    }
}

var zoomLevel = 21;                                         // The current zoom (21 or 22 is the max)
var googleMap;                                              // Map object to be created
var geocoder;                                               // Geocoder object to be created
var script = document.createElement("script");              // Create a new script document element

// Set the script details
script.src = "https://maps.googleapis.com/maps/api/js?key=...&callback=initMap";
script.async = true;

// Create the new google map object
window.initMap = function() {
    geocoder = new google.maps.Geocoder();                                          // Address to coordinates object

    googleMap = new google.maps.Map(document.getElementById("google-map"), {        // Google Maps object
        center: { lat: getStoredLat(), lng: getStoredLng() },
        scale: 2,
        zoom: zoomLevel,
        mapTypeId: "hybrid",
        pitch: 0,
        tilt: 0,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
    });
}

// Appned the script to the document
document.head.appendChild(script);


//
// Map Details
//

var zoom, scale, pitch;
var currentLat = 21.373313613645447;

function getMeterPerPixel() {
    
    var metersPerPx =
        (156543.03392 * Math.cos((currentLat * Math.PI) / 180)) /
        Math.pow(2, zoomLevel);
    return metersPerPx;
}

const getMapZoom = () => {
    return googleMap.getZoom();
}

// This is called when the user is moving the map image around
const enableMapMoving = () => {
    areObjsEnabled = false;                                 // Disable the user from interacting with objects while they move the map
    saveObj.disableAllItems();

    $("#map-crosshair").css("visibility", "visible");       // Show the crosshairs

    // Enable the confirm map button
    $("#confirm-map-btn").css("display", "block");
    
    // Enable the Use Pictometry button
    // $("#use-pictometry-btn").css("display", "block");
    // Pictometry button removed for now

    // Disable self button
    $("#move-map-btn").css("display", "none");
    
    // Disable all holders on the left and right
    activeItemsObj.clearActiveItems();
    GUIHolder.turnOffTheseHolders(allHolders);

    // Delete all existing items
    saveObj.deleteAllItems();

    $("#google-map").css("display", "inherit");                 // Show google maps
    $("#address-div").css("display", "inherit");                // Show the address search bar
    $("#map-img").css("display", "none");                       // Hide static img

    zoomHolderObj.hideHolder();                                 // Hide the zooming holder div when moving the map
    $("#ctrl-btn-div").css("display", "none");                  // Hide the control button when moving the map
}

// This is called when the user stops editing the map image
const disableMapMoving = () => {
    areObjsEnabled = true;                                  // Enable to interact with objects after they move the map
    saveObj.enableAllItems();

    // Hide the crosshairs
    $("#map-crosshair").css("visibility", "hidden");        

    // Enable the confirm map button
    $("#confirm-map-btn").css("display", "none");

    // Disable self button
    $("#move-map-btn").css("display", "block");

    // Disable the Use Pictometry button
    // $("#use-pictometry-btn").css("display", "none");
    // Pictometry button removed for now

    GUIHolder.turnOnTheseHolders(null, newObjectRelatedHolders);

    $("#google-map").css("display", "none");                // Hide google maps
    $("#address-div").css("display", "none");               // Hide the address div
    $("#map-img").css("display", "inherit");                // Show static img

    currentLat = googleMap.getCenter().lat();               // Set the new lat for calculations later
    
    zoomLevel = getMapZoom();
    let link = makeGoogleStaticMapURL();                    // Get the full Google URL
    $("#map-img").attr("src", `${link}`);                   // Set the img to said Google URL

    zoomHolderObj.handleZoomBtns();                         // Enable/Disable the appropriate buttons
    zoomHolderObj.showHolder();                             // Show the zoom buttons

    $("#ctrl-btn-div").css("display", "flex");              // Show the control button when finished moving the map
}

// Returns the URL for a Google Static Img based off the current Google Maps geo-location
const makeGoogleStaticMapURL = () => {
    let url = "https://maps.googleapis.com/maps/api/staticmap?";
    let zoom = `&zoom=${zoomLevel}`;
    let scale = "&scale=1";
    let size = "&size=600x600";                                                                     // Size is 1/2 of actual target since scale will double size
    let mapType = "&maptype=hybrid";
    let geoCoords = `&center=${googleMap.getCenter().lat()},${googleMap.getCenter().lng()}`;
    let key = "&key=...";

    let fullUrl = url + zoom + scale + size + mapType + geoCoords + key;

    return fullUrl;
}

// Converts an address into a geo-location and then moves the Google map to said geo-location
const searchGoogleForAddress = (event) => {
    event.preventDefault();

    let address = document.getElementById("geo-code-text").value;

    geocoder.geocode( {'address' : address}, (results, status) => {
        if (status == 'OK') {
            googleMap.setCenter(results[0].geometry.location);
        } else {
            alert('Unable to look up that information! Error: ' + status);
        }
    });
}

