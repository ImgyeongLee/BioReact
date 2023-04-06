import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {initiateSocket, socket} from "../context/socket";

export function useSocket(timeout) {
    const dispatch = useDispatch();
    useEffect(() => {
        initiateSocket()
        console.log("socket:", socket)
        let updateInterval = setInterval(() => {
            if (socket !== null) {
                socket.emit("getAllStatuses", (data) => {
                    if (data["status"] === "ok") {
                        // console.log("received statuses: ", data)
                        dispatch({
                            type: "UPDATE_WHOLE_STATUS",
                            newStatus: data["machine"],
                        });
                    } else {
                        console.log("getAllStatuses:", data["errorMessage"])
                    }
                });
                socket.emit("getRecipeList", (data) => {
                    if (data["status"] === "ok") {
                        // console.log("received statuses: ", data)
                        dispatch({
                            type: "UPDATE_RECIPE_LIST",
                            recipeList: data["list"],
                        });
                    } else {
                        console.log("getRecipeList:", data["errorMessage"])
                    }
                });
            }
        }, timeout);

        socket.on("connect", () => {
            console.log("connected to server");
        });

        socket.on("disconnect", () => {
            console.log("disconnected from server");
        });

        return () => {
            socket.close();
            socket.off("connect");
            socket.off("disconnect");
            clearInterval(updateInterval);
        };
    }, [dispatch, timeout]);

    return socket;
}
