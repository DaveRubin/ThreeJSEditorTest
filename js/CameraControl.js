function CameraControl(camera) {
    this.camera = camera;
    var self = this;

    function moveCamera(x, y, z) {
        self.camera.position.add(new THREE.Vector3(x, y, z));
    }

    document.addEventListener('keypress', function (event) {
        var keyName = event.key;
        switch (keyName) {
            case 'a' :
                moveCamera(-1, 0, 0);
                break;
            case 'd' :
                moveCamera(1, 0, 0);
                break;
            case 'w' :
                moveCamera(0, 0, -1);
                break;
            case 's' :
                moveCamera(0, 0, 1);
                break;
            case 'e' :
                moveCamera(0, 1, 0);
                break;
            case 'c' :
                moveCamera(0, -1, 0);
                break;
        }
    });
}