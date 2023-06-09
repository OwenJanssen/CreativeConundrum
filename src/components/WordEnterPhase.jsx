import React, { useState, useEffect } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import { nextRound } from '../utilities/nextRound';
import './WordEnterPhase.css';

const WordEnterPhase = ({setCurrentRound, gameId, userId}) => {
    const [data, error] = useDbData(`/${gameId}`);
    const [update, result] = useDbUpdate(`/${gameId}`);
    const [allReady, setAllReady] = useState(false);

    const [word1, setWord1] = useState("");
    const [word2, setWord2] = useState("");
    const [word3, setWord3] = useState("");

    const [nextUserId, setNextUserId] = useState();

    const handleWord1Change = (e) => {
        setWord1(e.target.value);

        const gameData = { ...data };
        gameData[userId]["enteredWords"][0] = e.target.value;
        gameData[nextUserId]["givenWords"][0] = e.target.value;
        update(gameData);
    }
    
    const handleWord2Change = (e) => {
        setWord2(e.target.value);

        const gameData = { ...data };
        gameData[userId]["enteredWords"][1] = e.target.value;
        gameData[nextUserId]["givenWords"][1] = e.target.value;
        update(gameData);
    }

    const handleWord3Change = (e) => {
        setWord3(e.target.value);

        const gameData = { ...data };
        gameData[userId]["enteredWords"][2] = e.target.value;
        gameData[nextUserId]["givenWords"][2] = e.target.value;
        update(gameData);
    }

    const handleDoneClick = () => {
        const gameData = { ...data[userId] };
        gameData["ready"] = !gameData["ready"];
        update({[`${userId}`]: gameData});
    };

    useEffect(() => {
        if (!data || nextUserId) { return; }

        const keys = Object.keys(data).filter(a => a!="props");
        const index = keys.indexOf(`${userId}`);
        
        let next = 0;
        if ((index !== -1 && index < keys.length-1) && keys.length > 1) {
            next = keys[index + 1];
        } else {
            next = keys[0];
        }

        const gameData = { ...data[userId] };
        gameData["nextUserId"] = next;
        update({[`${userId}`]: gameData});

        setNextUserId(next);
    }, [data]);

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

    return <div className="word-enter">
        <div className="game-title">CreativeConundrum</div>
        {allReady ? <div className="countdown">{Math.max(3-Math.floor((Date.now() - data["props"]["timerStartTime"])/1000),0)}</div> : <div className="countdown-placeholder"/>}
        <div className="enter-text">Enter Three Words</div>
        <div className="words">
            <input type="text" className="word-enter-box" onChange={handleWord1Change} value={word1} placeholder="Word 1"/>
            <input type="text" className="word-enter-box" onChange={handleWord2Change} value={word2} placeholder="Word 2"/>
            <input type="text" className="word-enter-box" onChange={handleWord3Change} value={word3} placeholder="Word 3"/>
        </div>
        <div className={data[userId]["ready"] ? "done-button" : "not-done-button"} onClick={handleDoneClick}>Done</div>
    </div>
};

export default WordEnterPhase;