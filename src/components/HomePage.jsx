import React, { useState, useEffect, useRef } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import './HomePage.css';

const HomePage = ({setCurrentRound, gameId, setGameId, userId}) => {
    const [name, setName] = useState('');
    const [update, result] = useDbUpdate(`/`);
    const [data, error] = useDbData('/');

    const startNewGame = () => {
        const randomGameId = Math.floor(Math.random() * 9000) + 1000;
        update({
            [`${randomGameId}`]: {
                "currentRound": 1,
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
                    "ready": false,
                    "nextUserId": 0,
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
            "ready": false,
            "nextUserId": 0,
        };
        update({
            [`${gameId}`]: gameData,
        });
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    }

    const handleGameIdChange = (event) => {
        setGameId(event.target.value);
    }

    return <div className="home-page">
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




