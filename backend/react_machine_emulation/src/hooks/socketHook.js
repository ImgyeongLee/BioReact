import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import io from 'socket.io-client';

export function useSocket(timeout) {
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch()
    const serverUrl = "http://localhost:3001"

    useEffect(() => {
        const newSocket = io(serverUrl,
            {
                cors: {
                    origin: serverUrl,
                    methods: ["GET", "POST"]
                }
            });
        setSocket(newSocket);

        let updateInterval = setInterval(() => {
            if (newSocket !== null) {

                newSocket.emit("getAllStatuses", (data) => {
                    if (data["status"] === "ok") {
                        // console.log("received statuses: ", data["machine"])
                        dispatch({
                            "type": "UPDATE_WHOLE_STATUS",
                            "newStatus": data["machine"]
                        })
                    }
                })
            }
        }, timeout);

        newSocket.on('connect', () => {
            console.log("connected to server")
            newSocket.emit('getAllStatuses', (data) => {
                if (data["status"] === "ok") {
                    dispatch({
                        "type": "UPDATE_WHOLE_STATUS",
                        "newStatus": data["devices"]
                    })
                    // console.log("received machine status: ", data["devices"])
                }
            })
        });

        newSocket.on('disconnect', () => {
            console.log("disconnected from server")
        });

        return () => {
            newSocket.close()
            newSocket.off('connect');
            newSocket.off('disconnect');
            clearInterval(updateInterval)
        }
    }, [setSocket, timeout]);

    return socket
}
