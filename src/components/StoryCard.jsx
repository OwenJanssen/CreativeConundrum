import React, { useState, useEffect, useRef } from 'react';
import './AllStories.css';

const StoryCard = ({ text, id, userId, data, update, funniest, setFunniest, winner, results=false }) => {
    const [selectedWords, setSelectedWords] = useState([]);

    const normalizeWord = (word) => {
        return word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ");
    }

    const handleClick = (word) => {
        if (id==userId || id==data[userId]["nextUserId"] || results) { return; }

        const gameData = { ...data[id] };
        if (selectedWords.includes(word)) {
            setSelectedWords(selectedWords.filter((w) => w !== word));
            if (gameData["givenWords"].map(a => normalizeWord(a)).includes(normalizeWord(word))) {gameData["correctWordGuesses"]--;}
        } else if (selectedWords.length < 3) {
            setSelectedWords([...selectedWords, word]);
            if (gameData["givenWords"].map(a => normalizeWord(a)).includes(normalizeWord(word))) {gameData["correctWordGuesses"]++;}
        }
        update({[`${id}`]: gameData});
    };

    const renderText = () => {
        if (!text) {return;}

        const words = text.split(' ');
        return words.map((word, index) => {
            const isSelected = id!=userId && selectedWords.includes(word);
            return (
                <span
                    key={index}
                    onClick={() => handleClick(word)}
                    style={{ backgroundColor: isSelected ? 'cyan' : 'transparent', 
                            color: isSelected ? 'black' : '',
                            cursor: (id!=userId && id!=data[userId]["nextUserId"]) ? 'pointer' : 'text' }}
                >
                {word}{' '}
                </span>
            );
        });
    };

    const updateFunniest = (e) => {
        if (id==userId || e.target.tagName=="SPAN" || results) { return; }

        setFunniest(oldFunniest => {
            console.log(oldFunniest)
            if (oldFunniest.length == 0 || oldFunniest.map(a => `${a}`).includes(`${id}`)) { return [id]; }

            let gameData = { ...data[oldFunniest[0]] };
            gameData["funnyVotes"]--;
            update({[`${oldFunniest[0]}`]: gameData});
            
            gameData = { ...data[id] };
            gameData["funnyVotes"]++;
            update({[`${id}`]: gameData});

            return [id];
        });
    };

    //console.log(data[userId]["givenWords"])

    return <div key={id} className="story-card" onClick={updateFunniest}>
        <div className="author" key={id + "0"}>{id==userId ? `Your Story` : `${data[id]["name"]}'s Story${id==data[userId]["nextUserId"] ? ` (Your Words)` : ``}`}</div>
        {(results && funniest.map(a => `${a}`).includes(`${id}`)) && <div className="funniest">Funniest Story</div>}
        {(results && winner.map(a => `${a}`).includes(`${id}`)) && <div className="winner">Least Words Guessed</div>}
        <div className="story" key={id + "1"}>{renderText()}</div>
        <div className="words-text">Words</div>
        {results && <div className="words-section">
            {data[id]["givenWords"].map((word, index) => {return <div key={index}>{word}</div>})}
        </div>}
    </div>;
}

export default StoryCard;