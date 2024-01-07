uniform float time;
uniform vec2 limits;
uniform float speed;

attribute float moveable;

varying vec3 vColor;

void main(){
    vColor=color;
    float limLen=limits.y-limits.x;
    vec3 pos=position;
    if(floor(moveable+.5)>.5){
        float dist=speed*time;
        float currPos=mod((pos.z+dist)-limits.x,limLen)+limits.x;
        pos.z=currPos;
    }
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos,1.);
}