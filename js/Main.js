var Main = new ThreeWrapper();

function createFloor() {
    var flootSize = 40;
    var geometry = new THREE.PlaneGeometry(flootSize, flootSize, flootSize, flootSize);
    var material = new THREE.MeshBasicMaterial({color: 0x888888, wireframe: true});
    var plane = new THREE.Mesh(geometry, material);
    plane.position.set(0, -0.5, 0);
    plane.rotation.set(Math.PI / 2, 0, 0);
    Main.addNonPressableObject(plane);
}

function createLights() {
    var light = new THREE.AmbientLight(0x404040);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    Main.addNonPressableObject(directionalLight);
    Main.addNonPressableObject(light);
}

function createScene() {
    //basic
    createLights();
    createFloor();

    //starting elements
    var obj1 = new SceneObject("box");
    var obj2 = new SceneObject("sphere");
    Main.addSceneObjectToScene(obj1);
    Main.addSceneObjectToScene(obj2);
    Main.setActive(true);
    obj1.position(1, 0, 0);
    obj2.position(-1, 0, 0);
    obj2.rotation(45, 0, 0);
}

//console.log("Scene init");
createScene();