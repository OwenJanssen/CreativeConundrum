import React, { useState, useEffect, useRef } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import './HomePage.css'

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

const HomePage = ({setCurrentRound, gameId, setGameId, userId}) => {
    const [name, setName] = useState('');
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

    const addLetter = ({ x, y, letter, size, color }) => {
        setLetters(prevLetters => {
            if (prevLetters.length >= 50) {
                prevLetters.shift();
            }
            return [...prevLetters, { x, y, letter, size, color }];
        });
    };

    const startNewGame = () => {
        const randomGameId = Math.floor(Math.random() * 9000) + 1000;
        update({
            [`${randomGameId}`]: {
                [`${userId}`]: {
                    "name": name,
                    "enteredWords": [
                      "",
                      "",
                      ""
                    ],
                    "givenWords": [
                        "",
                        "",
                        ""
                    ],
                    "story": "",
                    "correctWordGuesses": 0,
                    "funnyVotes": 0,
                    "ready": false
                }
            }
        });
        setGameId(randomGameId);
        setCurrentRound(1);
    }

    const joinExistingGame = () => {
        const gameData = { ...data[gameId] };
        gameData[userId] = {
            "name": name,
            "enteredWords": [
                "",
                "",
                ""
            ],
            "givenWords": [
                "",
                "",
                ""
            ],
            "story": "",
            "correctWordGuesses": 0,
            "funnyVotes": 0,
            "ready": false
        };
        update({
            [`${gameId}`]: gameData,
        });
        setCurrentRound(1);
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleGameIdChange = (event) => {
        setGameId(event.target.value);
    }

    return <div className="app-container">
        <div className="game-title">CreativeConundrum</div>
        <div className="name">
            <input type="text" value={name} onChange={handleNameChange} placeholder="Enter your name" />
        </div>
        <div className="new-game" onClick={startNewGame}>Start a new game</div>
        <div className="or-seperator">OR</div>
        <div className="game-code">
            <input type="text" value={gameId} onChange={handleGameIdChange} placeholder="Enter game code" />
            <div className="join-game" onClick={joinExistingGame}>Join</div>
        </div>
    </div>
};

export default HomePage;



