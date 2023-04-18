import React, { useState, useEffect } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import './WaitingRoom.css';

const WaitingRoom = ({setCurrentRound, gameId, userId}) => {
    const [data, error] = useDbData(`/${gameId}`);
    const [update, result] = useDbUpdate(`/${gameId}`);
    const [allReady, setAllReady] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleReadyClick = () => {
        const gameData = { ...data[userId] };
        gameData["ready"] = !gameData["ready"];
        update({[`${userId}`]: gameData});
    }

    const resetReady = () => {
        const gameData = { ...data[userId] };
        gameData["ready"] = false;
        update({[`${userId}`]: gameData});
    }

    useEffect(() => {
        if (!data) { return; }

        const numPlayers = Object.keys(data).length-1;
        const numReady = Object.keys(data).filter(key => data[key]["ready"]).length;
        const allPlayersReady = numPlayers === numReady;

        if (allPlayersReady && !allReady) {
            setAllReady(true);
            resetReady();
            setCountdown(3);
        }
    }, [data, allReady]);

    useEffect(() => {
        if (!data) { return; }

        if (allReady && countdown > 0) {
            const timerId = setInterval(() => setCountdown(countdown - 1), 1000);
            return () => clearInterval(timerId);
        } else if (allReady && countdown === 0) {
            setCurrentRound(2);
        }
    }, [allReady, countdown]);

    if (error) return <h1>Error game data: {error.toString()}</h1>;
    if (data === undefined) return <h1>Loading game data...</h1>;
    if (!data) return <h1>No game data found</h1>;

    return <div className="waiting-room">
        <div className="game-title">CreativeConundrum</div>
        <div className="game-code">Game Code: {gameId}</div>
        {allReady ? <div className="countdown">{countdown}</div> : <div className="countdown-placeholder"/>}
        <div className="player-cards">
            <div className="player-card">
                <div className="player-name">{data[userId].name}</div>
                <div className={data[userId]["ready"] ? "ready-button" : "not-ready-button"} onClick={handleReadyClick}>
                    Ready
                </div>
            </div>

            {Object.keys(data).filter(a => a!=userId && a!="currentRound").map((key) => (
                <div key={key} className="player-card">
                    <div className="player-name">{data[key].name}</div>
                    <div className={data[key]["ready"] ? "ready-stamp" : "not-ready-stamp"}>
                        Ready
                    </div>
                </div>))
            }
        </div>
    </div>
};

export default WaitingRoom;