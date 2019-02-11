export default `

precision mediump float;

attribute vec3 aPosition;

uniform mat4 uPMatrix;
uniform mat4 uVMatrix;
uniform mat4 uMMatrix;

void main() {
  gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPosition, 1.0);
}

`;