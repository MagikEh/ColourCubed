//Built using 3js : https://threejs.org

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
var cube = new THREE.Mesh(geometry, material);


var scene = new THREE.Scene();
scene.add(cube);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 5;

var render = function () {
    requestAnimationFrame(render);
    
    cube.rotation.x += .01//window.event.clientX/1000;
    cube.rotation.y += .01//window.event.clientY/1000;

    renderer.render(scene, camera);
};