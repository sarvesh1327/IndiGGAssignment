import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./modules/home";
import { PrivateRoute } from "./modules/privateRoute";
import "./App.css";
import Login from "./modules/login";
import TournamentDetails from "./modules/tournament";
import Slides from "./modules/questions";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
          <Route path="/tournaments/:id" element={<TournamentDetails />} />
          <Route path= "tournaments/:id/questions" element={<Slides/>}/>
          </Route>

          <Route
            path="/login"
            element={<Login />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
