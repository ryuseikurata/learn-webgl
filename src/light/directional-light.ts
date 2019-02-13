import BaseLight, { ILight } from "./base-light";

import { IScene } from "../core/scene";
import { IDirection } from "../types/raw";

export interface IDirectionalLight extends ILight {}

class DirectionalLight extends BaseLight implements IDirectionalLight {
  public direction: IDirection = { x: 0, y: 0, z: -1 };
  public castShadow: boolean = false;

  private directionValues: number[] = [0, 0, -1];

  constructor(scene: IScene) {
    super(scene);
  }

  public getDirection(): number[] {
    this.directionValues[0] = this.direction.x;
    this.directionValues[1] = this.direction.y;
    this.directionValues[2] = this.direction.z;
    return this.directionValues;
  }
}

export default DirectionalLight;
