

const socket =  io()

//elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//templets 
const messageTemplet = document.querySelector('#message-templet').innerHTML
const locationTemplet = document.querySelector('#location-templet').innerHTML
const sidebarTemplet = document.querySelector('#sidebar-templet').innerHTML


//options
const { username , room } = Qs.parse(location.search,{ ignoreQueryPrefix: true})

const autoscroll = () => {
    //new message element
    const newMessage = $messages.lastElementChild

    //find height of message element
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    //visible Height
    const visibleHeight = $messages.offsetHeight

    //height of message container 
    const containerHeight = $messages.scrollHeight

    //How far have i scrolled
    const scrolloffset = $messages.scrollTop + visibleHeight

    if(containerHeight-newMessageHeight <= scrolloffset){
        $messages.scrollTop = containerHeight
    }
}

socket.on('msg',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplet,{
    username:message.username,
    message:message.text,
    createdAt:moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    
})
socket.on('locationMessage',(message) => {
    console.log(message)
    const html = Mustache.render(locationTemplet,{
        username:message.username,
        url:message.url,
        createdAt:moment(message.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('roomData',({ room , users}) => {
   const html = Mustache.render(sidebarTemplet,{
       room,
       users
   })
   $sidebar.innerHTML = html
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
socket.emit('join', { username , room },(error) => {
    if(error){
        alert(error)
        location.href = '/'
    }
})

