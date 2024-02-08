import React, { useState } from 'react';
import { socket } from '../App'; // Assuming you have the socket instance exported from 'App'

const CreateQuestion = ({ roomId }: { roomId: string }) => {
    const [title, setTitle] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState("0");
    const [addAnother, setAddAnother] = useState(false);
    const [disable, setDisable] = useState(false);
    let cnt = 0;
    const createQuestion = () => {
        const question = {
            id: cnt++,
            title: title,
            options: [
                { id: 0, title: option1 },
                { id: 1, title: option2 },
                { id: 2, title: option3 },
                { id: 3, title: option4 }
            ],
            answer: parseInt(answer),
            submission: []
        };

        socket.emit('addQuestion', { roomId, question });

        // Clear the form after submitting
        setTitle("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setAnswer("0");

        // Set addAnother to true to allow the user to add another question
        setAddAnother(true);
    };

    const handleAddAnother = () => {
        // Reset the form and addAnother state
        setTitle("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setAnswer("0");
        setAddAnother(false);
    };

    return (
        <div>
            <h2>Add Question</h2>
            Title: <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            <br />
            Option 1: <input type="text" value={option1} onChange={(e) => setOption1(e.target.value)} />
            <br />
            Option 2: <input type="text" value={option2} onChange={(e) => setOption2(e.target.value)} />
            <br />
            Option 3: <input type="text" value={option3} onChange={(e) => setOption3(e.target.value)} />
            <br />
            Option 4: <input type="text" value={option4} onChange={(e) => setOption4(e.target.value)} />
            <br />
            Correct Answer:
            <select value={answer} onChange={(e) => setAnswer(e.target.value)}>
                <option value="0">Option 1</option>
                <option value="1">Option 2</option>
                <option value="2">Option 3</option>
                <option value="3">Option 4</option>
            </select>
            <br />
            <button onClick={createQuestion} disabled={disable}>Submit Question</button>
            {addAnother && <button onClick={handleAddAnother}>Add Another Question</button>}
        </div>
    );
};

export default CreateQuestion;
