function fetchdata()
{
    UpdateStats("GET",config.appurl + "api/update");
    document.getElementById('alert').style.display = "block";
    document.getElementById('message').innerText = 'Stats updated!'
}

function resetstats()
{
    UpdateStats("POST",config.appurl + "api/reset");
    document.getElementById('alert').style.display = "block";
    document.getElementById('message').innerText = 'Stats reset completed. Please update stats again!'
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