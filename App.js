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
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(true); // state for controlling drawing on/off

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
    if (tool === "pencil" && isDrawingEnabled) { // Check if drawing is enabled
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
    if (action === "drawing" && isDrawingEnabled) { // Only allow drawing if enabled
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

  return (
    <div id="container">
      <div id="header">
        <ul className="navbar">
          <button className="button">Create/End Game</button>
          <button className="button">Add Theme</button>
        </ul>
        <span style={{ paddingRight: "9%", color: "white", fontSize: "xx-large" }}>0:00</span>
      </div>

      <div className="containertwo">
        <div className="playerlist">
          <h3 style={{ color: "white", marginTop: 0, textAlign: "left" }}>Players:</h3>
        </div>

        <div
          className="canvas"
          style={{
            position: "relative",
            width: "70%",
            height: "80vh",
            margin: "0 auto",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
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
                style={{ width: "150px" }}
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
            </div>
            <br />
            <button onClick={undo} disabled={historyIndex === 0}>
              Undo
            </button>
            <button onClick={redo} disabled={historyIndex === history.length - 1}>
              Redo
            </button>
          </div>

        </div>

        <div className="chatbox">
          {/* Chatbox content */}
        </div>
      </div>
    </div>
  );
};

export default App;
