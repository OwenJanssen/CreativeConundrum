import React, { useState, useEffect, useRef } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import { nextRound } from '../utilities/nextRound';
import './StoryWritingPhase.css';

const StoryWritingPhase = ({gameId, userId}) => {
    const [data, error] = useDbData(`/${gameId}`);
    const [update, result] = useDbUpdate(`/${gameId}`);
    const textareaRef = useRef(null);
    const [timerGoing, setTimerGoind] = useState(false);

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

        const numReady = Object.keys(data).filter(key => data[key]["ready"]).length;

        if (numReady>0 && !timerGoing) {
            setTimerGoind(true);
            if (data[userId]["leader"]) {
                const gameData = { ...data["props"] };
                gameData["timerStartTime"] = Date.now();
                update({["props"]: gameData});
                setTimeout(() => {nextRound(data, update)}, 60000);
            }
        }
    }, [data]);

    if (error) return <h1>Error game data: {error.toString()}</h1>;
    if (data === undefined) return <h1>Loading game data...</h1>;
    if (!data) return <h1>No game data found</h1>;
    
    return <div className="story-writing">
        <div className="game-title">CreativeConundrum</div>
        {timerGoing ? <div className="countdown">{Math.max(60-Math.floor((Date.now() - data["props"]["timerStartTime"])/1000),0)}</div> : <div className="countdown-placeholder"/>}
        <div className="story-section">
            <div className="story-header">Write A Story With These Words</div>
            <div className="word-section">
                <div>{data[userId]["givenWords"][0]}</div>
                <div>{data[userId]["givenWords"][1]}</div>
                <div>{data[userId]["givenWords"][2]}</div>
            </div>
            <textarea ref={textareaRef} value={data[userId]["story"]} onChange={handleStoryChange}/>
            <div className={data[userId]["ready"] ? "done-button" : "not-done-button"} onClick={handleDoneClick}>Done</div>
        </div>
    </div>
};

export default StoryWritingPhase;