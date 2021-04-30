// -- Dom Objects --

// OFF / DIMM BUTTONS
let off_button = document.getElementById("off");
let dimm_button = document.getElementById("dimm");
// RAINBOW BUTTON
let rainbow = document.getElementById("rainbow");
// SPEED SLIDER
let slider_container = document.getElementById("slider-container");
let slider = document.getElementById("slider");
let output = document.getElementById("slider-output");
// COLOR INPUT
let color = document.getElementById("colorwheel");
// CONNECTION BOX
let connection_status = document.getElementById("connection-status");
// hide slider by default and set default value
slider_container.style.display = "none";
output.innerHTML = slider.value;


//  -- Helper Functions --
//#region 

// sends a GET request to server
function sendRequest(destination, args="") {
    let url = destination;
    let request = new XMLHttpRequest();
    if(args != "") {
        url += "/" + args;
    }
    //console.log(url);
    request.open("GET", url);
    request.send();
}

// calculate speed
function getSpeed() {
    // make value small quickly
    let speed = 1 / (slider.value ** 2);
    // round
    speed = Math.ceil(speed * 100000) / 100000;
    return speed;
}

//#endregion


//  -- Event Handlers for all the buttons --
//#region 

// OFF BUTTON
off_button.addEventListener("click", () => {
    // disable rainbow speed slider when visible
    if(slider_container.style.display === "block") {
        slider_container.style.display = "none";
    }
    // GET request to server
    const destination = "off";
    sendRequest(destination);
});

// DIMM BUTTON
dimm_button.addEventListener("click", () => {
    // disable rainbow speed slider when visible
    if(slider_container.style.display === "block") {
        slider_container.style.display = "none";
    }
    // GET request to server
    const destination = "dimm";
    sendRequest(destination);
});

// RAINBOW BUTTON
rainbow.addEventListener("click", event => {
    // show speed slider
    if(slider_container.style.display === "none") {
        slider_container.style.display = "block";
    }
    // GET request to server
    const destination = "rainbow";
    const speed = getSpeed();
    sendRequest(destination, speed);
});

// SPEED SLIDER
slider.addEventListener("input", event => {
    // display slider value
    const value = event.target.value;
    output.innerHTML = value;
    // GET request to server
    const destination = "rainbow";
    const speed = getSpeed();
    sendRequest(destination, speed)
});

// COLOR PICKER
color.addEventListener("input", event => {
    // disable rainbow speed slider when visible
    if(slider_container.style.display === "block") {
        slider_container.style.display = "none";
    }
    // GET request to server
    const destination = "/colorwheel";
    // remove leading '#'
    const color = event.target.value.slice(1);
    sendRequest(destination, color);
});

//#endregion