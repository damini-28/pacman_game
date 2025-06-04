import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import wall from "./images/wall.png";
import coin from "./images/coin.png";
import pacmann from "./images/pacman.png";
import ghost from "./images/ghost2.png";
import bg from "./images/bg.png";

const PacManGame = () => {
  const [pacman, setPacman] = useState({ x: 6, y: 4 });
  const[ghostpos,setGhostPos]=useState({x:7,y:7});
  const [maps, setMaps] = useState([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 1, 5, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 4, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [gameOver, setGameOver] = useState(false);

  const handleKeyDown = useCallback(
    (event) => {
      if (gameOver) return;

      let dx = 0;
      let dy = 0;

      if (event.keyCode === 37) dx = -1; // left
      else if (event.keyCode === 38) dy = -1; // up
      else if (event.keyCode === 39) dx = 1; // right
      else if (event.keyCode === 40) dy = 1; // down
      else return;

      const newX = pacman.x + dx;
      const newY = pacman.y + dy;

      if (
        newX < 0 ||
        newX >= maps[0].length ||
        newY < 0 ||
        newY >= maps.length ||
        maps[newY][newX] === 1
      ) {
        return; // invalid move
      }

      setMaps((prevMaps) => {
        const newMap = prevMaps.map((row) => [...row]);
        newMap[pacman.y][pacman.x] = 3; // leave ground behind
        newMap[newY][newX] = 5; // new PacMan position
        return newMap;
      });

      setPacman({ x: newX, y: newY });
      checkWinningCondition(newX, newY);
    },
    [pacman, maps, gameOver]
  );

  const checkWinningCondition = (x, y) => {
    if (!maps.some((row) => row.includes(2))) {
      setGameOver(true);
      alert("Congrats! You won.");
    } else if (!maps.some((row) => row.includes(4))) {
      setGameOver(true);
      alert("Game over! The ghost got you.");
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(()=>{
    const interval=setInterval(()=>{
      if(gameOver) return;
      setMaps((prevMaps)=>{
        const newMap=prevMaps.map((row)=>[...row]);
        let dx=pacman.x- ghostpos.x;
        let dy=pacman.y - ghostpos.y;

        let possibleMoves=[
          {x:dx > 0 ? 1 :-1, y:0},
          {x:0,y:dy > 0 ? 1 :-1}
        ]
        let moved=false;
        for(let move of possibleMoves){
          const newX=ghostpos.x+ move.x;
          const newY=ghostpos.y+move.y;
        
        

          if(
            newY>=0 &&
            newY< newMap.length &&
            newX>=0 &&
            newX< newMap[0].length &&
            newMap[newY][newX]!==1
          ){
            if (newX===pacman.x && newY===pacman.y){
              setGameOver(true);
              alert("Game over ! The ghost caught you");
          
            }
            newMap[ghostpos.y][ghostpos.x]=3;
            newMap[newY][newX]=4;
            setGhostPos({x:newX , y:newY});
            moved=true;
            break;
          }
        }
        return newMap;
      });
    },500);
    return()=> clearInterval(interval);
  },[ghostpos,pacman,gameOver]);

  return (
    <div id="world" style={{ backgroundColor: "white" }}>
      {maps.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={
                cell === 1
                  ? "wall"
                  : cell === 2
                  ? "coin"
                  : cell === 3
                  ? "ground"
                  : cell === 4
                  ? "ghost"
                  : cell === 5
                  ? "pacman"
                  : ""
              }
              style={
                cell === 1
                  ? { backgroundImage: `url(${wall})` }
                  : cell === 2
                  ? { backgroundImage: `url(${coin})` }
                  : cell === 3
                  ? { backgroundImage: `url(${bg})` }
                  : cell === 4
                  ? { backgroundImage: `url(${ghost})` }
                  : cell === 5
                  ? { backgroundImage: `url(${pacmann})` }
                  :null
              }
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default PacManGame;


