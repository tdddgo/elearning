import { useState, useCallback } from "react";

const DEFAULT_DATA = [
  { title: "Diseño 4D: Tecnologías de Fabricación", matriculados: 0, nuevo: 0, contactados: 0, interesado: 0, seleccionados: 0, totalAfluencia: 6 },
  { title: "Escritura Académica e Investigación", matriculados: 0, nuevo: 0, contactados: 0, interesado: 0, seleccionados: 0, totalAfluencia: 6 },
  { title: "Derecho de Familia, Mediación e Inter.", matriculados: 0, nuevo: 213, contactados: 10, interesado: 0, seleccionados: 0, totalAfluencia: 225 },
  { title: "Comunicación y Marketing Digital", matriculados: 1, nuevo: 195, contactados: 9, interesado: 1, seleccionados: 0, totalAfluencia: 206 },
  { title: "Psicoterapia Online: Diseño y Análisis", matriculados: 1, nuevo: 187, contactados: 2, interesado: 0, seleccionados: 0, totalAfluencia: 194 },
  { title: "Dinámica y Espacialidad Escénica", matriculados: 2, nuevo: 95, contactados: 4, interesado: 0, seleccionados: 0, totalAfluencia: 104 },
  { title: "Comunicaciones Internas", matriculados: 1, nuevo: 40, contactados: 1, interesado: 0, seleccionados: 0, totalAfluencia: 41 },
  { title: "Producción de Espectáculos - Online", matriculados: 0, nuevo: 31, contactados: 0, interesado: 0, seleccionados: 0, totalAfluencia: 67 },
  { title: "Compliance, Integridad y Gestión Repu.", matriculados: 0, nuevo: 25, contactados: 0, interesado: 1, seleccionados: 0, totalAfluencia: 26 },
  { title: "E-Learning", matriculados: 0, nuevo: 6, contactados: 0, interesado: 0, seleccionados: 0, totalAfluencia: 6 },
  { title: "LSCh: Primeros Auxilios", matriculados: 0, nuevo: 771, contactados: 18, interesado: 1, seleccionados: 0, totalAfluencia: 796 },
];

const METRICS = [
  { key: "totalAfluencia", label: "Total Afluencia", color: "#38bdf8" },
  { key: "nuevo",          label: "Nuevos",          color: "#34d399" },
  { key: "contactados",    label: "Contactados",      color: "#f59e0b" },
  { key: "matriculados",   label: "Matriculados",     color: "#a78bfa" },
  { key: "interesado",     label: "Interesados",      color: "#fb7185" },
  { key: "seleccionados",  label: "Seleccionados",    color: "#4ade80" },
];

const CSV_TEMPLATE = `title,matriculados,nuevo,contactados,interesado,seleccionados,totalAfluencia
Diseño 4D: Tecnologías de Fabricación,0,0,0,0,0,6
Escritura Académica e Investigación,0,0,0,0,0,6
Derecho de Familia Mediación e Inter.,0,213,10,0,0,225
Comunicación y Marketing Digital,1,195,9,1,0,206
Psicoterapia Online: Diseño y Análisis,1,187,2,0,0,194
Dinámica y Espacialidad Escénica,2,95,4,0,0,104
Comunicaciones Internas,1,40,1,0,0,41
Producción de Espectáculos - Online,0,31,0,0,0,67
Compliance Integridad y Gestión Repu.,0,25,0,1,0,26
E-Learning,0,6,0,0,0,6
LSCh: Primeros Auxilios,0,771,18,1,0,796`;

function parseCSV(text) {
  const lines = text.trim().split("\n").filter(l => l.trim());
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const vals = line.split(",").map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = isNaN(vals[i]) ? vals[i] : Number(vals[i]);
    });
    return obj;
  });
}

