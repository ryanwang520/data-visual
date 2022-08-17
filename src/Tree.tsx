import G6, { TreeGraph } from "@antv/g6";
import { useEffect, useRef, useState } from "react";
import { Data, TreeNode } from "./types";

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

type Props = {
  data: Data;
  name: string;
  graph: React.MutableRefObject<TreeGraph | null>;
};
export default function Tree({ data, name, graph }: Props) {
  const node = useRef<HTMLDivElement | null>(null);
  const size = useWindowSize();
  console.log(size.height);
  useEffect(() => {
    if (graph.current) {
      graph.current.changeData(data);
      graph.current.fitCenter();
      return;
    }
    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 10,
      // the types of items that allow the tooltip show up
      // 允许出现 tooltip 的 item 类型
      itemTypes: ["node"],
      // custom the tooltip's content
      // 自定义 tooltip 内容
      getContent: (e) => {
        const outDiv = document.createElement("div");
        outDiv.style.width = "fit-content";
        //outDiv.style.padding = '0px 0px 20px 0px';
        const options: string[] =
          (e?.item?.getModel().options as string[]) || [];
        outDiv.innerHTML = `
          <ul>
          ${options.map((item) => `<li>${item}</li>`).join("")}
          </ul>
          `;
        return outDiv;
      },
      shouldBegin: (e) => {
        return e?.item?.getModel().node_type == "option_set";
      },
    });

    const container = node.current!;
    const width = container.scrollWidth;
    graph.current = new G6.TreeGraph({
      container: node.current!,
      width,
      height: size.height! - 80,
      // height: 1000,
      linkCenter: true,
      modes: {
        default: [
          {
            type: "collapse-expand",
            onChange: function onChange(item, collapsed) {
              const data = item?.get("model");
              data.collapsed = collapsed;
              return true;
            },
          },
          "drag-canvas",
          "zoom-canvas",
        ],
      },
      defaultNode: {
        size: 30,
      },
      plugins: [tooltip],
      layout: {
        type: "compactBox",
        direction: "LR",
        getId: function getId(d: TreeNode) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 8;
        },
        getWidth: function getWidth() {
          return 8;
        },
        getVGap: function getVGap() {
          return 10;
        },
        getHGap: function getHGap() {
          return 100;
        },
      },
    });

    // @ts-expect-error
    graph.current.node(function (node: TreeNode) {
      const color_map = {
        product: "#3991f1",
        bundle: "#4af2a1",
        option_set: "#b0f566",
      } as const;
      const fill = color_map[node.node_type];
      return {
        size: 16,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
        style: {
          fill: fill || "#C6E5FF",
          stroke: "#5B8FF9",
        },
        label: node.name,
        labelCfg: {
          position:
            node.children && node.children.length > 0 ? "left" : "right",
          offset: 5,
        },
      };
    });

    graph.current.data(data);
    graph.current.render();
    graph.current.fitCenter();

    if (typeof window !== "undefined")
      window.onresize = () => {
        if (!graph || graph.current?.get("destroyed")) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        graph.current?.changeSize(
          container.scrollWidth,
          container.scrollHeight
        );
      };
  }, [data, name]);
  return (
    <div style={{ marginTop: "20px" }}>
      <div ref={node}></div>;
    </div>
  );
}
