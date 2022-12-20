'use strict'


const apiKey = 'b6224d5fb17b29c68b33fe072ff2f6f7'


//Async

async function fetchWeather(lat, lon){
    //const
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`)
    const jsno = await data.json()


    console.log(lat, lon);
    // const weatherDescr = jsno.current.weather[0].main
    const deg = Math.round(jsno.current.temp)
    const realDeg = Math.round(jsno.current.feels_like)
    const weatherDesc = jsno.current.weather[0].main
    const sunset = jsno.current.sunset
    const sunsetTime = new Date(sunset * 1000)
    const currSunset = `${sunsetTime.getHours()}:${sunsetTime.getMinutes()} PM`

    const sunrise = jsno.current.sunrise
    const sunriseTime = new Date(sunrise * 1000)
    const currSunrise = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()} AM`


    const duraction = `${sunsetTime.getHours() - sunriseTime.getHours()}:${sunsetTime.getMinutes() - sunriseTime.getMinutes() < 10 ? '0' + (sunsetTime.getMinutes() - sunriseTime.getMinutes()) : sunsetTime.getMinutes() - sunriseTime.getMinutes()} hr`

    const currHour = jsno.current.dt
    const hour = new Date(currHour * 1000).getHours()

    //functions
    tabs('#tabs', '#tabsBtn', '.day', 'active-day', 'active');
    getMonthDay()
    getDate()
    getDayOfWeek()
    setDegree(`${deg - 273}°C`, `${realDeg - 273}°C`, weatherDesc)
    setDaysAction(currSunrise, currSunset, duraction)
    getHours(hour, '#hours')
}




const hourlyDescrEl = document.querySelectorAll('#hourlyDescr')
const hourlyTempEl = document.querySelectorAll('#hourlyTemp')
const horlyRealTemEl = document.querySelectorAll('#realTemp')
const windSpeedEl = document.querySelectorAll('#windSpeed')
const hourlyImgEl = document.querySelectorAll('#hourlyImg')

async function getWeatherHours(lat, lon) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`)
    const jsno = await data.json()

    let descr = ''
    let temp = ''
    let realTemp = ''
    let speed = ''
    for(let i = 0; i < hourlyDescrEl.length; i++){
        descr = jsno.hourly[i].weather[0].main
        let weatherImg = descr.toLowerCase()
        hourlyImgEl[i].src = `./assets/img/${weatherImg}.png`
        hourlyDescrEl[i].textContent = descr
        temp = Math.round(jsno.hourly[i].temp) - 273
        hourlyTempEl[i].textContent = `${temp}°C`
        realTemp = Math.round(jsno.hourly[i].feels_like) - 273
        horlyRealTemEl[i].textContent = `${realTemp}°C`
        speed = jsno.hourly[i].wind_speed
        windSpeedEl[i].textContent = `${speed}km/h`
    }
}






//getWeatherDays 

const daysWeatherTemp = document.querySelectorAll('#daysTemp') 
const daysWeatherDescr = document.querySelectorAll('#daysWeatherDescr')
const daysWeatherImg = document.querySelectorAll('#daysWeatherImg')


async function getWetherDays(lat, lon) {
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`)
    const jsno = await data.json()

    let temp = ''
    let descr = ''
    let weatherDesc = ''

    for(let i = 0; i < daysWeatherTemp.length; i++){
        weatherDesc = jsno.daily[i].weather[0].main
        let weatherImg= weatherDesc.toLowerCase()
        daysWeatherImg[i].src = `./assets/img/${weatherImg}.png`
        temp = Math.round(jsno.daily[i].temp.max) - 273
        descr = jsno.daily[i].weather[0].description
        daysWeatherTemp[i].textContent = `${temp}°C`
        daysWeatherDescr[i].textContent = descr
    }
}




//Tabs

function tabs(tabs, tabsHeader, tabsContent, activeClass, active) {
    const tabsElem = document.querySelector(tabs);
    const tabsHeaderElems = document.querySelectorAll(tabsHeader);
    const tabsContentElems = document.querySelectorAll(tabsContent);
    

    const removeTabs = () => {
        tabsHeaderElems.forEach(elem => {
            elem.classList.remove(active);
        });
        tabsContentElems.forEach(elem => {
            elem.classList.remove(activeClass);
        });
    }

    const addTabs = (index = 0) => {
        tabsHeaderElems[index].classList.add(active);
        tabsContentElems[index].classList.add(activeClass);
    }

    removeTabs();
    addTabs();

    tabsElem.addEventListener('click', e => {
        const {target} = e;
        tabsHeaderElems.forEach((elem, index) => {
            if(elem === target) {
                removeTabs();
                addTabs(index);
            }
        })
    }) 
}





