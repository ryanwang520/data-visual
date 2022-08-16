import { NodeConfig } from "@antv/g6";

export type Child = {};
export type Data = {
  isRoot: boolean;
  id: string;
  name: string;
  children: TreeNode[];
};

export interface TreeNode extends NodeConfig {
  node_type: "product" | "option_set" | "bundle";
}
