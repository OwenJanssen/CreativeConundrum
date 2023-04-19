import React, { useState, useEffect } from 'react';
import { useDbData, useDbUpdate } from './utilities/firebase';
import './App.css';
import WordEnterPhase from './components/WordEnterPhase';
import StoryWritingPhase from './components/StoryWritingPhase';
import WordGuessingPhase from './components/WordGuessingPhase';
import GameResults from './components/GameResults';
import HomePage from './components/HomePage';
import WaitingRoom from './components/WaitingRoom';

// ALL LETTER CODE WAS GENERATED BY CHAT-GPT USING THIS PROMPT:
// make it so that random letters or random size and color float around the background
// 
// I had to make it so a max of 50 letters could be on the screen at once

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const getRandomLetter = () => LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
const getRandomSize = () => Math.floor(Math.random() * 6) + 1;
const getRandomColor = () => ({
  r: Math.random(),
  g: Math.random(),
  b: Math.random()
});

const FloatingLetter = ({ letter, size, color, x, y }) => {
  return (
    <div
      className="letter"
      style={{
        '--size': size,
        '--color-r': color.r,
        '--color-g': color.g,
        '--color-b': color.b,
        top: `${y}px`,
        left: `${x}px`
      }}
    >
      {letter}
    </div>
  );
};

const App = () => {
  const [currentRound, setCurrentRound] = useState(0);
  const [gameId, setGameId] = useState("");
  const [userId, setUserId] = useState(Math.floor(Math.random() * 1000000));
  const [letters, setLetters] = useState([]);
  const [update, result] = useDbUpdate(`/`);
  const [data, error] = useDbData('/');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      const letter = getRandomLetter();
      const size = getRandomSize();
      const color = getRandomColor();
      addLetter({ x, y, letter, size, color });
    }, 250);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!data || !data[gameId] || !data[gameId][userId]) { return; }

    setCurrentRound(data[gameId]["props"]["currentRound"]);
  }, [data]);

  const addLetter = ({ x, y, letter, size, color }) => {
    setLetters(prevLetters => {
      if (prevLetters.length >= 50) {
        prevLetters.shift();
      }
      return [...prevLetters, { x, y, letter, size, color }];
    });
  };
  
  return <div className="app-container">
    {(currentRound == 0) && <HomePage gameId={gameId} setGameId={setGameId} userId={userId}/>}
    {(currentRound == 1) && <WaitingRoom gameId={gameId} userId={userId}/>}
    {(currentRound == 2) && <WordEnterPhase gameId={gameId} userId={userId}/>}
    {(currentRound == 3) && <StoryWritingPhase gameId={gameId} userId={userId}/>}
    {(currentRound == 4) && <WordGuessingPhase gameId={gameId} userId={userId}/>}
    {(currentRound == 5) && <GameResults gameId={gameId} userId={userId}/>}
    <div className="letters-container">
      {letters.map((letter, index) => (
        <FloatingLetter key={index} {...letter} />))
      }
    </div>
  </div>
};

export default App;
