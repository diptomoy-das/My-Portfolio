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

  // Frame shape (rounded square, larger and wider)
  const frameShape = new THREE.Shape();
  const w = 0.38;
  const h = 0.30;
  const r = 0.08;
  const border = 0.045;

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

  const eyeOffsetX = 0.48; // Spaced wider to fit the head and make side arms visible

  // Create Left & Right frames
  const leftFrame = new THREE.Mesh(frameGeom, frameMat);
  leftFrame.position.set(-eyeOffsetX, 0, 0);
  leftFrame.castShadow = true;
  leftFrame.receiveShadow = true;
  group.add(leftFrame);

  const rightFrame = leftFrame.clone();
  rightFrame.position.set(eyeOffsetX, 0, 0);
  group.add(rightFrame);

  // Create Left & Right lenses
  const lensGeom = new THREE.BoxGeometry(w * 2, h * 2, 0.01);
  const leftLens = new THREE.Mesh(lensGeom, lensMat);
  leftLens.position.set(-eyeOffsetX, 0, 0.01);
  group.add(leftLens);

  const rightLens = leftLens.clone();
  rightLens.position.set(eyeOffsetX, 0, 0.01);
  group.add(rightLens);

  // Bridge connecting the frames
  const bridgeGeom = new THREE.BoxGeometry(0.20, 0.04, 0.04);
  const bridge = new THREE.Mesh(bridgeGeom, frameMat);
  bridge.position.set(0, 0.08, 0.01);
  bridge.castShadow = true;
  bridge.receiveShadow = true;
  group.add(bridge);

  // Temple arms (handles/sidebars) extending back to ears
  const templeLength = 1.20;
  const templeGeom = new THREE.BoxGeometry(0.02, 0.03, templeLength);
  const templeOffsetX = eyeOffsetX + w + border/2 - 0.02; // Aligned with frame outer edge

  // Left Temple Arm
  const leftTemple = new THREE.Mesh(templeGeom, frameMat);
  leftTemple.position.set(-templeOffsetX, 0.08, -templeLength / 2 + 0.02);
  leftTemple.castShadow = true;
  leftTemple.receiveShadow = true;
  group.add(leftTemple);

  // Left Ear Hook (curving down behind the ear)
  const hookLength = 0.20;
  const hookGeom = new THREE.BoxGeometry(0.02, hookLength, 0.02);
  const leftHook = new THREE.Mesh(hookGeom, frameMat);
  leftHook.position.set(-templeOffsetX, 0.08 - hookLength / 2, -templeLength + 0.02);
  leftHook.rotation.x = -0.15; // Angled slightly backward
  leftHook.castShadow = true;
  leftHook.receiveShadow = true;
  group.add(leftHook);

  // Right Temple Arm
  const rightTemple = new THREE.Mesh(templeGeom, frameMat);
  rightTemple.position.set(templeOffsetX, 0.08, -templeLength / 2 + 0.02);
  rightTemple.castShadow = true;
  rightTemple.receiveShadow = true;
  group.add(rightTemple);

  // Right Ear Hook
  const rightHook = new THREE.Mesh(hookGeom, frameMat);
  rightHook.position.set(templeOffsetX, 0.08 - hookLength / 2, -templeLength + 0.02);
  rightHook.rotation.x = -0.15;
  rightHook.castShadow = true;
  rightHook.receiveShadow = true;
  group.add(rightHook);

  // Silver accent pins on outer front corners for a premium feel
  const pinGeom = new THREE.BoxGeometry(0.04, 0.015, 0.005);
  const pinOffsetX = eyeOffsetX + w - 0.03;
  const leftPin = new THREE.Mesh(pinGeom, pinMat);
  leftPin.position.set(-pinOffsetX, 0.22, 0.025);
  leftPin.castShadow = true;
  group.add(leftPin);

  const rightPin = leftPin.clone();
  rightPin.position.x = pinOffsetX;
  group.add(rightPin);

  return group;
}
