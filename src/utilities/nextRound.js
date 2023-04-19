export const nextRound = (data, update) => {
    let gameData;

    for (let key of Object.keys(data)) {
        gameData = { ...data[key] };
        if (key == "props") {
            gameData["currentRound"] += 1;
        } else {
            gameData["ready"] = false;
        }
        update({[`${key}`]: gameData});
    }
};