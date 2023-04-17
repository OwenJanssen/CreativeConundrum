import React, { useState, useEffect, useRef } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import './StoryWritingPhase.css'

const StoryWritingPhase = ({setCurrentRound, gameId, userId}) => {
    const [data, error] = useDbData(`/${gameId}`);
    const [update, result] = useDbUpdate(`/${gameId}`);
    const textareaRef = useRef(null);
    const [timeRemaining, setTimeRemaining] = useState(60);

    const handleStoryChange = (e) => {
        const gameData = { ...data[userId] };
        gameData["story"] = e.target.value;
        update({[`${userId}`]: gameData});
    };

    const handleDoneClick = () => {
        const gameData = { ...data[userId] };
        gameData["ready"] = !gameData["ready"];
        update({[`${userId}`]: gameData});
    };

    useEffect(() => {
        // Resize textarea to fit content
        const textarea = textareaRef.current;
        if (!textarea) { return; }
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';

        const numPlayers = Object.keys(data).length;
        const numReady = Object.keys(data).filter(key => data[key]["ready"]).length;
        const allPlayersReady = numPlayers === numReady;

        if (allPlayersReady) {
            setCurrentRound(4);
        }
    }, [data]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1);
        }, 1000);

        if (timeRemaining === 0) {
            clearInterval(interval);
            setCurrentRound(4);
        }

        return () => clearInterval(interval);
    }, [timeRemaining, setCurrentRound]);

    if (error) return <h1>Error game data: {error.toString()}</h1>;
    if (data === undefined) return <h1>Loading game data...</h1>;
    if (!data) return <h1>No game data found</h1>;
    
    return <div className="app-container">
        <div className="game-title">CreativeConundrum</div>
        <div className="story-section">
            <div className="story-header">Write A Story With These Words</div>
            <div className="word-section">
                <div>{data[userId]["givenWords"][0]}</div>
                <div>{data[userId]["givenWords"][1]}</div>
                <div>{data[userId]["givenWords"][2]}</div>
            </div>
            <textarea ref={textareaRef} value={data[userId]["story"]} onChange={handleStoryChange}/>
            <div className={data[userId]["ready"] ? "done-button" : "not-done-button"} onClick={handleDoneClick}>Done</div>
            <div className="countdown">{timeRemaining}</div>
        </div>
    </div>
};

export default StoryWritingPhase;