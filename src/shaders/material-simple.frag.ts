export default `

precision mediump float;

#define LIGHT_TYPE_NULL 1
#define LIGHT_TYPE_AMBIENT 2
#define LIGHT_TYPE_DIRECTIONAL 3
#define LIGHT_TYPE_POINT 4

uniform vec3 uDiffuseColor;

uniform vec3 uCameraPosition;
uniform int uLightType;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform vec3 uLightPosition;
uniform vec3 uColor;

varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    vec3 colorLighted = vec3(0.0);
    vec3 nNormal = normalize(vNormal);
    vec3 nViewDirection = normalize(uCameraPosition - vPosition);

    if(uLightType == LIGHT_TYPE_DIRECTIONAL){

        vec3 nLightDir = normalize(uLightPosition);

        float factorLambert = max(dot(nNormal, nLightDir), 0.0);
        vec3 diffuseIncrement = factorLambert * uLightColor * uLightIntensity * uDiffuseColor;
        colorLighted += diffuseIncrement;

    }

    gl_FragColor = vec4(colorLighted, 1.0);
}

`;