// Global var's and settings

const url = 'https://api.ipgeolocation.io/ipgeo'
const apiKey = '3be4190ce48249fdbfbcf1e8176b257e'

const map = L.map('map').setView([1, 1], 2)
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map)

const confirmInputButton = document.querySelector(".input-confirm") as HTMLButtonElement

function setLocation (latitude: number, longitude: number) {
  map.flyTo([latitude, longitude], 14)
  L.marker([latitude, longitude]).addTo(map)
}

// General functions

function showResults (ip: string, location: string, timezone: string, isp: string) {
  const ipField = document.querySelector('[data-ip]') as HTMLElement
  const locationField = document.querySelector("[data-location]") as HTMLElement
  const timezoneField = document.querySelector("[data-timezone]") as HTMLElement
  const ispField = document.querySelector("[data-isp]") as HTMLElement

  ipField.innerText = ip
  locationField.innerText = location
  timezoneField.innerText = `UTC ${timezone}:00`
  ispField.innerText = isp
}

function searchRequestInput(input: string) {
    return new Request(`${url}?apiKey=${apiKey}&ip=${input}`)
}

async function getAndSetData(request: Request) {
  
  try {
    const response = await fetch(request)
    const data = await response.json()
    if(response.status === 200) {
      showResults(data.ip, 
                  `${data.state_prov} ${data.city} ${data.zipcode}`, 
                  data.time_zone.offset, 
                  data.isp)
      setLocation(data.latitude, data.longitude)
    }
    else alert(data.error)
  }
  catch(error) {
    alert(error)
  }
  
}

// Event listener - search by IP

confirmInputButton.addEventListener("click", function() {
  const searchInputField = document.querySelector('.input-field') as HTMLInputElement
  let inputValue = searchInputField.value

  if (inputValue === '') return
  if (!/\d\d?\d?\.\d\d?\d?\.\d\d?\d?\.\d\d?\d?/.test(inputValue)) return alert('Input correct Ip address')

  let searchRequest = searchRequestInput(inputValue)
  return getAndSetData(searchRequest)
})

// On startup locate client IP

getAndSetData(new Request(`${url}?apiKey=${apiKey}`))