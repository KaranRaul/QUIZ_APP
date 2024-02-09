import React, { useState } from 'react'
import { io } from 'socket.io-client';
import { socket } from '../App';
import CreateQuestion from './CreateQuestion';
// const socket = io('http://localhost:3000');

const Admin = () => {
    const [roomId, setRoomId] = useState("");
    const [admin, setAdmin] = useState("");
    const [created, setCreated] = useState(false)
    const [alert, setAlert] = useState(false);
    const [msg, setMsg] = useState('');
    const createRoom = () => {
        if (!roomId) {
            setAlert(true);
            setMsg('id cant be empty');
            return;
        }
        console.log("reached")
        socket.emit('createRoom', ({
            roomId, admin
        }));
        socket.on('quizCreated', () => {
            setCreated(true);
            setAlert(false);
            localStorage.setItem('RoomId', roomId);
        });

        socket.on('quizExists', () => {
            setAlert(true);
            setMsg('Quiz Already Exits');
        })
    }


    return (
        <div className='flex justify-center bg-gray-100 h-screen w-screen'>
            <div>
                {alert && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Error:</strong>
                        <span className="block sm:inline">{msg}</span>
                        <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg onClick={() => setAlert(false)} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path fillRule="evenodd" d="M14.348 5.652a.5.5 0 01.707.708L10.707 10l4.348 4.348a.5.5 0 11-.708.708L10 10.707l-4.348 4.348a.5.5 0 01-.708-.708L9.293 10 4.945 5.652a.5.5 0 01.708-.708L10 9.293l4.348-4.348z" clipRule="evenodd" />
                            </svg>
                        </span>
                    </div>
                )}
                {!created && <div className='mt-14 flex flex-col items-center justify-center'>
                    <div className='border-blue-400 bg-gray-300 py-4 px-8 rounded h-3/6 border border-cyan-600 ' >
                        <label htmlFor="roomId" className=" basis-0 block text-gray-700 text-sm font-bold mb-2">Room ID:</label>
                        <input
                            id="roomId"
                            type="text"
                            onChange={(e) => setRoomId(e.target.value)}
                            className=" w-60 h-14 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Enter Room ID"
                        />
                        <br />
                        <label htmlFor="adminName" className="block text-gray-700 text-sm font-bold mb-2">Admin Name:</label>
                        <input
                            id="adminName"
                            type="text"
                            onChange={(e) => setAdmin(e.target.value)}
                            className=" w-60 h-14 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Enter Admin Name"
                        />
                        <br />
                        <button
                            onClick={createRoom}
                            className="w-60 h-14 p-2 mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit
                        </button>
                    </div>


                </div>
                }
            </div>
            {created && <CreateQuestion roomId={roomId} />}

        </div >

    )
}



export default Admin
