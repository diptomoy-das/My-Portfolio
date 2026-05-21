import * as THREE from "three";

export function createSpectacles(): THREE.Group {
  const group = new THREE.Group();
  group.name = "spectacles";

  // Premium matte black acetate material for the frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x181818,
    roughness: 0.4,
    metalness: 0.1,
  });

  // Premium glassmorphic physical material for the lenses
  const lensMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    roughness: 0.1,
    transmission: 0.95,
    thickness: 0.05,
    ior: 1.5,
  });

  // Premium silver material for accent pins
  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xe5e5e5,
    roughness: 0.15,
    metalness: 0.95,
  });

  // Frame shape (rounded square)
  const frameShape = new THREE.Shape();
  const w = 0.30;
  const h = 0.25;
  const r = 0.06;
  const border = 0.04;

  const ow = w + border;
  const oh = h + border;
  const or = r + border;

  // Outer frame loop
  frameShape.absarc(-ow + or, -oh + or, or, Math.PI, Math.PI * 1.5);
  frameShape.absarc(ow - or, -oh + or, or, Math.PI * 1.5, 0);
  frameShape.absarc(ow - or, oh - or, or, 0, Math.PI * 0.5);
  frameShape.absarc(-ow + or, oh - or, or, Math.PI * 0.5, Math.PI);

  // Inner hole loop (subtracted path)
  const hole = new THREE.Path();
  hole.absarc(-w + r, h - r, r, Math.PI * 0.5, 0, true);
  hole.absarc(w - r, h - r, r, 0, Math.PI * 1.5, true);
  hole.absarc(w - r, -h + r, r, Math.PI * 1.5, Math.PI, true);
  hole.absarc(-w + r, -h + r, r, Math.PI, Math.PI * 0.5, true);
  frameShape.holes.push(hole);

  const extrudeSettings = {
    depth: 0.04,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.005,
    bevelThickness: 0.005,
  };

  const frameGeom = new THREE.ExtrudeGeometry(frameShape, extrudeSettings);
  frameGeom.center();

  // Create Left & Right frames
  const leftFrame = new THREE.Mesh(frameGeom, frameMat);
  leftFrame.position.set(-0.42, 0, 0);
  leftFrame.castShadow = true;
  leftFrame.receiveShadow = true;
  group.add(leftFrame);

  const rightFrame = leftFrame.clone();
  rightFrame.position.set(0.42, 0, 0);
  group.add(rightFrame);

  // Create Left & Right lenses
  const lensGeom = new THREE.BoxGeometry(w * 2, h * 2, 0.01);
  const leftLens = new THREE.Mesh(lensGeom, lensMat);
  leftLens.position.set(-0.42, 0, 0.01);
  group.add(leftLens);

  const rightLens = leftLens.clone();
  rightLens.position.set(0.42, 0, 0.01);
  group.add(rightLens);

  // Bridge connecting the frames
  const bridgeGeom = new THREE.BoxGeometry(0.24, 0.04, 0.04);
  const bridge = new THREE.Mesh(bridgeGeom, frameMat);
  bridge.position.set(0, 0.05, 0.01);
  bridge.castShadow = true;
  bridge.receiveShadow = true;
  group.add(bridge);

  // Temple arms extending back to ears
  const templeLength = 1.25;
  const templeGeom = new THREE.BoxGeometry(0.02, 0.03, templeLength);

  const leftTemple = new THREE.Mesh(templeGeom, frameMat);
  leftTemple.position.set(-0.75, 0.05, -templeLength / 2 + 0.02);
  leftTemple.castShadow = true;
  leftTemple.receiveShadow = true;
  group.add(leftTemple);

  const rightTemple = leftTemple.clone();
  rightTemple.position.x = 0.75;
  group.add(rightTemple);

  // Silver accent pins on outer front corners for a premium feel
  const pinGeom = new THREE.BoxGeometry(0.04, 0.015, 0.005);
  const leftPin = new THREE.Mesh(pinGeom, pinMat);
  leftPin.position.set(-0.70, 0.18, 0.025);
  leftPin.castShadow = true;
  group.add(leftPin);

  const rightPin = leftPin.clone();
  rightPin.position.x = 0.70;
  group.add(rightPin);

  return group;
}
