function AxisControl(mainCamera, mainRenderer) {

    var self = this;
    this.group = new THREE.Group();
    this.meshes = [];
    this.effectTypes = "position/scale/rotation";

    var camera = mainCamera;
    var renderer = mainRenderer;
    var raycaster = new THREE.Raycaster();
    var size = 2;
    var pressed = false;
    var mouseStartPos = new THREE.Vector2(0, 0);
    var mousePoVector = new THREE.Vector2(0, 0);
    var attachedElement = null;
    var attachedElementStartPos = null;
    var currentAxis = 'x';
    var factor = 0.01;
    var effect = "position"; //position/scale/rotation
    var dragDelta = null;

    /**
     * Create cylinder for axis element
     * @param coloHex
     */
    function createAxisElement(axis, coloHex) {
        var geometry = new THREE.CylinderGeometry(0.1, 0.1, size);
        var material = new THREE.MeshBasicMaterial({color: coloHex});
        var mesh = new THREE.Mesh(geometry, material);
        mesh.axis = axis;
        mesh.onPressed = function (e) {
            onAxisPressed(e, mesh);
        };
        self.group.add(mesh);
        self.meshes.push(mesh);
        return mesh;
    }

    var xElement = createAxisElement("z", 0xff0000);
    var yElement = createAxisElement("y", 0x00ff00);
    var zElement = createAxisElement("x", 0x0000ff);

    var pGeom = new THREE.PlaneGeometry(50, 50, 1);
    var pMat = new THREE.MeshLambertMaterial({opacity: 0, transparent: true, color: 0x888888, side: THREE.DoubleSide});
    var touchPlane = new THREE.Mesh(pGeom, pMat);
    self.group.add(touchPlane);
    touchPlane.visible = false;

    xElement.position.z += size / 2;
    yElement.position.y += size / 2;
    zElement.position.x += size / 2;

    xElement.rotation.x += Math.PI / 2;
    zElement.rotation.set(0, 0, Math.PI / 2);
    document.addEventListener('mousemove', onDocumentMousePressed, false);


    this.AttachToElement = function (element) {
        //set position
        attachedElement = element;
        self.group.visible = true;
        updatePosition();
    };

    this.Hide = function () {
        self.group.visible = false;
        touchPlane.visible = false;
    };

    this.setAxisEffect = function (selectedEffect) {
        effect = selectedEffect;
    };

    /**
     * Start axis drag
     * @param mouseEvent
     * @param axisMesh
     */
    function onAxisPressed(mouseEvent, axisMesh) {
        pressed = true;
        touchPlane.visible = true;
        mouseStartPos.x = mouseEvent.clientX;
        mouseStartPos.y = mouseEvent.clientY;
        currentAxis = axisMesh.axis;
        if (currentAxis == "x" || currentAxis == "y") {
            touchPlane.rotation.y = 0;
        }
        else {
            touchPlane.rotation.y = Math.PI / 2;
        }
        attachedElementStartPos = attachedElement.clone();
    }

    function updatePosition() {
        self.group.position.set(attachedElement.position.x, attachedElement.position.y, attachedElement.position.z);
    }

    function onDocumentMousePressed(event) {
        if (pressed) {
            // for rotation use delta drag and not actual space location
            if (effect == "rotation") {
                var currentPos = new THREE.Vector2(event.clientX, event.clientY);
                var magnitude = currentPos.sub(mouseStartPos).multiplyScalar(factor);
                switch (currentAxis) {
                    case 'x':
                        attachedElement[effect].x = attachedElementStartPos[effect].x + magnitude.x;
                        break;
                    case 'y':
                        attachedElement[effect].y = attachedElementStartPos[effect].y + magnitude.y;
                        break;
                    case 'z':
                        attachedElement[effect].z = attachedElementStartPos[effect].y + magnitude.y;
                        break;
                }
            }
            else {
                mousePoVector.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
                mousePoVector.y = -( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
                raycaster.setFromCamera(mousePoVector, camera);

                var intersects = raycaster.intersectObjects([touchPlane]);
                if (intersects.length > 0) {
                    if (dragDelta == null) dragDelta = intersects[0].point[currentAxis] - attachedElementStartPos[effect][currentAxis];
                    var startP = attachedElementStartPos[effect].x;
                    attachedElement[effect][currentAxis] = intersects[0].point[currentAxis] - dragDelta;
                    switch (currentAxis) {
                    case 'x':
                        // attachedElement[effect].x = attachedElementStartPos[effect].x + magnitude.x;
                        break;
                    case 'y':
                        // attachedElement[effect].y = attachedElementStartPos[effect].y + magnitude.y;
                        break;
                    case 'z':
                        // attachedElement[effect].z = attachedElementStartPos[effect].y + magnitude.y;
                        break;
                }
                }
            }

            updatePosition();
        }
    }

    document.addEventListener('mouseup', function (e) {
        pressed = false;
        touchPlane.visible = false;
        dragDelta = null
    }, false);

    self.Hide();
}