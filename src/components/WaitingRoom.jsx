import React, { useState, useEffect } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import { nextRound } from '../utilities/nextRound';
import './WaitingRoom.css';

const WaitingRoom = ({gameId, userId}) => {
    const [data, error] = useDbData(`/${gameId}`);
    const [update, result] = useDbUpdate(`/${gameId}`);
    const [allReady, setAllReady] = useState(false);

    const handleReadyClick = () => {
        const gameData = { ...data[userId] };
        gameData["ready"] = !gameData["ready"];
        update({[`${userId}`]: gameData});
    }

    useEffect(() => {
        if (!data) { return; }

        const numPlayers = Object.keys(data).length-1;
        const numReady = Object.keys(data).filter(key => data[key]["ready"]).length;
        const allPlayersReady = numPlayers === numReady;

        if (allPlayersReady && !allReady) {
            setAllReady(true);
            if (data[userId]["leader"]) {
                const gameData = { ...data["props"] };
                gameData["timerStartTime"] = Date.now();
                update({["props"]: gameData});
                setTimeout(() => {nextRound(data, update)}, 3000);
            }
        }
    }, [data, allReady]);

    if (error) return <h1>Error game data: {error.toString()}</h1>;
    if (data === undefined) return <h1>Loading game data...</h1>;
    if (!data) return <h1>No game data found</h1>;

    return <div className="waiting-room">
        <div className="game-title">CreativeConundrum</div>
        <div className="game-code">Game Code: {gameId}</div>
        {allReady ? <div className="countdown">{Math.max(3-Math.floor((Date.now() - data["props"]["timerStartTime"])/1000),0)}</div> : <div className="countdown-placeholder"/>}
        <div className="player-cards">
            <div className="player-card">
                <div className="player-name">{data[userId].name}</div>
                <div className={data[userId]["ready"] ? "ready-button" : "not-ready-button"} onClick={handleReadyClick}>
                    Ready
                </div>
            </div>

            {Object.keys(data).filter(a => a!=userId && a!="props").map((key) => (
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