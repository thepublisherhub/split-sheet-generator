import React, { useState } from "react";

export default function App() {
  const [work, setWork] = useState({
    title: "",
    altTitle: "",
    iswc: "",
    language: "",
    recordingTitle: "",
    recordingArtist: "",
    recordingLabel: "",
    isrc: "",
    upc: "",
    releaseDate: "",
  });

  const [writers, setWriters] = useState([
    { first: "", middle: "", last: "", share: "", pro: "", ipi: "", pub_name: "", pub_pro: "", pub_ipi: "", pub_contact: "", pub_address: "" },
  ]);

  const addWriter = () =>
    setWriters([...writers, { first: "", middle: "", last: "", share: "", pro: "", ipi: "", pub_name: "", pub_pro: "", pub_ipi: "", pub_contact: "", pub_address: "" }]);

  const handleWriterChange = (idx, field, value) => {
    const copy = [...writers];
    copy[idx][field] = value;
    setWriters(copy);
  };

  const generatePDF = async () => {
    const res = await fetch("/.netlify/functions/generateSplit", {
      method: "POST",
      body: JSON.stringify({ work, writers }),
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SplitSheet_${work.title || "Untitled"}.pdf`;
    a.click();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-teal-600">The Publisher Hub</h1>
      <h2 className="text-lg text-gray-600">Split Sheet Generator</h2>

      <section className="space-y-2">
        <h3 className="font-semibold">Work Information</h3>
        <input placeholder="Work Title" className="border p-2 w-full" value={work.title} onChange={e => setWork({ ...work, title: e.target.value })} />
        <input placeholder="Alt Title" className="border p-2 w-full" value={work.altTitle} onChange={e => setWork({ ...work, altTitle: e.target.value })} />
        <input placeholder="ISWC" className="border p-2 w-full" value={work.iswc} onChange={e => setWork({ ...work, iswc: e.target.value })} />
        <input placeholder="Language" className="border p-2 w-full" value={work.language} onChange={e => setWork({ ...work, language: e.target.value })} />
      </section>

      <section>
        <h3 className="font-semibold mb-2">Writers</h3>
        {writers.map((w, i) => (
          <div key={i} className="border p-3 mb-3 rounded bg-white shadow-sm space-y-2">
            <input placeholder="First Name" className="border p-1 w-full" value={w.first} onChange={e => handleWriterChange(i, "first", e.target.value)} />
            <input placeholder="Middle Name" className="border p-1 w-full" value={w.middle} onChange={e => handleWriterChange(i, "middle", e.target.value)} />
            <input placeholder="Last Name" className="border p-1 w-full" value={w.last} onChange={e => handleWriterChange(i, "last", e.target.value)} />
            <input placeholder="Share %" className="border p-1 w-full" value={w.share} onChange={e => handleWriterChange(i, "share", e.target.value)} />
            <input placeholder="Writer PRO" className="border p-1 w-full" value={w.pro} onChange={e => handleWriterChange(i, "pro", e.target.value)} />
            <input placeholder="Writer IPI" className="border p-1 w-full" value={w.ipi} onChange={e => handleWriterChange(i, "ipi", e.target.value)} />
            <input placeholder="Publisher Name" className="border p-1 w-full" value={w.pub_name} onChange={e => handleWriterChange(i, "pub_name", e.target.value)} />
            <input placeholder="Publisher PRO" className="border p-1 w-full" value={w.pub_pro} onChange={e => handleWriterChange(i, "pub_pro", e.target.value)} />
            <input placeholder="Publisher IPI" className="border p-1 w-full" value={w.pub_ipi} onChange={e => handleWriterChange(i, "pub_ipi", e.target.value)} />
            <input placeholder="Publisher Contact Email" className="border p-1 w-full" value={w.pub_contact} onChange={e => handleWriterChange(i, "pub_contact", e.target.value)} />
            <input placeholder="Publisher Address" className="border p-1 w-full" value={w.pub_address} onChange={e => handleWriterChange(i, "pub_address", e.target.value)} />
          </div>
        ))}
        <button onClick={addWriter} className="bg-gray-200 px-3 py-1 rounded">+ Add Writer</button>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Recording Info</h3>
        <input placeholder="Recording Title" className="border p-2 w-full" value={work.recordingTitle} onChange={e => setWork({ ...work, recordingTitle: e.target.value })} />
        <input placeholder="Artist" className="border p-2 w-full" value={work.recordingArtist} onChange={e => setWork({ ...work, recordingArtist: e.target.value })} />
        <input placeholder="Label" className="border p-2 w-full" value={work.recordingLabel} onChange={e => setWork({ ...work, recordingLabel: e.target.value })} />
        <input placeholder="ISRC" className="border p-2 w-full" value={work.isrc} onChange={e => setWork({ ...work, isrc: e.target.value })} />
        <input placeholder="UPC" className="border p-2 w-full" value={work.upc} onChange={e => setWork({ ...work, upc: e.target.value })} />
        <input placeholder="Release Date" className="border p-2 w-full" value={work.releaseDate} onChange={e => setWork({ ...work, releaseDate: e.target.value })} />
      </section>

      <button onClick={generatePDF} className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:bg-teal-600">
        Generate Split Sheet PDF
      </button>
    </div>
  );
}
