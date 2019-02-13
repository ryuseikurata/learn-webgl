import ShaderMaterial from "./shader-material";

import Vector3, { IVector3 } from "../math/vector3";
import { IColorRGB } from "../types/raw";

import fShaderSource from "../shaders/material-simple.frag";
import vShaderSource from "../shaders/material-simple.vert";

class SimpleMaterial extends ShaderMaterial {
  public color: IColorRGB = { r: 91, g: 162, b: 150 };

  public diffuseColor: IColorRGB = { r: 255, g: 255, b: 255 };

  constructor() {
    super({
      name: "SIMPLE",
      vertexShaderSource: vShaderSource,
      fragmentShaderSource: fShaderSource,
      macros: [],
      uniforms: ["uDiffuseColor"],
      lighting: false,
      shadow: false
    });
  }

  public condition(macro: string): boolean {
    return false;
  }

  public uniform(name: string): Float32Array | WebGLTexture {
    switch (name) {
      case "uDiffuseColor":
        return this.getDiffuseColor();
      default:
        throw new Error("undefined uniform name");
    }
  }

  private getDiffuseColor(): IVector3 {
    return new Float32Array([
      this.diffuseColor.r / 255,
      this.diffuseColor.g / 255,
      this.diffuseColor.b / 255
    ]);
  }
}

export default SimpleMaterial;
