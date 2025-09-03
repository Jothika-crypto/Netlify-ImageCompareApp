import React, { useState } from "react";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";

export default function App() {
  const [cases, setCases] = useState([]);
  const [selected, setSelected] = useState(null);

  // Handle file upload (failed-report.html)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Extract cases
    const caseDivs = doc.querySelectorAll(".case");
    const extracted = [];
    caseDivs.forEach((div) => {
      const name = div.querySelector("h2")?.textContent;
      const imgs = Array.from(div.querySelectorAll("img")).map((img) => ({
        alt: img.alt,
        src: img.src,
      }));

      if (imgs.length === 3) {
        extracted.push({ name, base: imgs[0], actual: imgs[1], diff: imgs[2] });
      }
    });

    setCases(extracted);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Failed Testcase Viewer</h1>

      {/* Grid View */}
      {!selected && (
        <>
          <input type="file" accept=".html" onChange={handleFileUpload} />
          <div>
            {cases.map((c, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  margin: "20px 0",
                  padding: 10,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <h2>{c.name}</h2>
                <div style={{ display: "flex", gap: 20 }}>
                  <div>
                    <p>{c.base.alt}</p>
                    <img src={c.base.src} alt={c.base.alt} height={150} />
                  </div>
                  <div>
                    <p>{c.actual.alt}</p>
                    <img src={c.actual.src} alt={c.actual.alt} height={150} />
                  </div>
                  <div>
                    <p>{c.diff.alt}</p>
                    <img src={c.diff.src} alt={c.diff.alt} height={150} />
                  </div>
                </div>
                <button
                  onClick={() => setSelected(c)}
                  style={{
                    marginTop: 10,
                    padding: "6px 12px",
                    border: "none",
                    borderRadius: "4px",
                    background: "#007bff",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Compare Base vs Actual
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Compare Mode */}
      {selected && (
        <div>
          <h2>{selected.name} - Compare</h2>
          <div style={{ maxWidth: "800px", margin: "20px auto" }}>
            <ReactCompareSlider itemOne={<ReactCompareSliderImage src={selected.base.src} alt="Base" />} itemTwo={<ReactCompareSliderImage src={selected.actual.src} alt="Actual" />} position={50} style={{ width: "100%", height: "500px" }} />
          </div>
          <button
            style={{
              marginTop: 20,
              padding: "6px 12px",
              border: "none",
              borderRadius: "4px",
              background: "#555",
              color: "white",
              cursor: "pointer",
            }}
            onClick={() => setSelected(null)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
