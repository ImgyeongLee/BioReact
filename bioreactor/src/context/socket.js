import io from "socket.io-client";

const serverUrl = "http://localhost:3001";

export let socket

export function initiateSocket() {
    socket = io(serverUrl, {
        cors: {
            origin: serverUrl,
            methods: ["GET", "POST"],
        },
    });
}

console.log("socket declared:", socket)