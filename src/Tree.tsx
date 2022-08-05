import ReactDOM from "react-dom";
import G6 from "@antv/g6";
import { useEffect, useRef } from "react";
const data = {
  isRoot: true,
  id: "root",
  style: {
    fill: "red",
  },
  name: "root",
  children: [
    {
      id: "1",
      name: "bundle1",
      options: ["a", "b", "c"],
      children: [],
    },
    {
      id: "2",
      name: "bundle2",
      children: [],
    },
    {
      id: "3",
      name: "bundle3",
      children: [],
    },
  ],
};

export default function Tree() {
  const node = useRef<HTMLDivElement | null>(null);

  let graph = null;
  useEffect(() => {
    if (graph) {
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
        console.log(e.item?.getModel().options);
        outDiv.style.width = "fit-content";
        //outDiv.style.padding = '0px 0px 20px 0px';
        outDiv.innerHTML = `
          <ul>
          ${(e.item?.getModel().options || [])
            .map((item) => `<li>${item}</li>`)
            .join("")}
          </ul>
          `;
        return outDiv;
      },
      shouldBegin: (e) => {
        return true;
      },
    });

    const container = node.current!;
    // const width = container.scrollWidth;
    // const height = container.scrollHeight || 500;
    graph = new G6.TreeGraph({
      container: node.current!,
      width: 1000,
      height: 800,
      linkCenter: true,
      modes: {
        default: [
          {
            type: "collapse-expand",
            onChange: function onChange(item, collapsed) {
              const data = item.get("model");
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
        getId: function getId(d) {
          return d.id;
        },
        getHeight: function getHeight() {
          return 16;
        },
        getWidth: function getWidth() {
          return 16;
        },
        getVGap: function getVGap() {
          return 10;
        },
        getHGap: function getHGap() {
          return 100;
        },
      },
    });

    graph.node(function (node) {
      return {
        size: 16,
        anchorPoints: [
          [0, 0.5],
          [1, 0.5],
        ],
        style: {
          fill: "#C6E5FF",
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
    let i = 0;
    graph.edge(function () {
      i++;
      return {
        type: "cubic-horizontal",
        color: "#A3B1BF",
        label: i,
      };
    });

    graph.data(data);
    graph.render();
    graph.fitView();

    if (typeof window !== "undefined")
      window.onresize = () => {
        if (!graph || graph.get("destroyed")) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
  }, []);

  return <div ref={node}></div>;
}
