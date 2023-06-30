"use strict";
function setLocation(latitude, longitude) {
    const map = L.map('map').setView([latitude, longitude], 14);
    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return tiles;
}
function showResults(ip, location, timezone, isp) {
    const ipField = document.querySelector('[data-ip]');
    const locationField = document.querySelector("[data-location]");
    const timezoneField = document.querySelector("[data-timezone]");
    const ispField = document.querySelector("[data-isp]");
    ipField.innerText = ip;
    locationField.innerText = location;
    timezoneField.innerText = `UTC ${timezone}:00`;
    ispField.innerText = isp;
}
async function getData(request) {
    try {
        const response = await fetch(request);
        const data = await response.json();
        if (response.status === 200) {
            showResults(data.ip, `${data.state_prov} ${data.city} ${data.zipcode}`, data.time_zone.offset, data.isp);
            setLocation(data.latitude, data.longitude);
        }
        else
            alert(data.error.message);
    }
    catch (error) {
        alert(`Error, ${error}`);
    }
}
function searchRequestInput(input) {
    const url = 'https://api.ipgeolocation.io/ipgeo';
    const apiKey = '3be4190ce48249fdbfbcf1e8176b257e';
    return new Request(`${url}?apiKey=${apiKey}&${input}`);
}
const confirmInputButton = document.querySelector(".input-confirm");
confirmInputButton.addEventListener("click", function () {
    const searchInputField = document.querySelector('.input-field');
    const inputValue = searchInputField.value;
    if (inputValue === '')
        return;
    let searchRequest = searchRequestInput(inputValue);
    getData(searchRequest);
});
//# sourceMappingURL=index.js.map