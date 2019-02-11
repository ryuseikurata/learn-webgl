import { IPosition, IDirection } from '../types/raw';
import Matrix4, { IMatrix4 } from '../math/matrix4';
import { deg2rad } from '../math/utils';
import { v4 } from 'uuid';

export interface INode {
  id: string;
  position: IPosition;
  rotation: IDirection;
  scale: IDirection;

  parent?: INode;

  getMatrix(): IMatrix4;
  getWorldMatrix(): IMatrix4;
}

class Node implements INode {
  public id = v4();
  public position = { x: 0, y: 0, z: 0 };
  public rotation = { x: 0, y: 0, z: 0 };
  public scale = { x: 1, y: 1, z: 1 };
  public parent?: INode;

  public getMatrix(): IMatrix4 {
    return [
      Matrix4.translation(new Float32Array([this.position.x, this.position.y, this.position.z])),
      Matrix4.xRotation(deg2rad(this.rotation.x)),
      Matrix4.yRotation(deg2rad(this.rotation.y)),
      Matrix4.zRotation(deg2rad(this.rotation.z)),
      Matrix4.scale(new Float32Array([this.scale.x, this.scale.y, this.scale.z])),
    ].reduce((sum: IMatrix4, matrix: IMatrix4) => {
      return Matrix4.multiply(sum, matrix);
    }, Matrix4.identity());
  }

  public getWorldMatrix(): IMatrix4 {
    const localMatrix = this.getMatrix();
    if (this.parent) {
      return Matrix4.multiply(this.parent.getMatrix(), localMatrix);
    }

    return localMatrix;
  }
}

export default Node;
