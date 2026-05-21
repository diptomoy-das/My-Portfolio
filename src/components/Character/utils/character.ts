import * as THREE from "three";
import { DRACOLoader, GLTF, GLTFLoader } from "three-stdlib";
import { setCharTimeline, setAllTimeline } from "../../utils/GsapScroll";
import { decryptFile } from "./decrypt";

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
            await renderer.compileAsync(character, camera, scene);
            character.traverse((child: any) => {
              if (child.isMesh) {
                const mesh = child as THREE.Mesh;
                child.castShadow = true;
                child.receiveShadow = true;
                mesh.frustumCulled = true;

                if (mesh.material) {
                  const materials = Array.isArray(mesh.material)
                    ? mesh.material
                    : [mesh.material];

                  materials.forEach((mat, idx) => {
                    if (mat instanceof THREE.MeshStandardMaterial) {
                      const clonedMat = mat.clone();
                      const nodeName = child.name;

                      if (nodeName === "hair" || nodeName === "Eyebrow") {
                        // Dark hair and eyebrows
                        clonedMat.color.setHex(0x0f0b11);
                        clonedMat.roughness = 0.85;
                      } else if (nodeName === "BODY.SHIRT") {
                        // Red jacket / hoodie
                        clonedMat.color.setHex(0xb30915);
                        clonedMat.roughness = 0.65;
                      } else if (
                        nodeName === "Cube.002" || // Face mesh
                        nodeName === "Neck" ||
                        nodeName === "Hand" ||
                        nodeName === "Ear.001"
                      ) {
                        // Skin tone matching the user's photo
                        clonedMat.color.setHex(0xd6a280);
                        clonedMat.roughness = 0.55;
                      } else if (nodeName === "Pant") {
                        // Dark pants
                        clonedMat.color.setHex(0x1a181c);
                        clonedMat.roughness = 0.7;
                      } else if (nodeName === "Shoe") {
                        // Dark shoes
                        clonedMat.color.setHex(0x222222);
                      } else if (nodeName === "Sole") {
                        // Contrast soles
                        clonedMat.color.setHex(0xcccccc);
                      }

                      if (Array.isArray(mesh.material)) {
                        mesh.material[idx] = clonedMat;
                      } else {
                        mesh.material = clonedMat;
                      }
                    }
                  });
                }
              }
            });
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
