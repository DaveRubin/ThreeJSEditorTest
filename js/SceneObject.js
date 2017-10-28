var objectID = 0; //running id for objects

function getSceneObjectID() {
    objectID++;
    return objectID;
}

/**
 *
 * @param objectType - 'box' / 'cylinder' / 'plane' / 'sphere'
 * @constructor
 */
function SceneObject(objectType) {

    this.id = getSceneObjectID();
    var type = objectType;
    var mesh = new THREE.Mesh(getGeometry(type), SceneObject.prototype.defaultMat);
    var selected = false;
    var originalMat = mesh.material;

    this.getMesh = function () {
        return mesh;
    };

    this.rotation = function (x, y, z) {
        mesh.rotation.set(x, y, z);
    };

    this.scale = function (x, y, z) {
        mesh.scale.set(x, y, z);
    };

    this.position = function (x, y, z) {
        mesh.position.set(x, y, z);
    };

    this.setSelected = function (isSelected) {
        if (isSelected !== selected) {
            selected = isSelected;
            if (selected) mesh.material = SceneObject.prototype.selectedMat;
            else mesh.material = originalMat;
        }
    };

    this.ToSaveObject = function () {
        return {
            type: type,
            position: {x: mesh.position.x, y: mesh.position.y, z: mesh.position.z},
            scale: {x: mesh.scale.x, y: mesh.scale.y, z: mesh.scale.z},
            rotation: {x: mesh.rotation.x, y: mesh.rotation.y, z: mesh.rotation.z}
        }
    };

    function getGeometry(geomType) {
        switch (geomType) {
            case 'box' :
                return new THREE.BoxGeometry(1, 1, 1);
            case 'cylinder':
                return new THREE.CylinderGeometry(0.5, 0.5, 1);
            case 'plane':
                return new THREE.PlaneGeometry(1, 1, 1);
            case 'sphere':
                return new THREE.SphereGeometry(0.5, 20, 20);
        }

    }
}

SceneObject.prototype.selectedColor = 0xff0000;
SceneObject.prototype.defaultColor = 0xaa2222;
SceneObject.prototype.selectedMat = new THREE.MeshPhongMaterial({color: 0xff22aa});
SceneObject.prototype.defaultMat = new THREE.MeshPhongMaterial({color: 0xaa2277});