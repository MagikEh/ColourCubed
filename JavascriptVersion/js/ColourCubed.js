//Built using 3js : https://threejs.org

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var sceneContainer = document.getElementById('cube');
sceneContainer.appendChild(renderer.domElement);

var scene = new THREE.Scene();
//cubeLineNum^3 = total number of cubes
var cubeLineNum = document.getElementById('cubeCount').value;
var cubeSize = document.getElementById('cubeSizeSlider').value/100;
var rockyThreshold = document.getElementById('rockyThresholdSlider').value/100;
var colorModel = 0;

//(Fov, AspectRatio, FrustumNearPlane, FrustumFarPlane)
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, .01, 1000);
camera.position.z = cubeLineNum * 2;

var controls = new THREE.OrbitControls(camera, sceneContainer);
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

/**
 * Function is called when user updates on page settings
 *  -Number of cubes
 *  -Slice height
 *  -Auto rotate
 *  -Rocky Scale
 */
function settingsUpdated() {
    cubeSize = document.getElementById('cubeSizeSlider').value/100;
    rockyThreshold = document.getElementById('rockyThresholdSlider').value/100;
    cubeLineNum = document.getElementById('cubeCount').value;
    if(cubeLineNum < 1) {
        cubeLineNum = 1;
        document.getElementById('cubeCount').value = 1;
    }
    scene = new THREE.Scene();
    makeBufferedCubes();
    document.getElementById("cubeCount").innerHTML = Math.pow(cubeLineNum,3);
}

function makeBufferedCubes() {
    var bufferGeometry = new THREE.BufferGeometry();
    var totalCubes = Math.pow(cubeLineNum, 3);

    var positions = [];
    var colors = [];

    var color = new THREE.Color( 0xffffff );
    var cubeGeo = new THREE.CubeGeometry(cubeSize, cubeSize, cubeSize);
    var geometry = new THREE.Geometry();

    var x = 0;
    var y = 0;
    var z = 0;
    //Find the bottom corner of the box that we want to draw in all dimensions.
    //(Makes them sit around the origin more centered like)
    var cubeLinePos = cubeLineNum/(-2);

    var d0;
    var d1;
    var d2;

    var isRGB = document.getElementById('colorModeRGB').checked;
    var isHSL = document.getElementById('colorModeHSL').checked;
    
    for ( var i = 1; i <= totalCubes; i ++ ) {
        if(isRGB)
            color.setRGB( x/cubeLineNum, y/cubeLineNum, z/cubeLineNum );
        if(isHSL)
            color.setHSL( x/cubeLineNum, y/cubeLineNum, z/cubeLineNum );
        d0 = Math.abs(color.r - color.g);
        d1 = Math.abs(color.r - color.b);
        d2 = Math.abs(color.g - color.b);

        if(d0 >= rockyThreshold && d1 >= rockyThreshold && d2 >= rockyThreshold || rockyThreshold == 0.0) {
        
            geometry.copy( cubeGeo );
            geometry.translate( cubeLinePos + x, cubeLinePos + y, cubeLinePos + z );
            
            geometry.faces.forEach( function ( face ) {

                positions.push( geometry.vertices[face.a].x,
                                geometry.vertices[face.a].y,
                                geometry.vertices[face.a].z,
                                geometry.vertices[face.b].x,
                                geometry.vertices[face.b].y,
                                geometry.vertices[face.b].z,
                                geometry.vertices[face.c].x,
                                geometry.vertices[face.c].y,
                                geometry.vertices[face.c].z );

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
        }
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
    bufferGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3  ) );
    var material = new THREE.PointsMaterial( { vertexColors: THREE.VertexColors } );
    scene.add( new THREE.Mesh( bufferGeometry, material ) );
}

var render = function () {
    requestAnimationFrame(render);
    //Need this to be updated every fram to rotate the camera.
    controls.update();

    renderer.render(scene, camera);
};