function downloadTemplate() {
  const blob = new Blob([CSV_TEMPLATE], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "programas_template.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [active, setActive] = useState("totalAfluencia");
  const [asc, setAsc] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  const metric = METRICS.find(m => m.key === active);
  const maxVal = Math.max(...data.map(d => d[active]), 1);
  const total = data.reduce((s, d) => s + d[active], 0);
  const avg = (total / data.length).toFixed(1);
  const withData = data.filter(d => d[active] > 0).length;
  const sorted = [...data].sort((a, b) => asc ? a[active] - b[active] : b[active] - a[active]);

  const handleFile = useCallback((file) => {
    if (!file || !file.name.endsWith(".csv")) {
      setError("Solo se aceptan archivos .csv"); return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = parseCSV(e.target.result);
        if (!parsed.length || !parsed[0].title) throw new Error("Formato inválido");
        setData(parsed);
        setFileName(file.name);
        setError(null);
      } catch {
        setError("Error al leer el CSV. Revisa que use el formato correcto.");
      }
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const onInputChange = (e) => handleFile(e.target.files[0]);

  return (
    <div style={{ background: "linear-gradient(160deg,#0c1322 0%,#162032 100%)", minHeight: "100vh", padding: "24px 28px", fontFamily: "'Trebuchet MS', sans-serif", color: "#e2e8f0" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid #1e3a5f", paddingBottom: "14px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#f0f8ff" }}>📊 Tablero de Programas Académicos</h1>
          <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#4a7fa5" }}>
            1° Semestre 2026 · {data.length} programas
            {fileName && <span style={{ color: "#34d399", marginLeft: "8px" }}>✓ {fileName}</span>}
          </p>
        </div>
        <button onClick={downloadTemplate} style={{
          background: "#0f1f33", border: "1px solid #1e3a5f", color: "#4a7fa5",
          padding: "7px 14px", borderRadius: "8px", fontSize: "11px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          ⬇ Descargar plantilla CSV
        </button>
      </div>

      {/* CSV Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragging ? "#38bdf8" : "#1e3a5f"}`,
          borderRadius: "12px", padding: "18px", marginBottom: "20px",
          background: dragging ? "#38bdf810" : "#0a1628",
          textAlign: "center", transition: "all 0.2s", cursor: "pointer",
        }}
        onClick={() => document.getElementById("csv-input").click()}
      >
        <input id="csv-input" type="file" accept=".csv" style={{ display: "none" }} onChange={onInputChange} />
        <div style={{ fontSize: "22px", marginBottom: "4px" }}>📂</div>
        <div style={{ fontSize: "13px", color: "#4a7fa5" }}>
          {dragging ? "Suelta el archivo aquí" : "Arrastra tu CSV aquí o haz clic para seleccionarlo"}
        </div>
        <div style={{ fontSize: "11px", color: "#2a4a65", marginTop: "4px" }}>
          Exporta tu Excel como .csv y súbelo — los datos se actualizan al instante
        </div>
        {error && <div style={{ color: "#fb7185", fontSize: "12px", marginTop: "6px" }}>⚠ {error}</div>}
      </div>

      {/* Metric Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        {METRICS.map(m => (
          <button key={m.key} onClick={() => setActive(m.key)} style={{
            padding: "6px 14px", borderRadius: "24px", cursor: "pointer",
            border: `2px solid ${active === m.key ? m.color : "#1e3a5f"}`,
            background: active === m.key ? m.color + "22" : "#0f1f33",
            color: active === m.key ? m.color : "#4a7fa5",
            fontSize: "12px", fontWeight: active === m.key ? 600 : 400, transition: "all 0.2s",
          }}>{m.label}</button>
        ))}
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginBottom: "20px" }}>
        {[["TOTAL", total], ["MÁXIMO", maxVal], ["PROMEDIO", avg], ["CON DATOS", `${withData}/${data.length}`]].map(([l, v]) => (
          <div key={l} style={{ background: "#0f1f33", border: `1px solid ${metric.color}35`, borderRadius: "12px", padding: "14px 16px", borderTop: `3px solid ${metric.color}` }}>
            <div style={{ fontSize: "10px", color: "#4a7fa5", letterSpacing: "0.1em", marginBottom: "4px" }}>{l}</div>
            <div style={{ fontSize: "26px", fontWeight: 700, color: metric.color, lineHeight: 1 }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: "#0f1f33", borderRadius: "14px", padding: "18px", border: "1px solid #1e3a5f" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ color: metric.color, fontSize: "13px", fontWeight: 600 }}>{metric.label} por programa</span>
          <button onClick={() => setAsc(a => !a)} style={{ background: "#162032", border: "1px solid #1e3a5f", color: "#4a7fa5", padding: "4px 12px", borderRadius: "8px", fontSize: "11px", cursor: "pointer" }}>
            {asc ? "↑ Menor a mayor" : "↓ Mayor a menor"}
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
          {sorted.map((item, i) => {
            const pct = (item[active] / maxVal) * 100;
            const label = (item.title || "").length > 38 ? item.title.slice(0, 38) + "…" : item.title;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "195px", minWidth: "195px", fontSize: "11px", color: "#7aa8cc", textAlign: "right", lineHeight: 1.4 }}>{label}</div>
                <div style={{ flex: 1, height: "26px", background: "#162032", borderRadius: "5px", position: "relative", overflow: "hidden" }}>
                  <div style={{
                    width: `${pct}%`, height: "100%", borderRadius: "5px",
                    background: `linear-gradient(90deg,${metric.color}55,${metric.color})`,
                    transition: "width 0.45s cubic-bezier(0.4,0,0.2,1)",
                    minWidth: item[active] > 0 ? "5px" : "0",
                    display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "7px",
                  }}>
                    {pct > 18 && <span style={{ fontSize: "11px", fontWeight: 700, color: "#0c1322" }}>{item[active]}</span>}
                  </div>
                  {pct <= 18 && (
                    <span style={{ position: "absolute", left: `${pct + 1.5}%`, top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "#4a7fa5" }}>{item[active]}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "14px", fontSize: "10px", color: "#1e3a5f" }}>
        Para actualizar: exporta tu Excel como CSV y arrástralo al tablero
      </div>
    </div>
  );
}
