// import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "../features/SignIn/Signin.component";
import Notes from "../features/Notes/Notes.components";

const MainRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/notescomponents" element={<Notes />} />
            </Routes>
        </Router>
    );
};

export default MainRouter;
