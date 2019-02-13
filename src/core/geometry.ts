import Buffer from "../buffer/buffer";
import BufferView from "../buffer/buffer-view";
import ElementBufferView from "../buffer/element-buffer-view";
import ElementBuffer from "../buffer/element-buffer";

export interface IGeometry {
  bufferViews: IGeometryBufferViews;
}

interface IGeometryBufferViews {
  vertices?: BufferView;
  normals?: BufferView;
  indices?: {
    [propName: string]: ElementBufferView;
  };
}

interface IGeometryConfig {
  vertices?: BufferView | number[];
  normals?: BufferView | number[];
  indices?: {
    [propName: string]: ElementBufferView | number[];
  };
}

class Geometry implements IGeometry {
  public bufferViews: IGeometryBufferViews = {};

  constructor({ vertices, indices, normals }: IGeometryConfig = {}) {
    if (vertices && indices) {
      this.bufferViews = {
        vertices: this.createBufferView(vertices) as BufferView,
        normals: this.createBufferView(normals) as BufferView,
        indices: this.createElementBufferView(indices)
      };
    }
  }

  protected createBufferView(
    data: number[] | BufferView = []
  ): BufferView | { [propName: string]: BufferView } {
    if (Array.isArray(data)) {
      return new BufferView({
        buffer: new Buffer({
          data: new Float32Array(data)
        })
      });
    }

    return data;
  }

  protected createElementBufferView(
    data: { [propName: string]: number[] | ElementBufferView },
  ): { [propName: string]: ElementBufferView } {
    const elementBufferViews: { [propName: string]: ElementBufferView } = {};

    for (const key in data) {
      elementBufferViews[key] = new ElementBufferView({
        buffer: new ElementBuffer({
          data: new Uint16Array(data[key] as number[])
        }),
        mode: WebGLRenderingContext.TRIANGLES,
        count: (data[key] as number[]).length,
        type: WebGLRenderingContext.UNSIGNED_SHORT,
        byteOffset: 0
      });
    }

    return elementBufferViews;
  }
}

export default Geometry;
