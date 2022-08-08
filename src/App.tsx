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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const nodes = datas[company].children;
  console.log(nodes.length);

  const data = {
    isRoot: true,
    id: "root",
    name: "",
    children: nodes.slice((page - 1) * pageSize, page * pageSize),
  };

  return (
    <div className="px-4">
      <div className="py-4 space-x-8 flex items-center">
        <select value={company} onChange={(e) => setCompany(e.target.value)}>
          {companies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="flex space-x-4 items-center">
          <button
            className="btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            Prev
          </button>
          <div>Page {page}</div>
          <button
            className="btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= nodes.length / pageSize}
          >
            Next
          </button>
        </div>
        <label htmlFor="pageSizeSelector">Page size</label>
        <select
          id="pageSizeSelector"
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(+e.target.value);
          }}
        >
          {[5, 10, 20, 50, 100, 200].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <Tree
        name={company}
        pageSize={pageSize}
        key={company + String(page) + String(pageSize)}
        data={data}
      />
    </div>
  );
}

export default App;
