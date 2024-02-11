import { useState } from 'react';
import { socket } from '../App'; // Assuming you have the socket instance exported from 'App'
import ScoreBoard from './ScoreBoard';

const CreateQuestion = ({ roomId }: { roomId: string }) => {
    const [title, setTitle] = useState("");
    const [option1, setOption1] = useState("");
    const [option2, setOption2] = useState("");
    const [option3, setOption3] = useState("");
    const [option4, setOption4] = useState("");
    const [answer, setAnswer] = useState("0");
    const [isStart, setIsStart] = useState(false);
    const [addAnother, setAddAnother] = useState(false);
    const [alert, setAlert] = useState(false);
    const [msg, setMsg] = useState("");
    // const [disable, setDisable] = useState(false);
    const [cnt, setCnt] = useState(0);
    const createQuestion = () => {
        if (!title || !option1 || !option2 || !option3 || !option4) {
            setAlert(true);
            setMsg('Select All The Options ')

            return;
        }
        const question = {
            id: cnt,
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
        setCnt(cnt + 1);

        socket.emit('addQuestion', { roomId, question });

        // Clear the form after submitting
        setTitle("");
        setOption1("");
        setOption2("");
        setOption3("");
        setOption4("");
        setAnswer("0");

        // Set addAnother to true to allow the user to add another question
        // setAddAnother(true);
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
    const start = () => {
        setIsStart(true);
        socket.emit('startQuiz', { roomId });
    }

    return (
        <div className="mt-28 items-center justify-center h-screen">
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
            {!isStart && <div>
                <h2 className="text-3xl font-bold mb-4">Add Question {cnt + 1}</h2>
                <div className="bg-gray-300 p-8 rounded border border-cyan-600 md:w-[500px]">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <label htmlFor="title" className="text-sm font-bold">Title:</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-2/3 h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter Title"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="option1" className="text-sm font-bold">Option 1:</label>
                            <input
                                id="option1"
                                type="text"
                                value={option1}
                                onChange={(e) => setOption1(e.target.value)}
                                className="w-2/3 h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter Option 1"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="option2" className="text-sm font-bold">Option 2:</label>
                            <input
                                id="option2"
                                type="text"
                                value={option2}
                                onChange={(e) => setOption2(e.target.value)}
                                className="w-2/3 h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter Option 2"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="option3" className="text-sm font-bold">Option 3:</label>
                            <input
                                id="option3"
                                type="text"
                                value={option3}
                                onChange={(e) => setOption3(e.target.value)}
                                className="w-2/3 h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter Option 3"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="option4" className="text-sm font-bold">Option 4:</label>
                            <input
                                id="option4"
                                type="text"
                                value={option4}
                                onChange={(e) => setOption4(e.target.value)}
                                className="w-2/3 h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Enter Option 4"
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            <label htmlFor="answer" className="text-sm font-bold">Correct Answer:</label>
                            <select
                                id="answer"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                className="w-2/3 h-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            >
                                <option value="0">Option 1</option>
                                <option value="1">Option 2</option>
                                <option value="2">Option 3</option>
                                <option value="3">Option 4</option>
                            </select>
                        </div>
                        <button
                            onClick={createQuestion}
                            // disabled={disable}
                            className="w-full h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
                        >
                            Submit Question
                        </button>
                        {addAnother && <button onClick={handleAddAnother} className="w-full h-10 mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline">
                            Add Another Question
                        </button>}
                    </div>


                </div></div>}

            {!isStart && <button onClick={start} className="mt-4 p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Start Quiz
            </button>}

            {isStart && <ScoreBoard msg={"LIVE_SCORES"} />
            }

        </div>
    );
};

export default CreateQuestion;
