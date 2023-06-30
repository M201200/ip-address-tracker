"use strict";
const url = 'https://api.ipgeolocation.io/ipgeo';
const apiKey = '3be4190ce48249fdbfbcf1e8176b257e';
const map = L.map('map').setView([1, 1], 2);
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
const confirmInputButton = document.querySelector(".input-confirm");
function setLocation(latitude, longitude) {
    map.flyTo([latitude, longitude], 14);
    L.marker([latitude, longitude]).addTo(map);
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
function searchRequestInput(input) {
    return new Request(`${url}?apiKey=${apiKey}&ip=${input}`);
}
async function getAndSetData(request) {
    try {
        const response = await fetch(request, {
            headers: {
                "Content-Type": "application/json",
                "referrerPolicy": "no-referrer-when-downgrade",
                "Access-Control-Allow-Origin": "https://ip-address-tracker-gamma-tawny.vercel.app/",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
            }
        });
        const data = await response.json();
        if (response.status === 200) {
            showResults(data.ip, `${data.state_prov} ${data.city} ${data.zipcode}`, data.time_zone.offset, data.isp);
            setLocation(data.latitude, data.longitude);
        }
        else
            alert(data.error);
    }
    catch (error) {
        alert(error);
    }
}
confirmInputButton.addEventListener("click", function () {
    const searchInputField = document.querySelector('.input-field');
    let inputValue = searchInputField.value;
    if (inputValue === '')
        return;
    if (!/\d\d?\d?\.\d\d?\d?\.\d\d?\d?\.\d\d?\d?/.test(inputValue))
        return alert('Input correct Ip address');
    let searchRequest = searchRequestInput(inputValue);
    return getAndSetData(searchRequest);
});
getAndSetData(new Request(`${url}?apiKey=${apiKey}`));
//# sourceMappingURL=index.js.map