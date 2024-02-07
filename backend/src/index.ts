import { Socket } from "socket.io";
import { Quiz } from "./Quiz";

const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const httpServer = createServer();

export const io = new Server(httpServer, {
    cors: ['https://admin.socket.io']
});

const quizzes: Record<string, Quiz> = {}; // Store rooms using room ID as key

let quiz: Quiz;

io.on('connection', (socket: Socket) => {
    console.log('connected with id ' + socket.id);

    socket.on('createRoom', (data) => {
        const existingQuiz = quizzes[data.roomId];
        if (existingQuiz) {
            quiz = existingQuiz;
            console.log('Quiz with the same name already exists');
            socket.emit('quizExists', data.roomId);
        } else {
            const newQuiz = new Quiz(data.roomId, data.admin, socket);
            quiz = newQuiz;
            quizzes[data.roomId] = newQuiz;
            console.log('Quiz created with ID: ' + data.roomId);
            socket.emit('quizCreated', data.roomId);
        }
    });

    socket.on('test', () => {
        console.log("test called");
    });

    socket.on('addQuestion', (question) => {
        if (quiz) {
            console.log('addQuestion event received:', question);
            quiz.addQuestion(question);
        } else {
            console.log("Quiz not initialized yet.");
        }
    });
    socket.on('addUser', (id: string) => {
        console.log("add user Called");
        if (quiz) {
            quiz.addUser(id);
            const score = quiz.getScores();
            console.log(score);
            socket.emit('userAdded');
        } else {
            socket.emit('userNotAdded');
            console.log("Quiz not initialized yet.");
        }
    });

    socket.on('startQuiz', () => {
        if (quiz) {
            quiz.startQuiz();
            io.emit('started');
        }
        else
            console.log("quiz not craeted");
    })
});

instrument(io, {
    auth: false,
    mode: "development",
});

httpServer.listen(3000);