//Const

const date = document.querySelector('#date')
const newDate = new Date()
const dateInSec = newDate.getTime() 



//getDate

function getDate() {
    const currDate = `${newDate.getDate() < 10  ? '0' + newDate.getDate() : newDate.getDate()}.${newDate.getMonth() + 1 < 10 ? '0' + newDate.getMonth() + 1 : newDate.getMonth() + 1}.${newDate.getFullYear()}`
    date.textContent = currDate
}




const daysDate = document.querySelectorAll('#daysDate')

const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const dayOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const daysWeek = document.querySelectorAll('#dayWeek')

//getMonthDay


function getMonthDay() {
    const currMonth = newDate.getMonth()
    const monthNum = month[currMonth]
    let data = []
        for(let i = newDate.getDate() ; i < newDate.getDate() + 5; i++){
            data.push(i)
        }
        for(let i = 0; i < daysDate.length; i++){
            daysDate[i].textContent = `${monthNum} ${data[i]}`
        }
}

//getDayOfWeek

function getDayOfWeek() {
    let day = ''
    const longWeek = 7
    let weekDay = []
    switch(newDate.getDay()){
        case 0: day = 6;break
        case 1: day = 0;break
        case 2: day = 1;break
        case 3: day = 2;break
        case 4: day = 3;break
        case 5: day = 4;break
        case 6: day = 5;break
    }
    for(let i = day; i < day + 5; i++){
        if(i < 7){
            weekDay.push(i)
        }
        else if(i >= 7){
            weekDay.push(Math.abs(longWeek - i))
        }
    }
    for(let i = 0; i < daysWeek.length; i++){
        if(i === 0){
            daysWeek[0].textContent = 'today'
        }
        if(i > 0){
            daysWeek[i].textContent = dayOfWeek[weekDay[i]]
        }  
    }
}


//setDegree

const degree = document.querySelector('#degree')
const realyDegree = document.querySelector('#realDegree')
const weatherDescr = document.querySelector('#weatherDescr')
const weatherImg = document.querySelector('#weatherImg')

function setDegree(deg, realDeg, weatherDesc) {
    degree.textContent = deg
    realyDegree.textContent = `Real feel ${realDeg}`
    weatherDescr.textContent = weatherDesc

    let weatherDescrCopy = weatherDescr.textContent.toLowerCase()
    
    weatherImg.src = `./assets/img/${weatherDescrCopy}.png`
}


//set daysAction

const sunrise = document.querySelector('#sunrise')
const sunnset = document.querySelector('#sunnset')
const duraction = document.querySelector('#duraction')

function setDaysAction(sunUp, sunDown, dur){
    sunrise.textContent = sunUp
    sunnset.textContent = sunDown
    duraction.textContent = dur
} 


//get hours

// const hour = document.querySelectorAll('#hours')

function getHours(currHour, block) {
    let elem = document.querySelectorAll(block)
    let hours = currHour
    let halfHour = 13
    let dayLong = 25
    let hoursCurr = ''
    for(let i = 0; i < elem.length; i++){
        hours++
        if(hours === halfHour){
            elem[i].textContent = `12pm`
        }else if((hours - halfHour) === 12){
            elem[i].textContent = `12am`
        }else if(hours > halfHour && hours < dayLong){
            hoursCurr = `${hours - halfHour}`  
            elem[i].textContent = `${hoursCurr}pm`
        }else if(hours > dayLong){
            hoursCurr = `${hours - dayLong}`
            elem[i].textContent = `${hoursCurr}am`
        }else if(hours < halfHour){
            elem[i].textContent = `${hours}pm`
        }
    }

}


const search = document.querySelector('#search')
const tabsBtn = document.querySelectorAll('#tabsBtn')

const days = document.querySelectorAll('.day')
const textEl = document.querySelectorAll('#textEl')
const errorBlock = document.querySelector('#errorBlock')

