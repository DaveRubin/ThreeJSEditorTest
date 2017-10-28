function TexturesManager() {
    var self = this;
    var textures = [
        "cube.png",
        "cylinder.png",
        "export.png",
        "import.png",
        "load.png",
        "move.png",
        "plane.png",
        "rotation.png",
        "save.png",
        "scale.png",
        "sphere.png"
    ];

    this.load = function () {
        for (var i = 0; i < textures.length; i++) {
            var textureName = textures[i];
            var txtr = new THREE.TextureLoader().load("textures/" + textureName);
            txtr.wrapS = THREE.RepeatWrapping;
            txtr.wrapT = THREE.RepeatWrapping;
            txtr.repeat.set(1, 1);
            texMap[textureName] = txtr;
        }
        console.log("Loaded all textures")
    }
}

var texMap = {};