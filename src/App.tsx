import { useRef, useState } from "react";
import Tree from "./Tree";
import hardy from "./data/Hardy Fence.json";
import ozark from "./data/Ozark Fence.json";
import denco from "./data/Denco Fence.json";
import fenceworks from "./data/3_23 Fenceworks LLC.json";
import henderson from "./data/Henderson Fence.json";
import fenceline from "./data/Fence_Line_Construction.json";
import sourthern from "./data/Southern Exteriors Fence Co.json";
import { Data } from "./types";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Select,
  Text,
} from "@chakra-ui/react";
import { TreeGraph } from "@antv/g6";

const datas = {
  "Hardy Fence": hardy,
  "Ozark Fence": ozark,
  "Denco Fence": denco,
  "3/23 Fenceworks LLC": fenceworks,
  "Henderson Fence": henderson,
  "Fence Line Construction": fenceline,
  "Southern Exteriors Fence Co": sourthern,
} as {
  [key: string]: any;
};
const companies = Object.keys(datas);

function App() {
  const [company, setCompany] = useState(companies[0]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const nodes = datas[company].children;
  console.log(nodes.length);

  const data = {
    isRoot: true,
    id: "root",
    name: "",
    children: nodes.slice((page - 1) * pageSize, page * pageSize),
  } as Data;
  const graph = useRef<TreeGraph | null>(null);

  return (
    <div className="px-4 flex">
      <Box className="space-y-8 mt-8 ml-5 flex flex-col flex-shrink-0">
        <FormControl>
          <FormLabel>Company</FormLabel>
          <Select
            value={company}
            onChange={(e) => {
              setCompany(e.target.value);
              setPage(1);
            }}
          >
            {companies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Root bundles per page</FormLabel>
          <Select
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
          </Select>
        </FormControl>
        <div className="flex justify-between w-full items-center">
          <Button
            colorScheme="orange"
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
          >
            Prev
          </Button>
          <div>Page {page}</div>
          <Button
            colorScheme="orange"
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= nodes.length / pageSize}
          >
            Next
          </Button>
        </div>
        <div className="space-x-2 flex items-center">
          <Button
            colorScheme={"orange"}
            disabled={pageSize > 20}
            className="btn"
            onClick={() => {
              graph.current?.downloadFullImage(company, "image/png", {
                backgroundColor: "#ddd",
                padding: [30, 15, 15, 15],
              });
            }}
          >
            Export As PNG
          </Button>
          {pageSize > 20 && <Text color="red.400">Too large to export</Text>}
        </div>
      </Box>
      <div className="flex-grow">
        <Tree name={company} graph={graph} data={data} />
      </div>
    </div>
  );
}

export default App;
