import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import getStroke from "perfect-freehand";
import "./App.css";

const App = () => {
  const canvasRef = useRef(null);
  const [elements, setElements] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [tool] = useState("pencil");
  const [action, setAction] = useState("none");
  const [color, setColor] = useState("black");
  const [size, setSize] = useState(9);
  const [themes, setThemes] = useState([
    "Eiffel Tower", "The Mona Lisa", "T-Rex", "Harry Potter", "Pizza", "Octopus", "Rainbow", "Hot Dog", "Moon Landing", 
    "Snowman", "Spider-Man", "Wedding Cake", "Toothbrush", "Kangaroo", "UFO", "Statue of Liberty", "Pirate Ship", 
    "Hamburger", "Leaning Tower of Pisa", "Cactus", "Giraffe", "Treehouse", "Titanic", "Snowstorm", "Soccer Ball", 
    "Disco Ball", "Birthday Cake", "Dragon", "Ballerina", "Police Officer", "Treasure Chest", "Ice Cream Cone", 
    "Roller Coaster", "Magic Wand", "Light Bulb", "Wizard", "Sandcastle", "Pirate Hat", "Tornado", "Traffic Light", 
    "UFO Abduction", "Bowling Ball", "Cup of Coffee", "Violin", "Sunglasses", "Beach Umbrella", "Haunted House", 
    "Snowflake", "Vacuum Cleaner"
  ]);
  const [players, setPlayers] = useState([]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all elements
    elements.forEach((element) => drawElement(context, element));
  }, [elements]);

  const createElement = (x, y) => {
    const id = elements.length;
    return {
      id,
      type: "pencil",
      points: [{ x, y }],
      options: { color, size },
    };
  };

  const drawElement = (context, element) => {
    const stroke = getStroke(element.points, { size: element.options.size });
    const pathData = getSvgPathFromStroke(stroke);
    context.fillStyle = element.options.color;
    context.fill(new Path2D(pathData));
  };

  const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";
    return stroke.reduce(
      (path, [x, y]) => `${path} L ${x} ${y}`,
      `M ${stroke[0][0]} ${stroke[0][1]}`
    );
  };

  const handleMouseDown = (e) => {
    if (tool === "pencil") {
      const { offsetX, offsetY } = e.nativeEvent;
      const newElement = createElement(offsetX, offsetY);
      const updatedElements = [...elements, newElement];
      setElements(updatedElements);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), updatedElements]);
      setHistoryIndex((prev) => prev + 1);
      setAction("drawing");
    }
  };

  const handleMouseMove = (e) => {
    if (action === "drawing") {
      const { offsetX, offsetY } = e.nativeEvent;
      const updatedElements = [...elements];
      const index = elements.length - 1;
      updatedElements[index].points.push({ x: offsetX, y: offsetY });
      setElements(updatedElements);
    }
  };

  const handleMouseUp = () => {
    setAction("none");
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  };

  // Add theme functionality
  const addTheme = () => {
    const newTheme = prompt("Enter a new theme:");
    if (newTheme) {
      if (themes.includes(newTheme)) {
        alert("This theme already exists!");
      } else {
        setThemes((prevThemes) => [...prevThemes, newTheme]);
        alert(`Theme "${newTheme}" added successfully!`);
      }
    }
  };

  const genTheme = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
  
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
  
    // Reset the elements state
    setElements([]);
  
    const theme = themes[Math.floor(Math.random() * themes.length)];

    alert(`Your theme will be displayed. Guessers, close your eyes!`)
    alert(`Your theme is "${theme}"`);
  };
  

  // Create game and manage players
  const createGame = () => {
    const numPlayers = parseInt(prompt("How many players are there?"));

    if (isNaN(numPlayers) || numPlayers <= 0) {
      alert("Please enter a valid number of players.");
      return;
    }

    const newPlayers = [];
    for (let i = 1; i <= numPlayers; i++) {
      const playerName = prompt(`Enter the name for player ${i}:`);
      if (playerName && playerName.trim() !== "") {
        newPlayers.push(playerName.trim());
      } else {
        alert("Player name cannot be empty!");
        i--; // Retry for the same player
      }
    }
    setPlayers(newPlayers);
  };

  return (
    <div id="container">
      <div id="header">
        <ul className="navbar">
          <button className="button" onClick={createGame}>Create/End Game</button>
          <button className="button" onClick={addTheme}>Add Theme</button>
          <button className="button" onClick={genTheme}>Generate Theme</button>
        </ul>
      </div>

      <div className="containertwo">
  <div className="playerlist" style={{ display: "flex", flexDirection: "column", width: "25%", borderRadius: "5px", }}>
    <h3 style={{ color: "white", marginTop: 0, textAlign: "left" }}>Players</h3>
    <ul style={{ padding: 0, listStyleType: "none" }}>
      {players.map((player, index) => (
        <li key={index} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
          <span style={{ flex: 1, color: "White", }}>{player}</span>
          <input
            type="number"
            min="0"
            max="100"
            style={{ width: "50px", textAlign: "center" }}
            onChange={(e) => {} /* Update points logic here */}
          />
        </li>
      ))}
    </ul>
  </div>


        <div
            className="canvas"
            style={{
              position: "absolute",  // Use absolute positioning
              right: "20px",         // 20px margin from the right side
              width: "70%",          // Keep width at 60%
              height: "85vh",        // Keep height at 80vh
              backgroundColor: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >

          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          ></canvas>

          <div style={{ position: "absolute", bottom: 10, left: "10px" }}>
            <div>
              <label style={{ marginRight: "10px" }}>
                Pencil Size:
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                style={{ width: "150px", }}
              />
            </div>
            <br />
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setColor("black")}
                style={{
                  backgroundColor: "black",
                  width: "30px",
                  height: "30px",
                  border: color === "black" ? "4px solid #86BBD8" : "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              ></button>
              <button
                onClick={() => setColor("red")}
                style={{
                  backgroundColor: "red",
                  width: "30px",
                  height: "30px",
                  border: color === "red" ? "4px solid #86BBD8" : "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              ></button>
              <button
                onClick={() => setColor("green")}
                style={{
                  backgroundColor: "green",
                  width: "30px",
                  height: "30px",
                  border: color === "green" ? "4px solid #86BBD8" : "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              ></button>
              <button
                onClick={() => setColor("blue")}
                style={{
                  backgroundColor: "blue",
                  width: "30px",
                  height: "30px",
                  border: color === "blue" ? "4px solid #86BBD8" : "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              ></button>
              <button
                onClick={() => setColor("yellow")}
                style={{
                  backgroundColor: "yellow",
                  width: "30px",
                  height: "30px",
                  border: color === "yellow" ? "4px solid #86BBD8" : "none",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              ></button>
              <p style={{ marginTop: "15px", }}>Custom Color:</p>
              <input
                  type="color"
                  onChange={(e) => setColor(e.target.value)}
                  value={color}
                  style={{
                    width: "30px",
                    height: "30px",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                />
            </div>
            <br />
            <button style={{ borderRadius: "5px", paddingLeft: "5px", paddingRight: "5px", }} onClick={undo} disabled={historyIndex === 0}>
              Undo
            </button>
            <button style={{ borderRadius: "5px", marginLeft: "10px", paddingLeft: "5px", paddingRight: "5px", }} onClick={redo} disabled={historyIndex === history.length - 1}>
              Redo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;