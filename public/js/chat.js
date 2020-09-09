const socket =  io()

socket.on('countUpdated',(count)=>{
    console.log('count succesfully updated',count)
})

document.querySelector('#incriment').addEventListener('click',() => {
    console.log('clicked')
})