import {Navigate, Route, Routes} from "react-router-dom";
import Main from "./pages/Main";
import About from "./pages/About";
import Selection from "./pages/Selection";
import Manage from "./pages/Manage";
import Navbar from "./components/Navbar";
import "./App.css";
import {useSocket} from "./hooks/socketHook";
import Manual from "./pages/Manual";

function App() {
    let socket = useSocket(500);
    return (
        <>
            <Navbar/>
            <div className="App">
                <Routes>
                    <Route index element={<Main socket={socket}/>}/>
                    <Route path="/main" element={<Navigate to="/"/>}/>
                    <Route path="/load/main" element={<Navigate to="/"/>}/>
                    <Route path="/recipes" element={<Manage socket={socket}/>}/>
                    <Route
                        path="/recipes/:id"
                        element={<Manage socket={socket}/>}
                    ></Route>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/about/:lang" element={<About/>}/>
                    <Route path="/load" element={<Selection socket={socket}/>}/>
                    <Route
                        path="/manual/load"
                        element={<Selection socket={socket}/>}
                    ></Route>
                    <Route path="/manual" element={<Manual socket={socket}/>}/>
                </Routes>
            </div>
        </>
    );
}

export default App;
