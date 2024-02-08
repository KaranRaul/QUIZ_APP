import React, { useEffect, useState } from 'react';
import { socket } from '../App';
import ScoreBoard from './ScoreBoard';

const User = () => {
    const [userId, setUserId] = useState("");
    const [roomId, setRoomId] = useState()
    const [logged, setLogged] = useState(false);
    const [started, setStarted] = useState(false);
    const [question, setQuestion] = useState<any>();
    const [selectedOption, setSelectedOption] = useState<any>(0);
    const [quizEnded, setQuizEnded] = useState(false);
    const [disable, setDisable] = useState(false);
    // let question: any = null;
    useEffect(() => {
        socket.on('question', (q) => {
            setQuestion(q)
            setDisable(false);
            // socket.emit('submit', ({ roomId, userId, problemId: question.id, optionSelected: parseInt(selectedOption) }));
            setSelectedOption(null); // Reset selected option when a new question is received
        });
        socket.on('started', () => {
            setStarted(true);
        });

        socket.on('quizEnded', () => {
            setStarted(false);
            setQuizEnded(true);
        })
    }, []);

    const addUser = () => {
        socket.emit('addUser', { roomId, id: userId });
        socket.on('userAdded', () => {
            setLogged(true);
        });
        socket.on("userNotAdded", () => {
            setUserId("not added");
        });
    };

    const handleOptionChange = (event: any) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            // Send the selected option to the server
            socket.emit('submit', ({ roomId, userId, problemId: question.id, optionSelected: parseInt(selectedOption) }));
            setDisable(true);
        } else {
            alert('Please select an option before submitting.');
        }

    };

    return (
        <div>
            {!logged && (
                <div>
                    <h2>Add User</h2>
                    User ID: <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    <br />
                    <br />
                    Room Id:<input type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
                    <br />
                    <button onClick={addUser}>Add User</button>
                </div>
            )}

            {logged && !started && !quizEnded && <p>Waiting for quiz to start...</p>}

            {started && question && logged &&
                (
                    <div>
                        <h2>Question</h2>
                        <p>{question.title}</p>
                        <form>
                            {question.options.map((option: any) => (
                                <div key={option.id}>
                                    <input
                                        type="radio"
                                        id={option.id}
                                        name="option"
                                        value={option.id}
                                        checked={parseInt(selectedOption) === option.id}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor={option.id}>{option.title}</label>
                                </div>
                            ))}
                            <button type="button" onClick={handleSubmit} disabled={disable}>Submit</button>
                        </form>
                    </div>
                )}

            {quizEnded && <ScoreBoard />}
        </div>
    );
};

export default User;
