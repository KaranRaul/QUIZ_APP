"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const Quiz_1 = require("./Quiz");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");
const httpServer = createServer();
const express = require('express');
const app = express();
app.listen(3000);
app.get('/', (req, res) => {
    res.send('hello world');
})
exports.io = new Server(httpServer, {
    cors: "*",
});
const quizzes = {}; // Store rooms using room ID as key
// let quiz: Quiz;
exports.io.on('connection', (socket) => {
    // console.log('connected with id ' + socket.id);
    socket.on('createRoom', (data) => {
        const existingQuiz = quizzes[data.roomId];
        if (existingQuiz) {
            // console.log('Quiz with the same name already exists');
            socket.emit('quizExists', data.roomId);
        }
        else {
            const newQuiz = new Quiz_1.Quiz(data.roomId, data.admin, socket);
            quizzes[data.roomId] = newQuiz;
            // console.log('Quiz created with ID: ' + data.roomId);
            socket.emit('quizCreated', data.roomId);
            socket.join(data.roomId);
        }
    });
    socket.on('test', () => {
        console.log("test called");
    });
    socket.on('addQuestion', (data) => {
        const { roomId, question } = data;
        const quiz = quizzes[roomId];
        if (quiz) {
            console.log('addQuestion event received for room:', roomId, 'Question:', question);
            quiz.addQuestion(question);
        }
        else {
            console.log("Quiz not initialized yet.");
        }
    });
    socket.on('addUser', (data) => {
        const { roomId, id } = data;
        const quiz = quizzes[roomId];
        console.log("add user Called");
        if (quiz) {
            quiz.addUser(id);
            socket.join(roomId);
            const score = quiz.getScores();
            console.log("room id" + quiz.roomId);
            console.log("score" + score);
            socket.emit('userAdded');
        }
        else {
            socket.emit('userNotAdded');
            console.log("Quiz not initialized yet.");
        }
    });
    socket.on('startQuiz', (data) => {
        const { roomId } = data;
        const quiz = quizzes[roomId];
        if (quiz) {
            quiz.startQuiz();
            exports.io.to(roomId).emit('started'); // Emit 'started' event to all sockets in the room
        }
        else {
            // console.log("Quiz not created.");
        }
    });
    socket.on('submit', (data) => {
        const { userId, problemId, optionSelected, roomId } = data;
        const quiz = quizzes[roomId];
        if (quiz) {
            quiz.selectAnswer(userId, problemId, optionSelected);
            console.log('Updted score');
            const score = quiz.getScores();
            console.log(score);
        }
    });
});
instrument(exports.io, {
    auth: false,
    mode: "development",
});
// httpServer.listen(3000);
