const users = []

const addUser = ({ id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validation
    if(!username || !room){
        return {
            error:'Username and room is required!!'
        }
    }

    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate user
    if(existingUser){
        return {
            error:'Username is already in use'
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)

    return { user }

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if( index !== -1){
        return users.splice( index , 1)[0]
    }
}

const getUser = (id) =>  users.find((user) => user.id === id)

const getUsersInRoom = (room) => users.filter((user) => user.room == room)


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}
 

