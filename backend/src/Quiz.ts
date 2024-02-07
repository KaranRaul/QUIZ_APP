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

    private questions: Question[];

    constructor(roomId: string, admin: string, io: Socket) {
        this.roomId = roomId;
        this.users = [];
        this.admin = admin;
        // this.io = io;
        this.questions = [];
        console.log('Room created: ' + roomId);
        this.setupSocketListeners();
    }

    private setupSocketListeners() {
        //     this.io.on('addQuestion', (question) => {
        //         console.log('addQuestion event received:', question);
        //         this.addQuestion(question);
        //     });

        //     this.io.on('addUser', (id) => {
        //         console.log('add = called');
        //         this.addUser(id);
        //     });

        //     this.io.on('submit', (userId: string, problemId: string, optionSelected: AllowedSubmission) => {
        //         this.selectAnswer(userId, problemId, optionSelected);
        //     });

        //     this.io.on('getScore', () => {
        //         console.log('Score sent');
        //         const scores = this.getScores();
        //         this.io.emit('scores', scores);
        //     });

        //     this.io.on('getQuestion', () => {
        //         const q = this.getQuestions();
        //         this.io.emit('question', q);
        //     });
        // }
    }

    startQuiz() {
        console.log(this.questions)

        io.emit('question', (this.questions));
        // this.questions.map((q) => {
        //     io.emit('question', (q));

        // })
    }
    addUser(id: string) {
        const user1 = this.users.find((u) => u.id === id);
        console.log(user1);
        if (!user1) {
            this.users.push({ id, points: 0 });
        } else {
            // this.io.emit('userExists');
            console.log('User already exists');
        }
    }

    addQuestion(question: Question) {
        this.questions.push(question);
    }

    findRoom(roomId: string) {
        return this.roomId === roomId ? this : null;
    }

    selectAnswer(userId: string, problemId: string, optionSelected: AllowedSubmission) {
        const user = this.users.find((u) => u.id === userId);
        const question = this.questions.find((q) => q.id === problemId);

        if (user && question) {
            const isCorrect = question.answer === optionSelected;
            const submission: Submission = {
                problemId,
                userId,
                isCorrect,
                optionSelected,
            };

            question.submission.push(submission);
        }
    }

    getQuestions() {
        return this.questions.map((q) => ({ title: q.title, answer: q.answer }));
    }

    getScores() {
        return this.users.map((user) => ({ name: user.id, points: user.points }));
    }
}
