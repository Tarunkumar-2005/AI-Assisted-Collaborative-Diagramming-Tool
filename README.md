# 🖊️ AI-Assisted Collaborative Diagramming Tool

## 📌 Overview
This project is a **real-time, web-based collaborative whiteboard** that allows multiple users to draw diagrams together.  

The standout feature is an **AI-assisted cleanup system powered by heuristics**, which automatically recognizes and refines messy sketches into clean, structured diagrams (e.g., circles, rectangles, arrows, and lines).

---

## ✨ Features
- 📝 Freehand drawing on a shared canvas  
- 🤝 Real-time collaboration (multi-user support)  
- 🧠 AI-assisted diagram cleanup using heuristics:  
  - Circle detection & smoothing  
  - Rectangle snapping  
  - Arrow recognition  
- 🔄 Auto-adjust connections when nodes move
-  JWT Authentication Feature
- 🗑️ Diagram saved in Mongodb and also delete functionality  
- 💾 Export diagrams as PNG  

---

## ⚙️ Tech Stack
- **Frontend:** React + Vite + Canvas API  
- **Backend:** Node.js + Express + MongoDB  
- **AI / Heuristics:** Geometry-based rules  

---

## ▶️ Commands to Run Project
### Frontend and Backend
```sh
npm run dev
nodemon server.js
