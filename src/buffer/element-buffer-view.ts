import ElementBuffer from "./element-buffer";
import GL from "../core/gl";

interface IElementBufferViewConfig {
    buffer: ElementBuffer;
    mode?: GLenum;
    count?: number;
    type?: GLenum;
    byteOffset?: number;
}

class ElementBufferView {

    public readonly buffer: ElementBuffer;
    public readonly mode: GLenum;
    public readonly count: number;
    public readonly type: GLenum;
    public readonly byteOffset: number;

    constructor({
        buffer,
        mode = WebGLRenderingContext.TRIANGLES,
        count = 0,
        type =  WebGLRenderingContext.UNSIGNED_SHORT,
        byteOffset = 0,
    }: IElementBufferViewConfig) {

        const { gl } = GL;

        if (!gl) {
          throw new Error("undefine gl")
        }

        this.buffer = buffer;
        this.mode = mode;
        this.type = type;
        this.count = count;
        this.byteOffset = byteOffset;
    }
}

export default ElementBufferView;
