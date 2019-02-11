import Node, { INode } from "./node";
import { IScene } from "./scene";
import Geometry, { IGeometry } from "./geometry";
import ShaderMaterial from "../material/shader-material";
import SimpleMaterial from "../material/simple-material";

export interface IMesh extends INode {
  scene: IScene;
  geometry: IGeometry;
  materials: {
    [prop: string]: ShaderMaterial;
  };
  getRenderLayerIndex(): number;
}

class Mesh extends Node implements IMesh {
  public scene: IScene;
  public geometry: IGeometry = new Geometry();
  public materials: {
    [prop: string]: ShaderMaterial;
  } = {
    default: new SimpleMaterial()
  };

  constructor(scene: IScene) {
    super();

    scene.meshes.push(this);
    this.scene = scene;
  }

  public getRenderLayerIndex(): number {
    return 0;
  }
}

export default Mesh;
