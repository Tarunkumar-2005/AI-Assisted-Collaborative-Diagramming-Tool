import React, { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import axios from "axios";

export default function DrawShape() {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams(); // get userId from route (/dashboard/:userId)
  const storedUserId = localStorage.getItem("userId");
  const finalUserId = userId || storedUserId;

  // ============= Drawing functions =============
  const startDrawing = (e) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
    setPoints([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
  };

  const draw = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
    setPoints((prev) => [...prev, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
  };

  const stopDrawing = () => setDrawing(false);

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setPoints([]);
  };

  // ============= Shape Detection Helpers (same as before) =============
  const isRectangle = (pts, tolerance = 20) => {
    if (pts.length < 4) return false;
    const minX = Math.min(...pts.map(p => p.x));
    const maxX = Math.max(...pts.map(p => p.x));
    const minY = Math.min(...pts.map(p => p.y));
    const maxY = Math.max(...pts.map(p => p.y));
    const width = maxX - minX;
    const height = maxY - minY;
    const corners = [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY }
    ];
    let cornerMatches = 0;
    corners.forEach(corner => {
      const near = pts.filter(p =>
        Math.hypot(p.x - corner.x, p.y - corner.y) < tolerance
      );
      if (near.length > 0) cornerMatches++;
    });
    return cornerMatches >= 3 && width > 30 && height > 30;
  };

  const distance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const isTriangle = (pts) => {
    if (pts.length < 3) return false;
    let maxDist = 0, v1 = pts[0], v2 = pts[0];
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const d = distance(pts[i], pts[j]);
        if (d > maxDist) {
          maxDist = d;
          v1 = pts[i];
          v2 = pts[j];
        }
      }
    }
    let maxDistFromLine = 0, v3 = pts[0];
    for (const point of pts) {
      const A = v2.y - v1.y;
      const B = v1.x - v2.x;
      const C = v2.x * v1.y - v1.x * v2.y;
      const distFromLine = Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
      if (distFromLine > maxDistFromLine) {
        maxDistFromLine = distFromLine;
        v3 = point;
      }
    }
    return maxDistFromLine > 30;
  };

  const refineShape = () => {
    if (points.length < 3) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(0, 123, 255, 0.08)";

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    const width = maxX - minX;
    const height = maxY - minY;

    if (Math.abs(width - height) < 30 && width > 30) {
      ctx.beginPath();
      ctx.ellipse(minX + width / 2, minY + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return;
    }
    if (isRectangle(points)) {
      ctx.beginPath();
      ctx.rect(minX, minY, width, height);
      ctx.fill();
      ctx.stroke();
      return;
    }
    if (isTriangle(points)) {
      let maxDist = 0, v1 = points[0], v2 = points[0];
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const d = distance(points[i], points[j]);
          if (d > maxDist) {
            maxDist = d;
            v1 = points[i];
            v2 = points[j];
          }
        }
      }
      let maxDistFromLine = 0, v3 = points[0];
      for (const point of points) {
        const A = v2.y - v1.y;
        const B = v1.x - v2.x;
        const C = v2.x * v1.y - v1.x * v2.y;
        const distFromLine = Math.abs(A * point.x + B * point.y + C) / Math.sqrt(A * A + B * B);
        if (distFromLine > maxDistFromLine) {
          maxDistFromLine = distFromLine;
          v3 = point;
        }
      }
      ctx.beginPath();
      ctx.moveTo(v1.x, v1.y);
      ctx.lineTo(v2.x, v2.y);
      ctx.lineTo(v3.x, v3.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      return;
    }

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
  };

  // ============= Download / Save functions =============
  const downloadDiagram = () => {
    refineShape();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setTimeout(() => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "refined-shape.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 100);
  };

  const saveDiagramToDB = async () => {
    refineShape();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imgData = canvas.toDataURL("image/png"); // base64 string
    try {
      const res = await axios.post(
        `http://localhost:3000/api/diagrams/save/${finalUserId}`,
        { img: imgData }
      );
      alert("Diagram saved to DB successfully!");
      console.log("Saved:", res.data);
    } catch (err) {
      console.error(err);
      alert("Error saving diagram.");
    }
  };

  // ============= Logout =============
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="text-center my-4" style={{ backgroundImage: `url(https://png.pngtree.com/background/20210716/original/pngtree-abstract-white-diamond-shape-background-picture-image_1401078.jpg)` }}>
      <h3 className="fw-bold mb-3">Draw a Shape</h3>
      <canvas
        ref={canvasRef}
        width={600}
        height={326}
        className="bg-white rounded border"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{ cursor: drawing ? "crosshair" : "pointer" }}
      />
      <div className="mt-3">
        <button className="btn btn-success me-2" onClick={refineShape}>
          Refine Shape
        </button>
        <button className="btn btn-primary me-2" onClick={downloadDiagram}>
          Download
        </button>
        <button className="btn btn-warning me-2" onClick={saveDiagramToDB}>
          Save to DB
        </button>
        <button className="btn btn-outline-secondary me-2" onClick={clearCanvas}>
          Clear
        </button>
        <a href={`/gallery/${finalUserId}`} className="btn btn-primary me-2">Go to Gallery</a>
        <button className="btn btn-danger " onClick={handleLogout}>
          Logout
        </button>
        
      </div>
    </div>
  );
}
