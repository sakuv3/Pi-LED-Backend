// get request to server
function eventHandler(event) {
    let destination = event.target.id;  // off | dimm | rain
    let request = new XMLHttpRequest();
    request.onreadystatechange = responseHandler;
    request.open("GET", destination);
    request.send();
}

function responseHandler() {
    if(this.readyState == 4 && this.status == 200) {
        document.getElementById("placeholder").innerHTML = JSON.parse(this.responseText).msg;
    }
}
// array of buttons
let buttons = document.querySelectorAll("button");
console.log(buttons);
buttons.forEach(button => {
    button.addEventListener("click", eventHandler);
});