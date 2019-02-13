import { IScene } from "./scene";
import Mesh, { IMesh } from "./mesh";
import BaseCamera, { IBaseCamera } from "../camera/base-camera";
import { IGeometry } from "./geometry";
import ShaderMaterial from "../material/shader-material";
import DirectionalLight from "../light/directional-light";

const LIGHT_TYPE_NULL = 1;
const LIGHT_TYPE_AMBIENT = 2;
const LIGHT_TYPE_DIRECTIONAL = 3;
const LIGHT_TYPE_POINT = 4;

export interface IRenderManager {
  scene: IScene;

  render(): void;
}

class RenderManager implements IRenderManager {
  public scene: IScene;

  private groups: IMesh[][] = [];

  constructor(scene: IScene) {
    this.scene = scene;
  }

  public render(): void {
    const { scene } = this;

    if (scene.activeCamera) {
      this.groupMeshLayers();
      this.renderToScreen();
    }
  }

  private groupMeshLayers(): void {
    const { scene } = this;
    const { meshes } = scene;

    this.groups = [];

    for (const mesh of meshes) {
      const i = mesh.getRenderLayerIndex();

      if (!this.groups[i]) {
        this.groups[i] = [];
      }

      this.groups[i].push(mesh);
    }
  }

  private renderToScreen(): void {
    const { engine } = this.scene;

    engine.clearColorBuffer(this.scene.clearColor);

    this.groups.forEach(meshes => {
      engine.clearDepthBuffer();

      meshes.forEach(mesh => {
        if (mesh.geometry.bufferViews.indices) {
          Object.keys(mesh.geometry.bufferViews.indices).forEach(key => {
            const material = mesh.materials[key];

            engine.useProgram(material.getProgram([]));

            this.prepareMVPMatrix(mesh);
            this.prepareGeometry(mesh.geometry);
            this.prepareMaterial(material);
            this.prepareLights();
            this.prepareCameraPosition();

            this.drawMesh(mesh, key);
          });
        }
      });
    });
  }

  private prepareMVPMatrix(mesh: IMesh): void {
    const { engine, activeCamera } = this.scene;
    const camera = activeCamera ? activeCamera : new BaseCamera();

    engine.uniform("uVMatrix", camera.getVMatrix());
    engine.uniform("uPMatrix", camera.getPMatrix());
    engine.uniform("uMMatrix", mesh.getWorldMatrix());
  }

  private prepareGeometry(geometry: IGeometry): void {
    const { engine } = this.scene;

    const { vertices, normals } = geometry.bufferViews;

    if (!vertices) {
      return;
    }

    engine.attribute(
      "aPosition",
      vertices.buffer.glBuffer,
      vertices.byteStride,
      vertices.byteOffset
    );
    
    if (normals) {
      engine.attribute(
        "aNormal",
        normals.buffer.glBuffer,
        normals.byteStride,
        normals.byteOffset
      );
    }
  }

  private prepareMaterial(material: ShaderMaterial): void {
    const { engine } = this.scene;

    const { uniforms } = material;

    for (const name of uniforms) {
      const value = material.uniform(name);
      if (value !== null) {
        engine.uniform(name, value);
      }
    }
  }

  private prepareLights(): void {
    const { scene } = this;
    const { engine } = this.scene;
    const { lights } = scene;

    // TODO: 登録した光源全てを使うようにする
    const light = lights.shift();
    if (!light) {
      return;
    }

    const lColor = light ? light.getColor().map(c => c / 255) : [0, 0, 0];
    const lIntensity = light ? light.getIntensity() : 0;
    let lPosition;
    let lType;

    if (light instanceof DirectionalLight) {
      lType = LIGHT_TYPE_DIRECTIONAL;
      lPosition = light.getDirection();
    } else {
      lType = LIGHT_TYPE_NULL;
      lPosition = [0, 0, 0];
    }

    engine.uniform("uLightType", lType);
    engine.uniform("uLightColor", lColor);
    engine.uniform("uLightIntensity", lIntensity);
    engine.uniform("uLightPosition", lPosition);
  }

  private prepareCameraPosition(): void {
    const { engine } = this.scene;
    const { activeCamera } = this.scene;

    if (activeCamera) {
      engine.uniform("uCameraPosition", activeCamera.getPosition());
    }
}

  private drawMesh(mesh: IMesh, key: string): void {
    const { engine } = this.scene;

    const { indices } = mesh.geometry.bufferViews;

    if (indices && indices[key]) {
      engine.elements(indices[key].buffer.glBuffer);
      engine.draw(
        indices[key].mode,
        indices[key].count,
        indices[key].type,
        indices[key].byteOffset
      );
    }
  }
}

export default RenderManager;
