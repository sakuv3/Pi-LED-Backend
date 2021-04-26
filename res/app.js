// array of buttons
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", event => {
        // GET request to server
        let destination = event.target.id;  // off | dimm | rainbow
        let request = new XMLHttpRequest();
        request.onreadystatechange = res => {};
        request.open("GET", destination);
        request.send();
    });
});

// colorpicker
const color = document.getElementById("colorwheel");
// send new request on input
color.addEventListener("input", event => {
    const destination = "/colorwheel/";
    let request = new XMLHttpRequest();
    request.onreadystatechange = responseHandler;
    value = event.target.value.slice(1);
    console.log(value);
    request.open("GET", destination + value);
    request.send();
});

// speed slider
const slider = document.getElementById("speed-slider");
const output = document.getElementById("slider-output");
// default value
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