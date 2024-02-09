import React, { useEffect, useState } from 'react';
import { socket } from '../App';
import ScoreBoard from './ScoreBoard';
const TIME = 20;
const User = () => {
    const [userId, setUserId] = useState("");
    const [roomId, setRoomId] = useState();
    const [logged, setLogged] = useState(false);
    const [started, setStarted] = useState(false);
    const [question, setQuestion] = useState<any>();
    const [selectedOption, setSelectedOption] = useState<any>(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [disable, setDisable] = useState(false);
    const [alert, setAlert] = useState(false);
    const [msg, setMsg] = useState('');
    const [count, setCount] = useState(TIME);

    useEffect(() => {
        if (question) {
            setCount(20);
            const timer = setInterval(() => {
                setCount((prevCount) => prevCount - 1);
            }, 1000);

            if (count == 0) return () => clearInterval(timer);
        }
    }, []);

    useEffect(() => {
        socket.on('question', (q) => {
            setQuestion(q);
            setDisable(false);
            setSelectedOption(null);
        });

        socket.on('started', () => {
            setStarted(true);
        });

        socket.on('quizEnded', () => {
            setStarted(false);
            setQuizEnded(true);
        });

    }, []);

    const addUser = () => {
        socket.emit('addUser', { roomId, id: userId });
        socket.on('userAdded', () => {
            setLogged(true);
        });
        socket.on("userNotAdded", () => {
            setAlert(true);
            setMsg('Quiz Not Found With Id : ' + roomId);
        });

        socket.on('userExists', () => {
            setAlert(true);
            setMsg('User With Name' + userId + 'Already Exists');
        })
    };

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            setAlert(false);
            socket.emit('submit', ({ roomId, userId, problemId: question.id, optionSelected: parseInt(selectedOption) }));
            setDisable(true);
        } else {
            setAlert(true);
            setMsg('Select Any Option');
        }
    };

    return (
        <div className="flex container  mx-auto py-8 justify-center">
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
                {!logged && (
                    <div className='mt-[70px] rounded-md h-[300px] w-[400px] p-8 bg-gray-300' >
                        <div className=''>
                            <h2 className="text-lg font-bold mb-4">JOIN ROOM </h2>
                            <div className="flex flex-col space-y-4">
                                <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                                <input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="Room ID" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" />
                                <button onClick={addUser} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add User</button>
                            </div>
                        </div>
                    </div>
                )}
                {logged && !started && !quizEnded && <p className="text-lg font-semibold">Waiting for quiz to start...</p>}

                {started && question && logged && (
                    <div className="bg-gray-100 rounded-lg p-6 shadow-md">
                        <div> <h1> Time :: </h1>  {count}</div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800">Question</h2>
                        <p className="mb-4 text-gray-700">{question.title}</p>
                        <form>
                            {question.options.map((option: any) => (
                                <div key={option.id} className="mb-2 flex items-center">
                                    <input
                                        type="radio"
                                        id={option.id}
                                        name="option"
                                        value={option.id}
                                        checked={parseInt(selectedOption) === option.id}
                                        onChange={handleOptionChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor={option.id} className="select-none text-gray-700">{option.title}</label>
                                </div>
                            ))}

                            <button type="button" onClick={handleSubmit} disabled={disable} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Submit
                            </button>
                        </form>
                    </div>

                )}
            </div>
            {quizEnded && <ScoreBoard msg={" RESULT "} />}
        </div>
    );
};

export default User;
