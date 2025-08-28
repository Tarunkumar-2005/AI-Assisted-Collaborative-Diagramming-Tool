import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Gallery() {
  const { userId } = useParams();
  const [diagrams, setDiagrams] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/diagrams/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setDiagrams(data))
      .catch((err) => console.error("Error fetching diagrams:", err));
  }, [userId]);

  return (
    <div className="container mt-4" style={{ backgroundImage: `url(https://png.pngtree.com/background/20210716/original/pngtree-abstract-white-diamond-shape-background-picture-image_1401078.jpg)` }}>
      <h2 className="mb-4 text-center">My Gallery</h2>
      <div className="row">
        {diagrams.map((diagram) => (
          <div className="col-md-4 mb-4" key={diagram._id}>
            <div className="card shadow-sm">
              <img
                src={diagram.img}
                alt="diagram"
                className="card-img-top"
                style={{ maxHeight: "250px", objectFit: "cover" }}
              />
              <div className="card-body">
                <p className="card-text">
                  Uploaded on {new Date(diagram.createdAt).toLocaleString()}
                </p>
                <button
                  className="btn btn-danger"
                  onClick={async () => {
                    try {
                      await fetch(
                        `http://localhost:3000/api/diagrams/delete/${diagram._id}`,
                        { method: "DELETE" }
                      );
                      setDiagrams(diagrams.filter((d) => d._id !== diagram._id));
                    } catch (err) {
                      console.error("Error deleting diagram:", err);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {diagrams.length === 0 && (
          <p className="text-muted">No diagrams uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