function errorImg() {
    textEl[0].textContent = `${search.value} could not be found`
    textEl[1].textContent = 'Please enter a different location'

    errorBlock.classList.add('error-active')
    days.forEach(item => {
        item.classList.remove('active-day')
    })
    tabsBtn.forEach(elem => {
        elem.disabled = true
        elem.classList.remove('active')
    })
}




document.addEventListener('readystatechange', e => {
    if(getLocation()){
        getLocation()
    }
})


function getLocation() {
    return navigator.geolocation.getCurrentPosition(location => {
        const lat = location.coords.latitude
        const lon = location.coords.longitude
        fetchWeather(lat, lon)
        getWeatherHours(lat, lon)
        getWetherDays(lat, lon)
        dayClick(lat, lon)
    })
}

search.addEventListener('change', e => {
    e.preventDefault()
    getNameOfCity(search.value)
})    



const daysForc = document.querySelectorAll('#daysWeatherForc')
const daysTemp = document.querySelectorAll('#daysWeatherTemp')
const daysFeel = document.querySelectorAll('#daysWeatherFeel')
const daysWind = document.querySelectorAll('#daysWeatherWind')
const daysImg = document.querySelectorAll('#hourlyWeatherImg')


function getLocationInString(lat, lon) {
    const currLat = lat
    const currLon = lon
    dayClick(currLat, currLon)
}



async function getWeatherForDay(lat, lon, index) {
    
    const data = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely, hourly, daily&appid=${apiKey}`)
    const jsno = await data.json()
    let forc = ''
    let temp = ''
    let feel = ''
    let wind = ''
    let dayWeather = ''
    let dayOfWeek = ['morn', 'day', 'eve', 'night'] 
    let forcCopy = ''
    
    
    for(let i = 0; i < daysForc.length ; i++){
        dayWeather = dayOfWeek[i]
        if(dayWeather === 'morn'){
            temp = `${Math.round(jsno.daily[index].temp.morn) - 273}°C`
            feel = `${Math.round(jsno.daily[index].feels_like.morn) - 273}°C`
        } 
        if(dayWeather === 'day'){
            temp = `${Math.round(jsno.daily[index].temp.day) - 273}°C`
            feel = `${Math.round(jsno.daily[index].feels_like.day) - 273}°C`
        }
        if(dayWeather === 'eve'){
            temp = `${Math.round(jsno.daily[index].temp.eve) - 273}°C`
            feel = `${Math.round(jsno.daily[index].feels_like.eve) - 273}°C`
        }
        if(dayWeather === 'night'){
            temp = `${Math.round(jsno.daily[index].temp.night) - 273}°C`
            feel = `${Math.round(jsno.daily[index].feels_like.night) - 273}°C`
        }
        forc = jsno.daily[index].weather[0].main
        forcCopy = forc.toLowerCase()
        wind = `${jsno.daily[index].wind_speed}km/h`
        
        
        daysImg[i].src = `./assets/img/${forcCopy}.png`
        daysForc[i].textContent = forc
        daysTemp[i].textContent = temp
        daysFeel[i].textContent = feel
        daysWind[i].textContent = wind
    }
}

async function getNameOfCity(name) {
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}`)
    if(!(data.status === 200 && data.ok)){
        errorImg()
    }else {
        errorBlock.classList.remove('error-active')
        tabsBtn.forEach(elem => {
            elem.disabled = false
        })
        const jsno = await data.json()
        const lat = jsno.coord.lat
        const lon = jsno.coord.lon
        fetchWeather(lat, lon)
        getWeatherHours(lat, lon)
        getWetherDays(lat, lon)
        dayClick(lat, lon)
    }
}


const dayBlock = document.querySelectorAll('#dayBlock')

function clearDays() {
    dayBlock.forEach(item => {
        item.classList.remove('weather-active')
    })
}


function dayClick(lat, lon){
    dayBlock.forEach((item, index) => {
        if(!index) {
            clearDays()
            getWeatherForDay(lat, lon, 0)
            item.classList.add('weather-active')
        }
        if(index > -1){
            item.addEventListener('click', () => {
                clearDays()
                getWeatherForDay(lat, lon, index)
                item.classList.add('weather-active')
            })
        }
    })
}





