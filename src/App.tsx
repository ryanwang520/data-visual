import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Tree from "./Tree";
import hardy from "./data/Hardy Fence.json";
import ozark from "./data/Ozark Fence.json";

const companies = ["Hardy Fence", "Ozark Fence"];
const datas = {
  "Hardy Fence": hardy,
  "Ozark Fence": ozark,
};

function App() {
  const [company, setCompany] = useState(companies[0]);
  return (
    <div>
      <select value={company} onChange={(e) => setCompany(e.target.value)}>
        {companies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <Tree key={company} data={datas[company]} />
    </div>
  );
}

export default App;
