import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";
import { createSpectacles } from "./spectacles";

const setCharacter = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera
) => {
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  const loadCharacter = () => {
    return new Promise<GLTF | null>(async (resolve, reject) => {
      try {
        const encryptedBlob = await decryptFile(
          "/models/character.enc",
          "Character3D#@"
        );
        const blobUrl = URL.createObjectURL(new Blob([encryptedBlob]));

        let character: THREE.Object3D;
        loader.load(
          blobUrl,
          async (gltf) => {
            character = gltf.scene;

            // Traverse and modify materials BEFORE compiling the character to WebGL
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                // Programmatically deform hair geometry to make it curly and fade the sideburns
                if (mesh.name === "hair" && mesh.geometry) {
                  const geometry = mesh.geometry;
                  const positionAttr = geometry.attributes.position;
                  if (positionAttr) {
                    for (let i = 0; i < positionAttr.count; i++) {
                      const x = positionAttr.getX(i);
                      const y = positionAttr.getY(i);
                      const z = positionAttr.getZ(i);

                      // 1. Curl deformation
                      const factor = (y + 0.14) / 0.26; // Pin at base, wave/curl at top/sides
                      const phase1 = (x * 35) + (y * 80) + (z * 35);
                      const phase2 = (x * 60) - (y * 130) + (z * 60);
                      const dx = (Math.sin(phase1) + 0.3 * Math.sin(phase2)) * 0.0045 * factor;
                      const dz = (Math.cos(phase1) + 0.3 * Math.cos(phase2)) * 0.0045 * factor;

                      let newX = x + dx;
                      let newZ = z + dz;

                      // 2. Sideburns fade (thinning and pulling back in the lower-sides region)
                      const sideFactor = Math.max(0, Math.min(1, (Math.abs(newX) - 0.03) / 0.05));
                      if (y < 0) {
                        const t = Math.max(0, Math.min(1, -y / 0.14));
                        const reduction = 0.3 * t * sideFactor; // Up to 30% reduction on the far sides
                        newX = newX * (1.0 - reduction);
                        newZ = newZ - 0.015 * t * sideFactor; // Recess back slightly
                      }

                      positionAttr.setX(i, newX);
                      positionAttr.setZ(i, newZ);
                    }
                    positionAttr.needsUpdate = true;
                    geometry.computeVertexNormals();
                  }
                }

                if (mesh.material) {
                  const materials = Array.isArray(mesh.material)
                    ? mesh.material
                    : [mesh.material];

                  const newMaterials = materials.map((mat) => {
                    // Using isMaterial property check to be bundler/version independent
                    if (mat && (mat as any).isMaterial) {
                      const clonedMat = mat.clone() as any;
                      clonedMat.needsUpdate = true;
                      
                      const nodeName = child.name || "";
                      const originalName = (child.userData && child.userData.name) || "";
                      const matName = mat.name || "";

                      const isHair = 
                        nodeName.includes("hair") ||
                        originalName.includes("hair") ||
                        nodeName.includes("Eyebrow") ||
                        originalName.includes("Eyebrow") ||
                        matName === "Material.030" ||
                        matName === "Material.014";

                      const isShirt =
                        nodeName.includes("SHIRT") ||
                        originalName.includes("SHIRT") ||
                        nodeName.includes("BODY") ||
                        originalName.includes("BODY") ||
                        nodeName.includes("shirt") ||
                        originalName.includes("shirt") ||
                        nodeName.includes("body") ||
                        originalName.includes("body");

                      const isSkin = 
                        nodeName.includes("Plane007") ||
                        originalName.includes("Plane.007") ||
                        nodeName.includes("Cube002") ||
                        originalName.includes("Cube.002") ||
                        nodeName.includes("Cube007") ||
                        originalName.includes("Cube.007") ||
                        nodeName.includes("Neck") ||
                        originalName.includes("Neck") ||
                        nodeName.includes("Hand") ||
                        originalName.includes("Hand") ||
                        nodeName.includes("Ear") ||
                        originalName.includes("Ear");

                      const isPants =
                        nodeName.includes("Pant") ||
                        originalName.includes("Pant") ||
                        nodeName.includes("pant") ||
                        originalName.includes("pant");

                      const isShoes =
                        nodeName.includes("Shoe") ||
                        originalName.includes("Shoe") ||
                        nodeName.includes("shoe") ||
                        originalName.includes("shoe");

                      const isSoles =
                        nodeName.includes("Sole") ||
                        originalName.includes("Sole") ||
                        nodeName.includes("sole") ||
                        originalName.includes("sole");

                      if (isHair) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0x0f0b11); // Dark hair
                        clonedMat.roughness = 0.85;
                      } else if (isShirt) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0xd00808); // Vibrant red jacket/dress
                        clonedMat.roughness = 0.65;
                      } else if (isSkin) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0x9e5a3e); // Warm tan skin tone matching photo
                        clonedMat.roughness = 0.55;
                      } else if (isPants) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0x1a181c);
                        clonedMat.roughness = 0.7;
                      } else if (isShoes) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0x222222);
                      } else if (isSoles) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0xcccccc);
                      }
                      
                      return clonedMat;
                    }
                    return mat;
                  });

                  mesh.material = Array.isArray(mesh.material)
                    ? newMaterials
                    : newMaterials[0];
                }
              }
            });

            // Attach spectacles to head bone
            const headBone = character.getObjectByName("spine006");
            if (headBone) {
              const spectacles = createSpectacles();
              // Local position relative to spine006
              spectacles.position.set(-2.763e-7, 1.20917, 1.18);
              // Local rotation relative to spine006
              spectacles.rotation.set(-0.097296, 0, 0);
              headBone.add(spectacles);
            }

            await renderer.compileAsync(character, camera, scene);
            resolve(gltf);
            setCharTimeline(character, camera);
            setAllTimeline();
            character!.getObjectByName("footR")!.position.y = 3.36;
            character!.getObjectByName("footL")!.position.y = 3.36;
            dracoLoader.dispose();
          },
          undefined,
          (error) => {
            console.error("Error loading GLTF model:", error);
            reject(error);
          }
        );
      } catch (err) {
        reject(err);
        console.error(err);
      }
    });
  };

  return { loadCharacter };
};

export default setCharacter;
