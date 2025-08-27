import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function handler(event) {
  const { work, writers } = JSON.parse(event.body);
  const today = new Date().toISOString().split("T")[0];

  const esc = s => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g,"&#39;");
  const fullName = w => [w.first, w.middle, w.last].filter(Boolean).join(" ");

  const rows = (writers || []).map(
    (w, i) => `
    <tr>
      <td>${i+1}</td>
      <td>${esc(fullName(w))}</td>
      <td>${esc(w.share||"")}%</td>
      <td>${esc(w.pro||"")}${w.ipi?(" / IPI "+esc(w.ipi)):""}</td>
      <td>
        <div><b>${esc(w.pub_name||"")}</b></div>
        <div class="tiny">PRO: ${esc(w.pub_pro||"")}${w.pub_ipi?(" / IPI "+esc(w.pub_ipi)):""}</div>
        ${w.pub_contact?('<div class="tiny">Email: '+esc(w.pub_contact)+'</div>'):''}
        ${w.pub_address?('<div class="tiny">Addr: '+esc(w.pub_address)+'</div>'):''}
      </td>
    </tr>`
  ).join("");

  const workMeta = `
    <div class="kv"><b>Work Title:</b> ${esc(work.title)}</div>
    <div class="kv"><b>Alt Title:</b> ${esc(work.altTitle)}</div>
    <div class="kv"><b>ISWC:</b> ${esc(work.iswc)}</div>
    <div class="kv"><b>Language:</b> ${esc(work.language)}</div>
  `;

  const recMeta = `
    <div class="kv"><b>Recording Title:</b> ${esc(work.recordingTitle)}</div>
    <div class="kv"><b>Artist:</b> ${esc(work.recordingArtist)}</div>
    <div class="kv"><b>Label:</b> ${esc(work.recordingLabel)}</div>
    <div class="kv"><b>ISRC:</b> ${esc(work.isrc)}</div>
    <div class="kv"><b>UPC:</b> ${esc(work.upc)}</div>
    <div class="kv"><b>Release Date:</b> ${esc(work.releaseDate)}</div>
  `;

  const legal = `
  <p>
    This Split Sheet (“Agreement”) confirms the authorship and ownership shares of the musical composition titled
    “${esc(work.title)}” (the “Work”). By signing below, each undersigned writer acknowledges and agrees to the
    percentage of ownership indicated next to their name in the Writers table. Percentages are intended to total 100%.
  </p>
  <ol>
    <li><b>Ownership & Administration.</b> Each writer (or their publisher, if applicable) owns the stated share. Unless otherwise agreed in writing,
        each party administers and collects their own share worldwide.</li>
    <li><b>Warranties.</b> Each writer represents they are authorized to grant their stated share and that their contribution does not infringe third-party rights.</li>
    <li><b>Registrations.</b> The parties will cooperate in registering the Work and their respective shares with applicable societies, including PROs and mechanical agencies.</li>
    <li><b>Disputes.</b> Any split dispute will be negotiated in good faith. Until resolved, parties may notify societies that the Work is “in dispute”.</li>
    <li><b>Governing Law.</b> This Agreement is governed by the laws of the Commonwealth of Puerto Rico. Venue and jurisdiction lie in its competent courts.</li>
    <li><b>Counterparts & E-Sign.</b> This Agreement may be signed in counterparts (including electronic signatures) and together forms one agreement.</li>
  </ol>
  `;

  const signatures = (writers||[]).map(w=>`
    <div class="line">
      <div class="l"></div>
      <div class="tiny">Writer: ${esc(fullName(w))}</div>
      <div class="tiny">Date: ${today}</div>
    </div>
  `).join("");

  const html = `
<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 18mm 16mm; }
  body { font-family: Arial, sans-serif; color:#111; }
  .hdr{ display:flex; align-items:center; justify-content:space-between; margin-bottom:8px }
  .logo{ width:14px; height:14px; border-radius:4px; background: linear-gradient(135deg, #22d3ee, #6ee7b7); display:inline-block; margin-right:8px }
  h1 { margin:0; font-size:19px }
  .mut { color:#666; font-size:12px; margin:2px 0 10px }
  .section { border:1px solid #ddd; border-radius:10px; padding:10px 12px; margin:10px 0; }
  .kv { margin:2px 0; font-size:12.5px }
  table { width:100%; border-collapse:collapse; margin-top:6px; font-size:12px }
  th, td { border:1px solid #ddd; padding:6px 8px; vertical-align:top }
  th { background:#f3faff; text-align:left }
  .sig { margin-top:14px; display:flex; gap:16px; flex-wrap:wrap }
  .line { flex:1 1 240px; }
  .line .l { border-bottom:1px solid #000; height:22px; margin:0 0 6px }
  .tiny{ font-size:10.5px; color:#444 }
</style>
</head>
<body>
  <div class="hdr">
    <div><span class="logo"></span><strong>The Publisher Hub</strong></div>
    <div class="tiny">Generated: ${today}</div>
  </div>
  <h1>Split Sheet — “${esc(work.title||"")}”</h1>
  <div class="mut">This document summarizes contributor shares for the composition below.</div>

  <div class="section">
    <h3>Work</h3>
    ${workMeta}
  </div>

  <div class="section">
    <h3>Recordings</h3>
    ${recMeta}
  </div>

  <div class="section">
    <h3>Writers & Publishers</h3>
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Writer</th>
          <th>Share %</th>
          <th>Writer Society / IPI</th>
          <th>Publisher (Name / PRO / IPI / Contacts)</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="tiny" style="margin-top:6px">Note: Percentages should sum to 100%.</div>
  </div>

  <div class="section">
    <h3>Agreement</h3>
    ${legal}
  </div>

  <div class="section">
    <h3>Signatures</h3>
    <div class="sig">${signatures}</div>
  </div>

</body></html>`;

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="SplitSheet_${work.title || "Untitled"}.pdf"`
    },
    body: pdf.toString("base64"),
    isBase64Encoded: true
  };
}
