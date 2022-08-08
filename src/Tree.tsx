import ReactDOM from "react-dom";
import G6, { TreeGraph } from "@antv/g6";
import { useEffect, useRef, useState } from "react";

export default function Tree({ data, name, pageSize }) {
  const node = useRef<HTMLDivElement | null>(null);

  const graph = useRef<TreeGraph>(null);
  useEffect(() => {
    // if (graph) {
    //   return;
    // }
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
        return e.item?.getModel().node_type == "option_set";
      },
    });

    const container = node.current!;
    const width = container.scrollWidth;
    const height = container.scrollHeight;
    graph.current = new G6.TreeGraph({
      container: node.current!,
      width,
      height: 2000,
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
          return 5;
        },
        getHGap: function getHGap() {
          return 400;
        },
      },
    });

    graph.current.node(function (node) {
      const color_map = {
        product: "#3991f1",
        bundle: "#4af2a1",
        option_set: "#b0f566",
      };
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
    let i = 0;
    // graph.edge(function () {
    //   i++;
    //   return {
    //     type: "cubic-horizontal",
    //     color: "#A3B1BF",
    //     label: i,
    //   };
    // });

    graph.current.data(data);
    graph.current.render();
    graph.current.fitCenter();

    if (typeof window !== "undefined")
      window.onresize = () => {
        if (!graph || graph.current.get("destroyed")) return;
        if (!container || !container.scrollWidth || !container.scrollHeight)
          return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
  }, [data]);
  return (
    <div style={{ marginTop: "20px" }}>
      <button
        disabled={pageSize > 20}
        className="btn"
        onClick={() => {
          graph.current?.downloadFullImage(name, "image/png", {
            backgroundColor: "#ddd",
            padding: [30, 15, 15, 15],
          });
        }}
      >
        export png
      </button>
      <div ref={node}></div>;
    </div>
  );
}
