import { useEffect, useState, lazy, Suspense } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const DebugConsole = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!window.location.search.includes("debug=true")) return;
    setShow(true);

    const handleLog = (type: string, ...args: any[]) => {
      const msg = `[${type}] ${args.map(a => {
        if (a instanceof Error) {
          return `${a.name}: ${a.message}\nStack:\n${a.stack}`;
        }
        return typeof a === 'object' ? JSON.stringify(a) : String(a);
      }).join(' ')}`;
      setLogs(prev => [...prev.slice(-49), msg]);
    };

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
      originalLog(...args);
      handleLog("LOG", ...args);
    };
    console.warn = (...args) => {
      originalWarn(...args);
      handleLog("WARN", ...args);
    };
    console.error = (...args) => {
      originalError(...args);
      handleLog("ERROR", ...args);
    };

    const handleError = (e: ErrorEvent) => {
      handleLog("UNCAUGHT", e.message, e.filename, e.lineno);
    };
    const handleRejection = (e: PromiseRejectionEvent) => {
      handleLog("REJECTION", e.reason);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: "35vh",
      overflowY: "auto",
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      color: "#ff4444",
      fontFamily: "monospace",
      fontSize: "11px",
      zIndex: 99999999999,
      padding: "12px",
      borderTop: "3px solid #ff3333",
      pointerEvents: "auto",
      textAlign: "left"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", borderBottom: "1px solid #ff3333", paddingBottom: "4px" }}>
        <span style={{ color: "#ffffff", fontWeight: "bold" }}>DEVELOPER CONSOLE (debug=true)</span>
        <button onClick={() => setLogs([])} style={{ color: "#ff3333", background: "none", border: "1px solid #ff3333", fontSize: "10px", padding: "2px 6px", cursor: "pointer", borderRadius: "3px" }}>Clear</button>
      </div>
      {logs.length === 0 ? <div style={{ color: "#888888" }}>No logs captured yet. Try reloading.</div> : logs.map((log, idx) => (
        <div key={idx} style={{ whiteSpace: "pre-wrap", borderBottom: "1px solid #222", padding: "4px 0", color: log.includes("ERROR") || log.includes("UNCAUGHT") || log.includes("REJECTION") ? "#ff4444" : log.includes("WARN") ? "#ffaa00" : "#ffffff" }}>{log}</div>
      ))}
    </div>
  );
};

const App = () => {
  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
      <DebugConsole />
    </>
  );
};

export default App;
