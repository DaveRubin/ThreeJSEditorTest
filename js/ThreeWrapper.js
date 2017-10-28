function ThreeWrapper() {

    var self = this;
    var saveKey = "LOCAL_SAVE_KEY";
    var tmp;
    var scene = new THREE.Scene();
    var ratio = window.innerWidth / window.innerHeight;
    var camera = new THREE.PerspectiveCamera(75, ratio, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer();
    var active = false;
    var meshes = [];
    var objectsMap = {};
    var raycaster = new THREE.Raycaster();
    var selectedObj = null;
    var mousePoVector = new THREE.Vector2(0, 0);
    var mousStartPos = new THREE.Vector2(0, 0);
    var clicked = true;
    var gui = new GUI();
    var cc = new CameraControl(camera);
    var axisControl = new AxisControl(camera,renderer);
    var txManager = new TexturesManager();
    txManager.load();

    //Events
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
    gui.guiCallbacks.push(onGuiPressed);
    gui.initialize();
    gui.setSelected("position");

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.z = 5;
    camera.add(gui.group);
    scene.add(camera);
    scene.add(axisControl.group);
    initMeshes();
    onWindowResize(); //just to set camera ratio

    /**
     * Add ObjectToScene
     * @param sceneObject
     */
    this.addSceneObjectToScene = function (sceneObject) {
        var mesh = sceneObject.getMesh();
        scene.add(mesh);
        meshes.push(mesh);
        //console.log("Adding "+ mesh.id);
        objectsMap[mesh.uuid] = sceneObject;
    };

    this.addNonPressableObject = function (mesh) {
        scene.add(mesh);
    };

    /**
     * Toggle scene
     * @param val
     */
    this.setActive = function (val) {
        if (val != active) {
            active = val;
            if (val) animate()
        }
    };

    //THREE JS LOOP
    function animate() {
        requestAnimationFrame(animate);
        if (active) renderer.render(scene, camera);
    }

    /**
     * Iterate all scene objects and create a json representing them
     * @returns {{camera: {}, objects: Array}}
     */
    function createSceneJson() {
        var result = {
            camera: {},
            objects: []
        };

        Object.keys(objectsMap).forEach(function (key, value, map) {
            result.objects.push(objectsMap[key].ToSaveObject());
        });

        return JSON.stringify(result);
    }

    /**
     * Save scene json to local storage
     * @constructor
     */
    function SaveScene() {
        localStorage.setItem(saveKey,createSceneJson() );
    }

    /**
     * Load scene json from local storage and rebuild scene
     * @constructor
     */
    function LoadScene() {
        var savedJSON = localStorage.getItem(saveKey);
        if (savedJSON != null) {
            var loadedObj = JSON.parse(savedJSON);
            //clear currentScene
            Object.keys(objectsMap).forEach(function (key, value, map) {
                var mesh = objectsMap[key].getMesh();
                meshes.splice(meshes.lastIndexOf(mesh), 1);
                scene.remove(mesh);
            });
            initMeshes();

            //create all saved objects
            for (var i = 0; i < loadedObj.objects.length; i++) {
                var obj = loadedObj.objects[i];
                var newObj = new SceneObject(obj.type);
                self.addSceneObjectToScene(newObj);
                newObj.position(obj.position.x, obj.position.y, obj.position.z);
                newObj.rotation(obj.rotation.x, obj.rotation.y, obj.rotation.z);
                newObj.scale(obj.scale.x, obj.scale.y, obj.scale.z);
            }

            axisControl.Hide();
        }

    }

    /**
     * Export scene json to file and download
     * @constructor
     */
    function ExportScene() {
        var uriContent = "data:application/octet-stream," + encodeURIComponent(createSceneJson());
        window.open(uriContent, 'neuesDokument');
    }

    /**
     * Get string from Prompt and start scene
     * @constructor
     */
    function ImportScene() {

    }

    /**
     * When gui button is pressed
     * @param buttonName
     */
    function onGuiPressed(buttonName) {

        if (axisControl.effectTypes.search(buttonName) > -1) {
            console.log("effect : " + buttonName);
            axisControl.setAxisEffect(buttonName);
            gui.setSelected(buttonName);
        }
        else {
            switch (buttonName.split("-")[0]) {
                case "save" :
                    SaveScene();
                    break;
                case "load" :
                    LoadScene();
                    break;
                case "export" :
                    ExportScene();
                    break;
                case "import" :
                    ImportScene();
                    break;
                case "create" :
                    var type = buttonName.split("-")[1];
                    console.log("Creating" + type);
                    self.addSceneObjectToScene(new SceneObject(type));
            }
        }
    }

    /**
     * When clicking, Select object
     * @param e
     */
    function onDocumentMouseDown(event) {
        event.preventDefault();
        clicked = true;
        mousStartPos.x = event.clientX;
        mousStartPos.y = event.clientY;
        mousePoVector.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mousePoVector.y = -( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera(mousePoVector, camera);

        var intersects = raycaster.intersectObjects(meshes);

        //find first intersection with raycast and select object
        if (intersects.length > 0) {
            tmp = intersects[0].object;
            if (tmp.isButton) {
                tmp.onPressed();
            }
            else if (tmp.axis) {
                tmp.onPressed(event);
            }
            else {
                if (selectedObj != null) selectedObj.setSelected(false);
                selectedObj = objectsMap[tmp.uuid];
                selectedObj.setSelected(true);
                axisControl.AttachToElement(tmp);
            }
        }
        else {
            //On any click , deselect objects
            if (selectedObj != null) selectedObj.setSelected(false);
            axisControl.Hide()
        }

    }


    /**
     * Keep camera in aspect ratio as the screen
     */
    function onWindowResize() {

        var windowRatio = window.innerWidth / window.innerHeight;
        var wantedRatio = 16 / 9;
        camera.aspect = wantedRatio;
        camera.updateProjectionMatrix();

        if (windowRatio > wantedRatio) {
            renderer.setSize(window.innerHeight * camera.aspect, window.innerHeight);
        }
        else {
            renderer.setSize(window.innerWidth, window.innerWidth / camera.aspect);
        }

    }

    function initMeshes() {
        objectsMap = {};
        meshes = [];
        meshes = meshes.concat(gui.meshes);
        meshes = meshes.concat(axisControl.meshes);
    }


}