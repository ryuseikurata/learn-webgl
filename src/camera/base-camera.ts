import Node, { INode } from '../core/node';
import { IPosition, IDirection } from '../types/raw';
import Matrix4, { IMatrix4 } from '../math/matrix4';
import { IVector3 } from '../math/vector3';
 
export interface IBaseCamera extends INode {
  center: IPosition;
  up: IDirection;
  getPMatrix(): IMatrix4;
  getVMatrix(): IMatrix4;
  getPosition(): IVector3;
}

class BaseCamera extends Node implements IBaseCamera {
  public center: IPosition = { x: 0, y: 0, z: 0 };
  public up: IDirection = { x: 0, y: 1, z: 0 };

  public getPMatrix(): IMatrix4 {
    return Matrix4.identity();
  }

  public getVMatrix(): IMatrix4 {
    return Matrix4.lookAt(
      new Float32Array([this.position.x, this.position.y, this.position.z]),
      new Float32Array([this.center.x, this.center.y, this.center.z]),
      new Float32Array([this.up.x, this.up.y, this.up.z]),
    );
  }

  public getPosition(): IVector3 {
    return new Float32Array([this.position.x, this.position.y, this.position.z]);
  }
}
export default BaseCamera;
