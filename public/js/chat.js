

const socket =  io()

socket.on('msg',(message) => {
console.log(message)
})
const formData = document.querySelector('#message-form')

formData.addEventListener('submit',(e) => {
    e.preventDefault()
    const messageData = e.target.elements.message.value
    socket.emit('message',messageData,(message) => {
        console.log(message)
    })
   
})

document.querySelector('#location').addEventListener('click',() => {
    if(!navigator.geolocation){
        return alert('no geolocation support macha')
    }
    navigator.geolocation.getCurrentPosition((position) => {
       
       socket.emit('sendLocation', {
        latitude:position.coords.latitude,
        longitude:position.coords.longitude
    })
    })
})

