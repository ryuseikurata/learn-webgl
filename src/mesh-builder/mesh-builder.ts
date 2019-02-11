import { IScene } from "../core/scene";
import createPlane from "./primitives/plane";
import createBox from "./primitives/box";

export default {
  createPlane,
  createCube: (scene: IScene, width: number, height = width, depth = width) => {
    const w = width / 2;
    const h = height / 2;
    const d = depth / 2;
    return createBox(scene, -w, w, h, -h, d, -d);
  }
};
