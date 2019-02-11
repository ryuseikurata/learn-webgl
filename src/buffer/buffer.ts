import GL from "../core/gl";

interface IBufferConfig {
    data: Float32Array | ArrayBuffer;
}

class Buffer {

    public readonly arrayBuffer?: ArrayBuffer;
    public readonly glBuffer: WebGLBuffer;

    constructor({ data }: IBufferConfig) {        
        const { gl, buffers } = GL;

        if (!gl) {
          throw new Error("undefine gl")
        }

        this.glBuffer = gl.createBuffer()!;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        if (data instanceof Float32Array) {
            this.arrayBuffer = data.buffer;
        } else if (data instanceof ArrayBuffer) {
            this.arrayBuffer = data;
        }

        buffers.add(this);
    }

    public destructor(): void {

        const { gl, buffers } = GL;

        buffers.delete(this);
        
        if (gl && this.glBuffer) {
          gl.deleteBuffer(this.glBuffer);
        }
    }
}

export default Buffer;
