// OFF / DIMM BUTTONS
let simple_buttons = Array();
simple_buttons.push(document.getElementById("off"));
simple_buttons.push(document.getElementById("dimm"));
// RAINBOW button
let rainbow = document.getElementById("rainbow");

// speed slider
let slider_container = document.getElementById("slider-container");
let slider = document.getElementById("slider");
let output = document.getElementById("slider-output");

// hide slider by default and set default value
slider_container.style.display = "none";
output.innerHTML = slider.value;

// colorpicker
let color = document.getElementById("colorwheel");

// sends a GET request to server
function sendRequest(destination, args="") {
    let url = destination;
    let request = new XMLHttpRequest();
    if(args != "") {
        url += "/" + args;
    }
    console.log(url);
    request.open("GET", url);
    request.send();
}

// OFF / DIMM BUTTONS
simple_buttons.forEach(button => {
    button.addEventListener("click", event => {
        // disable rainbow speed slider when visible
        if(slider_container.style.display === "block") {
            slider_container.style.display = "none";
        }
        // GET request to server
        const destination = event.target.id;  // off | dimm
        sendRequest(destination);
    });
});

// update slider value and send new GET request
slider.addEventListener("input", event => {
    const value = event.target.value;
    output.innerHTML = value;
    const speed = 1/(value**2);
    const destination = "rainbow";
    sendRequest(destination, speed)
});

// RAINBOW button
rainbow.addEventListener("click", event => {
    // show speed slider
    if(slider_container.style.display === "none") {
        slider_container.style.display = "block";
    }
    // GET request to server
    const speed = 1 / (slider.value ** 2);
    const destination = "rainbow";
    sendRequest(destination, speed)
});

// colorpicker send new request on input
color.addEventListener("input", event => {
    // disable rainbow speed slider when visible
    if(slider_container.style.display === "block") {
        slider_container.style.display = "none";
    }
    // GET request to server
    const destination = "/colorwheel";
    const value = event.target.value.slice(1);
    sendRequest(destination, value);
});