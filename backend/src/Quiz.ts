import { Socket } from 'socket.io';
import { io } from './index';
export interface User {
    id: string;
    points: number;
}

export type AllowedSubmission = 0 | 1 | 2 | 3;

interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmission;
}

interface Question {
    id: string;
    title: string;
    options: {
        id: number;
        title: string;
    }[];
    answer: AllowedSubmission;
    submission: Submission[];
}

export class Quiz {
    // private io: Socket;
    roomId: string;
    private users: User[];
    private admin: string;
    private socket: Socket;
    private questions: Question[];

    constructor(roomId: string, admin: string, io: Socket) {
        this.roomId = roomId;
        this.users = [];
        this.admin = admin;
        this.socket = io;
        this.questions = [];
        //consol.og('Room created: ' + roomId);
    }


    addUser(id: string) {
        const existingUser = this.users.find((user) => user.id === id);
        if (!existingUser) {
            this.users.push({ id, points: 0 });
        } else {
            this.socket.emit('userExists');
            //consol.og('User already exists');
        }
    }
    addQuestion(question: Question) {
        this.questions.push(question);
    }

    startQuiz() {
        //consol.og(this.questions);
        let index = 1;
        const roomId = this.roomId;
        const scores = this.getScores();
        io.to(roomId).emit('scores', scores);
        io.to(roomId).emit('question', this.questions[0]);

        const intervalId = setInterval(() => {
            if (index < this.questions.length) {
                const currentQuestion = this.questions[index];
                io.to(roomId).emit('question', currentQuestion);
                index++;
            } else {
                clearInterval(intervalId);
                io.to(roomId).emit('quizEnded');
                const leaderboard = this.getScores();
                io.to(roomId).emit('leaderboard', leaderboard);
            }
        }, 20000); // 20 seconds interval
    }



    findRoom(roomId: string) {
        return this.roomId === roomId ? this : null;
    }


    selectAnswer(userId: string, problemId: string, optionSelected: AllowedSubmission) {
        const user = this.users.find((u) => u.id === userId);
        const question = this.questions.find((q) => q.id === problemId);

        if (!user || !question) {
            //consol.og("User or Question not found.");
            return;
        }

        const isCorrect = question.answer === optionSelected;

        if (isCorrect) {
            user.points += 10;
            //consol.og("Updated score:", user.points);
        }

        const submission: Submission = {
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
