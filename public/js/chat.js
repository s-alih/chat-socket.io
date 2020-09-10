

const socket =  io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages')

//templets 
const messageTemplet = document.querySelector('#message-templet').innerHTML
const locationTemplet = document.querySelector('#location-templet').innerHTML

socket.on('msg',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplet,{
    message
})
    $messages.insertAdjacentHTML('beforeend',html)
})
socket.on('locationMessage',(url) => {
    console.log(url)
    const html = Mustache.render(locationTemplet,{
        url
    })
    $messages.insertAdjacentHTML('beforeend',html)
})


$messageForm.addEventListener('submit',(e) => {
    e.preventDefault()
    //disable
    $messageFormButton.setAttribute('disabled','disabled')
    const messageData = e.target.elements.message.value
    socket.emit('message',messageData,(error) => {
        $messageFormButton.removeAttribute('disabled','disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message sended macha')
    })
   
})

$locationButton.addEventListener('click',() => {
    if(!navigator.geolocation){
        return alert('no geolocation support macha')
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
       socket.emit('sendLocation', {
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
    },(message) => {
        $locationButton.removeAttribute('disabled','disabled')
        console.log(message)
    })
    })
})

