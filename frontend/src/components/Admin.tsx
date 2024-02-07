import React, { useState } from 'react'
import { io } from 'socket.io-client';
import { socket } from '../App';
import CreateQuestion from './CreateQuestion';
// const socket = io('http://localhost:3000');

const Admin = () => {
    const [roomId, setRoomId] = useState("");
    const [admin, setAdmin] = useState("");
    const [created, setCreated] = useState(false)
    const createRoom = () => {
        console.log(roomId);
        console.log("reached")
        socket.emit('createRoom', ({
            roomId, admin
        }));
        socket.on('quizCreated', () => {
            setCreated(true);
        })

    }

    const start = () => {
        socket.emit('startQuiz');
    }
    return (

        <div>
            {!created && <>
                roomId : < input type="text" onChange={(e) => {
                    setRoomId(e.target.value);
                }} />
                <br />
                admin name:<input type='text' onChange={(e) => {
                    setAdmin(e.target.value);
                }} />

                <button onClick={createRoom}> submit</button>
            </>}
            {created && <CreateQuestion roomId={roomId} />}
            <button onClick={start}> start quiz</button>

        </div >

    )
}



export default Admin
