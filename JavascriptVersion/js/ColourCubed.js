//Built using 3js : https://threejs.org

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);
document.getElementsByTagName("cube")[0].appendChild(renderer.domElement);

var scene = new THREE.Scene();
//cubeLineNum^3 = total number of cubes
var cubeLineNum = 32;
var cubeSize = 1;
var cubeScale = .2;

//(Fov, AspectRatio, FrustumNearPlane, FrustumFarPlane)
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .01, 1000);
camera.position.z = cubeLineNum * 2;

var controls = new THREE.OrbitControls(camera);
controls.autoRotate = true;
controls.enableKeys = true;
controls.enablePan = false;

//Update things if user decides to change window size
window.onresize = function(){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.update();
};


function updateCubeNum(newCubeLineNum) {
    cubeLineNum = newCubeLineNum;
    if(cubeLineNum < 1)
        cubeLineNum = 1;
    settingsUpdated();
}

//TODO: This is broke AF yo..
function updateCubeScale(newCubeScale) {
    //Need to wipe the insignificant lower bound out
    newCubeScale = Math.floor(newCubeScale*100);
    newCubeScale -= newCubeScale%10;
    newCubeScale = newCubeScale/100;
    if(newCubeScale < .01)
        newCubeScale = .01
    if(newCubeScale > 1)
        newCubeScale = 1;
    console.log(cubeScale + " -> " + newCubeScale);
    if(newCubeScale != cubeScale)
        for(i=0; i < scene.children.length; i++) {
            scene.children[i].scale.set(cubeScale, cubeScale, cubeScale);
            scene.children[i].updateMatrix();
        }
    cubeScale = newCubeScale;
    document.getElementById("cubeSize").innerHTML = cubeScale;
}

/**
 * Function is called when user updates on page settings
 *  -Number of cubes
 *  -Slice height
 *  -Auto rotate
 */

function settingsUpdated() {
    scene = new THREE.Scene();
    makeBufferedCubes();
    document.getElementById("cubeCount").innerHTML = Math.pow(cubeLineNum,3);
    document.getElementById("cubeSize").innerHTML = cubeScale;
}

function makeBufferedCubes() {
    var bufferGeometry = new THREE.BufferGeometry();
    var totalCubes = Math.pow(cubeLineNum, 3);

    var positions = [];
    var colors = [];

    var color = new THREE.Color( 0xffffff );
    var cubeGeo = new THREE.CubeGeometry(cubeScale, cubeScale, cubeScale);
    var geometry = new THREE.Geometry();
    var x = 0;
    var y = 0;
    var z = 0;
    //Find the bottom corner of the box that we want to draw in all dimensions.
    //(Makes them sit around the origin more centered like)
    var cubeLinePos = cubeLineNum/(-2);

    for ( var i = 1; i <= totalCubes; i ++ ) {

        geometry.copy( cubeGeo );
        //geometry.scale(cubeScale, cubeScale, cubeScale);
        geometry.translate( cubeLinePos + x, cubeLinePos + y, cubeLinePos + z );

        color.setRGB( x/cubeLineNum, y/cubeLineNum, z/cubeLineNum );
        
        geometry.faces.forEach( function ( face ) {

            positions.push( geometry.vertices[ face.a ].x,
                            geometry.vertices[ face.a ].y,
                            geometry.vertices[ face.a ].z,
                            geometry.vertices[ face.b ].x,
                            geometry.vertices[ face.b ].y,
                            geometry.vertices[ face.b ].z,
                            geometry.vertices[ face.c ].x,
                            geometry.vertices[ face.c ].y,
                            geometry.vertices[ face.c ].z );

            colors.push( color.r,
                         color.g,
                         color.b,
                         color.r,
                         color.g,
                         color.b,
                         color.r,
                         color.g,
                         color.b );

        } );
        x++;
        if(x == cubeLineNum) {
            x = 0;
            y++;
            if(y == cubeLineNum) {
                y=0;
                z++;
                if(z == cubeLineNum) {
                    z = 0
                }
            }
        }

    }
    bufferGeometry.computeBoundingBox();
    bufferGeometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    bufferGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    var material = new THREE.PointsMaterial( { vertexColors: THREE.VertexColors } );
    scene.add( new THREE.Mesh( bufferGeometry, material ) );

}


var render = function () {
    requestAnimationFrame(render);
    //Need this to be updated every fram to rotate the camera.
    controls.update();

    renderer.render(scene, camera);
};
