//Built using 3js : https://threejs.org

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);
document.getElementsByTagName("cube")[0].appendChild(renderer.domElement);

var scene = new THREE.Scene();
//cubeLineNum^3 = total number of cubes
var cubeLineNum = 8;
var cubeSize = .75;

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

function updateCubeSize(newCubeSize) {
    if(newCubeSize < .01)
        newCubeSize = .01
    if(newCubeSize > 1)
        newCubeSize = 1;
    

    if(newCubeSize != cubeSize) {
        cubeSize = newCubeSize;
        settingsUpdated();
    }
}

/**
 * Function is called when user updates on page settings
 *  -Number of cubes
 *  -Slice height
 *  -Auto rotate
 */

function settingsUpdated() {
    scene = new THREE.Scene();
    makeCubes();
}

function makeCubes() {
    for(x = 0; x <= cubeLineNum; x++)
        for(y = 0; y <= cubeLineNum; y++)
            for(z = 0; z <= cubeLineNum; z++) {
                //TODO: Update the cubeGeometry to a bufferGeometry for better frames: https://threejs.org/docs/#api/en/core/BufferGeometry
                var cube = new THREE.Mesh(
                    new THREE.CubeGeometry(cubeSize,cubeSize,cubeSize),
                    new THREE.MeshBasicMaterial({color: 0xfff}));
                cube.material.color = new THREE.Color("rgb(" + Math.floor(x/cubeLineNum*255) + ", " + Math.floor(y/cubeLineNum*255) + ", " + Math.floor(z/cubeLineNum*255) + ")");;
                cube.position.set(cubeLineNum/(-2)+x,
                                  cubeLineNum/(-2)+y,
                                  cubeLineNum/(-2)+z);
                scene.add(cube);
            }
}

var render = function () {
    requestAnimationFrame(render);
    //Need this to be updated every fram to rotate the camera.
    controls.update();

    renderer.render(scene, camera);
};