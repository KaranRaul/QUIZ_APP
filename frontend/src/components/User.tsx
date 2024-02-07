import React, { useEffect, useState } from 'react';
import { socket } from '../App';

const User = () => {
    const [userId, setUserId] = useState("");
    const [logged, setLogged] = useState(false);
    const [started, setStarted] = useState(false);
    const [question, setQuestion] = useState<any>(null);
    const [selectedOption, setSelectedOption] = useState<any>(null);

    useEffect(() => {
        socket.on('question', (q) => {
            setQuestion(q);
            console.log(question)
            setSelectedOption(null); // Reset selected option when a new question is received
        });
        socket.on('started', () => {
            setStarted(true);
        });
    }, []);

    const addUser = () => {
        socket.emit('addUser', { id: userId });
        socket.on('userAdded', () => {
            setLogged(true);
        });
        socket.on("userNotAdded", () => {
            setUserId("not added");
        });
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            // Send the selected option to the server
            socket.emit('submit', userId, question.id, parseInt(selectedOption));
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
                    <button onClick={addUser}>Add User</button>
                </div>
            )}

            {logged && !started && <p>Waiting for quiz to start...</p>}

            {started && question.options &&
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
                                        checked={selectedOption === option.id}
                                        onChange={handleOptionChange}
                                    />
                                    <label htmlFor={option.id}>{option.title}</label>
                                </div>
                            ))}
                            <button type="button" onClick={handleSubmit}>Submit</button>
                        </form>
                    </div>
                )}
        </div>
    );
};

export default User;
