import React, { useState, useEffect, useRef } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import StoryCard from './StoryCard';
import './AllStories.css';

const WordGuessingPhase = ({setCurrentRound, gameId, userId}) => {
    const [update, result] = useDbUpdate(`/${gameId}`);
    const [data, error] = useDbData(`/${gameId}`);
    const [funniest, setFunniest] = useState([]);

    const handleDoneClick = () => {
        const gameData = { ...data[userId] };
        gameData["ready"] = !gameData["ready"];
        update({[`${userId}`]: gameData});
    };

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

        if (allPlayersReady) {
            resetReady();
            setCurrentRound(5);
        }
    }, [data]);

    if (error) return <h1>Error game data: {error.toString()}</h1>;
    if (data === undefined) return <h1>Loading game data...</h1>;
    if (!data) return <h1>No game data found</h1>;

    return <div className="all-stories">
        <div className="game-title">CreativeConundrum</div>
        <div className="instructions">Click on the three words that each story had to use</div>
        <div className="instructions">Click anywhere else on the card to vote for it as the funniest story</div>
        <div className="stories-section">
            {Object.keys(data).filter(a=>a!="currentRound").map(key => {
                return <StoryCard id={key} userId={userId} text={data[key]["story"]} data={data} update={update} funniest={funniest} setFunniest={setFunniest}/>
            })}
        </div>
        <div className={data[userId]["ready"] ? "done-button" : "not-done-button"} onClick={handleDoneClick}>Done</div>
    </div>
};

export default WordGuessingPhase;