//Built using 3js : https://threejs.org

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild(renderer.domElement);
document.getElementsByTagName("cube")[0].appendChild(renderer.domElement);

var scene = new THREE.Scene();
//cubeLineNum^3 = total number of cubes
var cubeLineNum = 8;
var cubesPool = [];
var cubeSize = 1;
var cubeScale = 1;

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
    makeCubes();
}

function makeCubes() {
    var requiredCubes = cubesPool.length - Math.pow(cubeLineNum,3);
    if(requiredCubes < 0) {
        for(i=requiredCubes; i<1; i++)
        cubesPool.push(new THREE.Mesh(
            new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize),
            new THREE.MeshBasicMaterial({color: 0xfff})));
    }
    var i = 0;
    var cube;
    for(x = 0; x < cubeLineNum; x++)
        for(y = 0; y < cubeLineNum; y++)
            for(z = 0; z < cubeLineNum; z++) {
                //TODO: Update the cubeGeometry to a bufferGeometry for better frames: https://threejs.org/docs/#api/en/core/BufferGeometry
                //TODO HERE WE PULL CUBES FROM THE POOL AND UPDATE THE COLOUR AND POSITIONING OF EACH. THAT'S ALL, ASSUME SIZE IS SET.
                cube = cubesPool[i++];
                cube.scale.set(cubeScale, cubeScale, cubeScale);
                cube.position.set(cubeLineNum/(-2)+x,
                                  cubeLineNum/(-2)+y,
                                  cubeLineNum/(-2)+z);
                cube.material.color = new THREE.Color("rgb(" + Math.floor(x/cubeLineNum*255) + ", " + Math.floor(y/cubeLineNum*255) + ", " + Math.floor(z/cubeLineNum*255) + ")");;
                scene.add(cube);
            }
    document.getElementById("cubeCount").innerHTML = Math.pow(cubeLineNum,3);
    document.getElementById("cubeSize").innerHTML = cubeScale;
    
}

var render = function () {
    requestAnimationFrame(render);
    //Need this to be updated every fram to rotate the camera.
    controls.update();

    renderer.render(scene, camera);
};