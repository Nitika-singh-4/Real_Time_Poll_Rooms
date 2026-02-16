import { io } from "socket.io-client";

const socket = io("https://real-time-poll-rooms-l2by.onrender.com");

export default socket;
