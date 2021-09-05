function showTime() {
    const date = new Date();
    return date.getHours() + "Hrs:" + date.getMinutes() + "Mins:" + date.getSeconds() + "Secs";
}

function showSessionExpire() {
    console.log("Activity-B: Your session expired at " + showTime());
}

console.log("Activity-A: Trigerring Activity-B at " + showTime());
setTimeout(showSessionExpire, 5000);
console.log("Activity-A: Trigerred Activity-B at " + showTime() + " will execute after 5 seconds.");

let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function makePromiseCall(methodType, url, async = true, data = null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            console.log("State changed called. Ready State: " + xhr.readyState + " Status:" + xhr.status);
            if (xhr.status.toString().match('^[2][0-9]{2}$')) {
                resolve(xhr.responseText);
            } else if (xhr.status.toString().match('^[4,5][0-9]{2}$')) {
                reject({
                    status:xhr.status,
                    statusText:xhr.statusText
                })
                console.log("XHR failed");
            }
        }
        xhr.open(methodType, url, async);
        if (data) {
            console.log(JSON.stringify(data));
            xhr.setRequestHeader("Consent-Type", "application/json");
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
        console.log(methodType + " request sent to the server");
    });
}

const getUrl = "http://127.0.0.1:3000/employees/1";
// function getUserDetails(data) {
//     console.log("Get User data: " + data)
// }
makePromiseCall("GET", getUrl, true)
    .then(responseText=>{
        console.log("Get User data: " + responseText)
    })
    .catch(error=>console.log("GET error status: "+JSON.stringify(error)));

const deleteUrl = "http://localhost:3000/employees/4";
// function userDeleted(data) {
//     console.log("User deleted: " + data)
// }
makePromiseCall("DELETE", deleteUrl, false)
    .then(responseText=>{
        console.log("User Defined: "+responseText)
    })
    .catch(error=>console.log("DELETE error status: "+JSON.stringify(error)));

const postUrl = "http://localhost:3000/employees";
const emplData = { "name": "Harry", "salary": "5000" };
// function userAdded(data) {
//     console.log("User Added: " + data)
// }
makePromiseCall("POST", postUrl, true, emplData)
    .then(responseText=>{
        console.log("User Added: "+responseText)
    })
    .catch(error=>console.log("POST error status:"+JSON.stringify(error)));
