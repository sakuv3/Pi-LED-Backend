// speed slider
let slider_container = document.getElementById("slider-container");
let slider = document.getElementById("slider");
let output = document.getElementById("slider-output");

// RAINBOW button
let rainbow = document.getElementById("rainbow");

// OFF / DIMM BUTTONS
let buttons = document.querySelectorAll(".simple-buttons");


// OFF / DIMM BUTTONS
buttons.forEach(button => {
    button.addEventListener("click", event => {
        // disable rainbow speed slider when visible
        if(slider_container.style.display === "block") {
            slider_container.style.display = "none";
        }
        // GET request to server
        const destination = event.target.id;  // off | dimm
        let request = new XMLHttpRequest();
        request.open("GET", destination);
        request.send();
    });
});


// speed slider
// hide slider by default and set default value
slider_container.style.display = "none";
output.innerHTML = slider.value;

// update slider value and send new GET request
slider.addEventListener("input", event => {
    const value = event.target.value;
    output.innerHTML = value;
    req_val = 1/(value**2);
    const destination = "/rainbow/";
    let request = new XMLHttpRequest();
    request.open("GET", destination + req_val);
    request.send();
});


// RAINBOW button
rainbow.addEventListener("click", event => {
    // show speed slider
    if(slider_container.style.display === "none") {
        slider_container.style.display = "block";
    }
    // GET request to server
    const speed = 1 / (slider.value ** 2);
    const destination = "rainbow/";
    let request = new XMLHttpRequest();
    request.open("GET", destination + speed);
    request.send();
});



// colorpicker
let color = document.getElementById("colorwheel");
// send new request on input
color.addEventListener("input", event => {
    // disable rainbow speed slider when visible
    if(slider_container.style.display === "block") {
        slider_container.style.display = "none";
    }
    // GET request to server
    const destination = "/colorwheel/";
    let request = new XMLHttpRequest();
    value = event.target.value.slice(1);
    console.log(value);
    request.open("GET", destination + value);
    request.send();
});