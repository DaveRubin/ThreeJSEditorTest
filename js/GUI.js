function GUI() {

    var self = this;
    this.meshes = [];
    this.guiCallbacks = [];
    var buttonSize = 0.2;
    var top = 0.7;
    var bottom = -1;
    var spacing = 0.05;
    var left = -1.5;
    var right = 1.5;

    var meshMap = {};

    function createButton(buttonName, textureName, buttonPosition) {
        var geometry = new THREE.PlaneGeometry(buttonSize, buttonSize, buttonSize);
        var texture = texMap[textureName];
        var material = new THREE.MeshLambertMaterial({color: 0xffffff, map: texture});
        var plane = new THREE.Mesh(geometry, material);

        plane.position.set(buttonPosition.x, buttonPosition.y, buttonPosition.z);
        plane.buttonName = buttonName;
        plane.isButton = true;
        plane.onPressed = function () {
            //console.log("onPressed : " + plane.buttonName);
            for (var i = 0; i < self.guiCallbacks.length; i++) {
                self.guiCallbacks[i](plane.buttonName);
            }
        };

        self.group.add(plane);
        self.meshes.push(plane);
        meshMap[buttonName] = plane;
    }

    function createButtons() {
        createButton("position", "move.png", new THREE.Vector3(left, top, 0));
        createButton("scale", "scale.png", new THREE.Vector3(left + buttonSize + spacing, top, 0));
        createButton("rotation", "rotation.png", new THREE.Vector3(left + buttonSize * 2 + spacing * 2, top, 0));

        createButton("save", "save.png", new THREE.Vector3(right - buttonSize, top, 0));
        createButton("load", "load.png", new THREE.Vector3(right - buttonSize, top - buttonSize - spacing, 0));
        createButton("export", "export.png", new THREE.Vector3(right - buttonSize, top - (buttonSize + spacing)*2, 0));
        createButton("import", "import.png", new THREE.Vector3(right - buttonSize, top - (buttonSize + spacing)*3, 0));

        createButton("create-box", "cube.png", new THREE.Vector3(left, bottom + buttonSize, 0));
        createButton("create-plane", "plane.png", new THREE.Vector3(left + (buttonSize + spacing), bottom + buttonSize, 0));
        createButton("create-cylinder", "cylinder.png", new THREE.Vector3(left + 2 * (buttonSize + spacing), bottom + buttonSize, 0));
        createButton("create-sphere", "sphere.png", new THREE.Vector3(left + 3 * (buttonSize + spacing), bottom + buttonSize, 0));
    }

    /**
     * Create base object to contain all button planes
     */
    this.initialize = function () {
        self.group = new THREE.Group();
        self.group.position.z = -1.2;
        createButtons();
    };

    /**
     * When button gets selected, deselect all but him
     * @param buttonName
     */
    this.setSelected = function(buttonName) {
        for (var i = 0; i < self.meshes.length; i++) {
            var obj = self.meshes[i];
            var selected = obj.buttonName == buttonName;
            obj.material.color.setHex(selected? 0xaa2277 : 0xffffff);
        };
    }

}