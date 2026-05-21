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

            // Traverse and modify materials BEFORE compiling the character to WebGL
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

                  const newMaterials = materials.map((mat) => {
                    // Using isMaterial property check to be bundler/version independent
                    if (mat && (mat as any).isMaterial) {
                      const clonedMat = mat.clone() as any;
                      clonedMat.needsUpdate = true;
                      
                      const nodeName = child.name || "";
                      const matName = mat.name || "";

                      // Match hair and eyebrows (by name or material)
                      if (
                        nodeName === "hair" ||
                        nodeName === "Eyebrow" ||
                        matName === "Material.030" ||
                        matName === "Material.014"
                      ) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0x0f0b11); // Dark hair
                        clonedMat.roughness = 0.85;
                      }
                      // Match jacket / hoodie / shirt
                      else if (
                        nodeName === "BODY.SHIRT" ||
                        nodeName.includes("SHIRT") ||
                        nodeName.includes("BODY") ||
                        nodeName.includes("shirt") ||
                        nodeName.includes("body")
                      ) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0xd00808); // Vibrant red jacket/dress
                        clonedMat.roughness = 0.65;
                      }
                      // Match skin parts (Face, Ears, Neck, Hands)
                      else if (
                        nodeName === "Cube.002" || // Face node
                        nodeName === "Cube002" || // Face node normalized
                        nodeName === "Cube.007" || // Face mesh
                        nodeName === "Cube007" || // Face mesh normalized
                        nodeName === "Neck" ||
                        nodeName === "Hand" ||
                        nodeName === "Ear.001" ||
                        nodeName === "Ear001" ||
                        nodeName.includes("Ear") ||
                        nodeName.includes("Hand") ||
                        nodeName.includes("Neck")
                      ) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0xa08870); // Warm tan skin tone
                        clonedMat.roughness = 0.55;
                      }
                      // Match pants
                      else if (nodeName === "Pant" || nodeName.includes("Pant")) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0x1a181c);
                        clonedMat.roughness = 0.7;
                      }
                      // Match shoes
                      else if (nodeName === "Shoe" || nodeName.includes("Shoe")) {
                        if ('color' in clonedMat) clonedMat.color.setHex(0x222222);
                      }
                      // Match soles
                      else if (nodeName === "Sole" || nodeName.includes("Sole")) {
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
