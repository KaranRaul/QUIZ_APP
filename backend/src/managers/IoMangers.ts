// import http from 'http';
// import { Server, Socket } from 'socket.io';
// import { instrument } from '@socket.io/admin-ui';
// // Create a basic HTTP server
// const server = http.createServer();

// // Attach Socket.io to the HTTP server
// export class IoManager {
//     public static io: Server;
//     public static getIo() {
//         if (!this.io) {
//             const io = new Server(server, {
//                 cors: {
//                     origin: "*",
//                     credentials: true
//                 }
//             });

//             this.io = io;
//         }
//         return this.io;
//     }
// }
