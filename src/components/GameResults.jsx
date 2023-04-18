import React, { useState, useEffect } from 'react';
import { useDbData, useDbUpdate } from '../utilities/firebase';
import StoryCard from './StoryCard';
import './AllStories.css';

const GameResults = ({setCurrentRound, gameId, userId}) => {
    const [data, error] = useDbData(`/${gameId}`);
    const [update, result] = useDbUpdate(`/${gameId}`);
    const [winner, setWinner] = useState([userId]);
    const [funniest, setFunniest] = useState([userId]);

    useEffect(() => {
        if (!data) { return; }

        let leastCorrectGuesses = Infinity;
        let mostFunnyVotes = 0;

        for (let key of Object.keys(data)) {
            if (data[key]["correctWordGuesses"] == leastCorrectGuesses) {
                setWinner(prevWinners => [...prevWinners, key]);
            } else if (data[key]["correctWordGuesses"] < leastCorrectGuesses) {
                setWinner([key]);
                leastCorrectGuesses = data[key]["correctWordGuesses"];
            }

            if (data[key]["funnyVotes"] == mostFunnyVotes) {
                setFunniest(prevFunniest => [...prevFunniest, key]);
            } else if (data[key]["funnyVotes"] > mostFunnyVotes) {
                setFunniest([key]);
                mostFunnyVotes = data[key]["funnyVotes"];
            }
        }
    }, [data]);

    if (error) return <h1>Error game data: {error.toString()}</h1>;
    if (data === undefined) return <h1>Loading game data...</h1>;
    if (!data) return <h1>No game data found</h1>;

    return <div className="all-stories">
        <div className="game-title">CreativeConundrum</div>
        <div className="instructions">Results!</div>
        <div className="stories-section">
            {Object.keys(data).filter(a=>a!="currentRound").map(key => {
                return <StoryCard id={key} userId={userId} text={data[key]["story"]} data={data} update={update} funniest={funniest} setFunniest={setFunniest} winner={winner} results={true}/>
            })}
        </div>
    </div>
};

export default GameResults;