import React, { useState, useEffect } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import './WordEnterPhase.css'

const WordEnterPhase = ({setCurrentRound, gameId, userId}) => {
    const [data, error] = useDbData(`/${gameId}`);
    const [update, result] = useDbUpdate(`/${gameId}`);
    const [nextUserId, setNextUserId] = useState();

    const handleWord1Change = (e) => {
        const gameData = { ...data };
        gameData[userId]["enteredWords"][0] = e.target.value;
        gameData[nextUserId]["givenWords"][0] = e.target.value;
        update(gameData);
    }
    
    const handleWord2Change = (e) => {
        const gameData = { ...data };
        gameData[userId]["enteredWords"][1] = e.target.value;
        gameData[nextUserId]["givenWords"][1] = e.target.value;
        update(gameData);
    }

    const handleWord3Change = (e) => {
        const gameData = { ...data };
        gameData[userId]["enteredWords"][2] = e.target.value;
        gameData[nextUserId]["givenWords"][2] = e.target.value;
        update(gameData);
    }

    const submit = () => {
        const gameData = { ...data[userId] };
        gameData["ready"] = false;
        update({[`${userId}`]: gameData});
        setCurrentRound(3);
    }

    useEffect(() => {
        if (!data || nextUserId) { return; }

        const keys = Object.keys(data);
        const index = keys.indexOf(`${userId}`);
      
        if (index !== -1 && index < keys.length) {
            setNextUserId(keys[index + 1]);
        } else {
            setNextUserId(keys[0]);
        }
    }, [data]);

    if (error) return <h1>Error game data: {error.toString()}</h1>;
    if (data === undefined) return <h1>Loading game data...</h1>;
    if (!data) return <h1>No game data found</h1>;

    return <div className="app-container">
        <div className="game-title">CreativeConundrum</div>
        <div className="enter-text">Enter Three Words</div>
        <div className="words">
            <input type="text" className="word-enter-box" onChange={handleWord1Change} value={data[userId]["enteredWords"][0]} placeholder="Word 1"/>
            <input type="text" className="word-enter-box" onChange={handleWord2Change} value={data[userId]["enteredWords"][1]} placeholder="Word 2"/>
            <input type="text" className="word-enter-box" onChange={handleWord3Change} value={data[userId]["enteredWords"][2]} placeholder="Word 3"/>
        </div>
        <div className="submit-button" onClick={submit}>Submit</div>
    </div>
};

export default WordEnterPhase;