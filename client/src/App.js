import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import UploadEvidence from "./pages/UploadEvidence";
import SuspectList from "./pages/SuspectList";
import MovementTimeline from "./pages/MovementTimeline";
import RouteMap from "./pages/RouteMap";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Case Management */}
          <Route
            path="/cases"
            element={<Cases />}
          />

          <Route
            path="/upload"
            element={<UploadEvidence />}
          />

          {/* Suspect Ranking */}
          <Route
            path="/suspects"
            element={<SuspectList />}
          />

          {/* Movement Timeline */}
          <Route
            path="/movement/:number"
            element={<MovementTimeline />}
          />

          {/* Route Map */}
          <Route
            path="/map/:number"
            element={<RouteMap />}
          />

        </Routes>
      </BrowserRouter>

      <div
        style={{
          textAlign: "center",
          padding: "10px",
          marginTop: "20px",
        }}
      >
        Tower Dump Analysis For Crime Investigation
      </div>
    </>
  );
}

export default App;