import React, { useCallback, useEffect, useRef, useState } from "react";

const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "black",
  "indigo",
  "violet",
];

function Canvas() {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [lastPosition, setLastPosition] = useState({
    x: 0,
    y: 0,
  });
  const [mouseDown, setMouseDown] = useState(false);

  const canvasRef = useRef(null);
  const ctx = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      ctx.current = canvasRef.current.getContext("2d");
    }
  }, []);

  const draw = useCallback(
    (x, y) => {
      if (mouseDown) {
        ctx.current.beginPath();
        ctx.current.strokeStyle = selectedColor;
        ctx.current.lineWidth = 5;
        ctx.current.lineJoin = "round";
        ctx.current.moveTo(lastPosition.x, lastPosition.y);
        ctx.current.lineTo(x, y);
        ctx.current.closePath(x, y);
        ctx.current.stroke();

        setLastPosition({ x, y });
      }
    },
    [lastPosition, selectedColor, setLastPosition, mouseDown]
  );

  const onMouseDown = (e) => {
    setLastPosition({
      x: e.pageX,
      y: e.pageY,
    });
    setMouseDown(true);
  };

  const onMouseUp = (e) => {
    setMouseDown(false);
  };
  const onMouseMove = (e) => {
    draw(e.pageX, e.pageY);
  };

  const clear = () => {
    ctx.current.clearRect(
      0,
      0,
      ctx.current.canvas.width,
      ctx.current.canvas.height
    );
  };

  const download = async () => {
    const image = canvasRef.current.toDataURL("image/png");
    const blob = await (await fetch(image)).blob();
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobURL;
    link.download = "image.png";
    link.click();
  };

  return (
    <div className="canvass">
      <h1>Drawing App</h1>
      <canvas
        style={{ border: "1px solid black" }}
        width={800}
        height={500}
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
      />
      <br />
      <select
        value={selectedColor}
        onChange={(e) => setSelectedColor(e.target.value)}
      >
        {colors.map((color) => (
          <option key={color}>{color}</option>
        ))}
      </select>
      <button onClick={clear}>Clear</button>
      <button onClick={download}>Download</button>
    </div>
  );
}

export default Canvas;
