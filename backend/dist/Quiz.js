"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const index_1 = require("./index");
class Quiz {
    constructor(roomId, admin, io) {
        this.roomId = roomId;
        this.users = [];
        this.admin = admin;
        this.socket = io;
        this.questions = [];
        //consol.og('Room created: ' + roomId);
    }
    addUser(id) {
        const existingUser = this.users.find((user) => user.id === id);
        if (!existingUser) {
            this.users.push({ id, points: 0 });
        }
        else {
            this.socket.emit('userExists');
            //consol.og('User already exists');
        }
    }
    addQuestion(question) {
        this.questions.push(question);
    }
    startQuiz() {
        //consol.og(this.questions);
        let index = 1;
        const roomId = this.roomId;
        const scores = this.getScores();
        index_1.io.to(roomId).emit('scores', scores);
        index_1.io.to(roomId).emit('question', this.questions[0]);
        const intervalId = setInterval(() => {
            if (index < this.questions.length) {
                const currentQuestion = this.questions[index];
                index_1.io.to(roomId).emit('question', currentQuestion);
                index++;
            }
            else {
                clearInterval(intervalId);
                index_1.io.to(roomId).emit('quizEnded');
                // const leaderboard = this.getScores();
                // io.to(roomId).emit('leaderboard', leaderboard);
            }
            const scores1 = this.getScores();
            index_1.io.to(roomId).emit('scores', scores1);
        }, 20000); // 20 seconds interval
    }
    findRoom(roomId) {
        return this.roomId === roomId ? this : null;
    }
    selectAnswer(userId, problemId, optionSelected) {
        const user = this.users.find((u) => u.id === userId);
        const question = this.questions.find((q) => q.id === problemId);
        if (!user || !question) {
            //consol.og("User or Question not found.");
            return;
        }
        const isCorrect = question.answer === optionSelected;
        if (isCorrect) {
            user.points += 10;
            // console.log("Updated score:", user.points);
        }
        const submission = {
            problemId,
            userId,
            isCorrect,
            optionSelected,
        };
        question.submission.push(submission);
    }
    getQuestions() {
        return this.questions.map((q) => ({ title: q.title, answer: q.answer }));
    }
    getScores() {
        return this.users.map((user) => ({ name: user.id, points: user.points }));
    }
}
exports.Quiz = Quiz;
