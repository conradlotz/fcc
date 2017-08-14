function fetchdata(url)
{
    document.getElementById("btnUpdate").innerText = "Loading...";
    document.getElementById("btnUpdate").setAttribute('disabled', true);
    UpdateStats("GET",url + "api/update");
    setTimeout(function(){
        document.getElementById('alert').style.display = "block";
        document.getElementById('message').innerText = 'Stats updated!'
        location.reload();
    },12000);
}

function resetstats(url)
{
    document.getElementById("btnReset").innerText = "Loading...";
    document.getElementById("btnReset").setAttribute('disabled', true);
    UpdateStats("POST",url + "api/reset");
    setTimeout(function(){
        document.getElementById('alert').style.display = "block";
        document.getElementById('message').innerText = 'Stats reset completed. Please update stats again!'
        location.reload();
    },3000);
}

function UpdateStats(method,url) {

    var request = new XMLHttpRequest();
    request.open(method, url , true); // false for synchronous request
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var resp = request.responseText;
        } else {
            // We reached our target server, but it returned an error

        }
    };
    
    request.onerror = function() {
    // There was a connection error of some sort
    };

    request.send();
};