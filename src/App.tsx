import HomePage from './components/Home/Home';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import {io} from "socket.io-client"
import GamePage from './components/GamePage';
import { useState } from 'react';
const socket = io('http://localhost:3001',{ transports: ["websocket"] });
socket.connect()

function App() {

  const [name, setName] = useState('');   //username!
  

  //HomePage => takes player names and sets up loading screen
  //GamePage => displays table, cards, and messages

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage socket={socket} nameChange={setName}/>} />
          <Route path='gamepage' element={<GamePage socket={socket} name={name}/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
