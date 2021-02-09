console.log("hi")

const locationForm = document.querySelector("#set-location")
const locationButton = document.querySelector("#get-iss-location")
const infoPanel = document.querySelector("#info-panel")
const peopleUrl = "http://api.open-notify.org/astros.json"
const passUrl = 'http://api.open-notify.org/iss-pass.json?lat=LAT&lon=LON'
const locationUrl = "http://api.open-notify.org/iss-now.json"
const numInSpace = document.querySelector("#num-in-space")
const crewDiv = document.querySelector("#crew-div")
const locationDiv = document.querySelector("#iss-location")
const passDiv = document.querySelector('#iss-pass-times')
const passTimeForm = document.querySelector("#set-location")


const fetchPeople = _ => {
  return fetch(peopleUrl)
  .then( response => response.json() )
}

const fetchLocation = _ => {
  return fetch(locationUrl)
  .then( response => response.json() )
}

const displayPeople= peopleData => {
  numInSpace.textContent = peopleData.number
  
  let tableHeading = document.createElement("h2")
  tableHeading.textContent = "Space Walkers!"
  let table = document.createElement("table")
  for (person of peopleData.people) {
    let row = document.createElement("tr")
    let spacePerson = document.createElement("td")
    spacePerson.className = "astronaut"
    spacePerson.textContent = person.name 

    let spaceCraft = document.createElement("td")
    spaceCraft.className = "space-craft"
    spaceCraft.textContent = `On Board: ${person.craft}`

    row.append(spacePerson, spaceCraft)
    table.append(row)
    crewDiv.append(tableHeading, table)

  }
}

const displayLocation = e => {
  fetchLocation().then( data => {
    Array.from(locationDiv.children).forEach(child => child.remove())
    let heading = document.createElement("h2")
    heading.textContent = "Current ISS Location:"

    let time = document.createElement("h3")
    time.textContent = new Date(data.timestamp * 1000)

    let longitude = document.createElement("h3")
    longitude.textContent = "Longitude: "
    
    let longcoords = document.createElement("span")
    longcoords = data.iss_position.longitude
    longitude.append(longcoords)

    let latitude = document.createElement("h3")
    latitude.textContent = "Latitude: "

    let latcoords = document.createElement("span")
    latcoords = data.iss_position.latitude
    latitude.append(latcoords)

    locationDiv.append( heading, time, latitude, longitude)
  } )
}

const fetchPassTimes = (lat, lon) => {
  return fetch(`http://api.open-notify.org/iss-pass.json?lat=${lat}&lon=${lon}`)
  .then( response => response.json() )
}

const displayPassTimes = e => {
  e.preventDefault()
  let lat = e.target.latitude.value
  let lon = e.target.longitude.value

  fetchPassTimes(lat, lon).then( data => {
      let heading = document.createElement('h2')
      heading.textContent = "Upcoming Pass Times for: "
      console.log(data)
      let coords = document.createElement("h3")
      coords.textContent = `${lat}, ${lon}`
      let hr = document.createElement('hr')
      let table = document.createElement('table')
      let thead = document.createElement("thead")
      let headRow = document.createElement("tr")
      let riseHeading = document.createElement("th")
      let durationHeading = document.createElement("th")
      headRow.append(riseHeading, durationHeading)
      thead.append(headRow)
      let tbody = document.createElement('tbody')

      for (pass of data.response) {
        let row = document.createElement('tr')
        let riseTime = document.createElement('td')
        let duration = document.createElement('td')
        riseTime.textContent = new Date(pass.risetime*1000)
        duration.textContent = `${parseInt(pass.duration) / 60} Minutes`
        row.append(riseTime, duration)
        tbody.append(row)
      }
      table.append(thead,tbody)
      passDiv.append(heading, coords, hr, table)
    })
}



locationButton.addEventListener('click', displayLocation)
passTimeForm.addEventListener('submit', displayPassTimes)
fetchPeople().then(displayPeople)
displayLocation()

// Longitude: 129.1349
// Latitude: -40.7800