import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { Suspense, useRef, useMemo } from "react";
import { OrthographicCamera, Environment } from "@react-three/drei";

import { useMouseAndScreen } from "@/ui/hooks/app";
import * as THREE from "three";
THREE.ColorManagement.enabled = true;

function MeshComponent({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) {
  const fileUrl = "/3d/dice.glb";
  const mesh = useRef<THREE.Group>(null!);
  const gltf = useLoader(GLTFLoader, fileUrl);

  const { camera } = useThree();
  const { mousePosition } = useMouseAndScreen();

  // Load the environment map using RGBELoader
  const hdrTexture = useLoader(RGBELoader, "/3d/scene.hdr");

  // Prepare the PMREM generator
  const { gl } = useThree();
  const pmremGenerator = useMemo(() => new THREE.PMREMGenerator(gl), [gl]);
  pmremGenerator.compileEquirectangularShader();

  const envMap = useMemo(() => {
    const envMapTexture =
      pmremGenerator.fromEquirectangular(hdrTexture).texture;
    hdrTexture.dispose();
    pmremGenerator.dispose();
    return envMapTexture;
  }, [hdrTexture, pmremGenerator]);

  // Center the model using useMemo
  const centeredScene = useMemo(() => {
    if (gltf && gltf.scene) {
      const scene = gltf.scene.clone();

      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.set(-center.x, -center.y, -center.z);

      // Traverse the scene and adjust materials
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const meshChild = child;

          // Ensure the material is MeshStandardMaterial or MeshPhysicalMaterial
          if (
            meshChild.material instanceof THREE.MeshStandardMaterial ||
            meshChild.material instanceof THREE.MeshPhysicalMaterial
          ) {
            const material = meshChild.material;

            // Adjust material properties if needed
            material.metalness = 1; // High metallic
            material.roughness = 0.2; // Low roughness

            // Set the environment map
            material.envMap = envMap;
            material.envMapIntensity = 1; // Adjust as needed
            material.needsUpdate = true;
          }
        }
      });

      return scene;
    }
  }, [gltf, envMap]);

  useFrame(() => {
    if (mesh.current && canvasRef.current) {
      const { x: mouseX, y: mouseY } = mousePosition;

      // Get the canvas's position and size
      const rect = canvasRef.current.getBoundingClientRect();

      // Adjust mouse coordinates to be relative to the canvas
      const x = mouseX - rect.left;
      const y = mouseY - rect.top;
      const width = rect.width;
      const height = rect.height;

      // Convert mouse coordinates to normalized device coordinates (-1 to 1)
      const ndcX = (x / width) * 2 - 1;
      const ndcY = 1 - (2 * y) / height;

      // Adjust rotation sensitivity
      const rotationFactor = 50; // Adjust as needed

      // Create a vector for the mouse position in NDC
      const vector = new THREE.Vector3(
        ndcX * rotationFactor,
        ndcY * rotationFactor,
        -2
      );

      // Convert the NDC to world space
      vector.unproject(camera);

      // Make the object look at the converted world space position
      mesh.current.lookAt(vector);
    }
  });

  return (
    <>
      <group ref={mesh} position={[0, 0, 0]}>
        {centeredScene && <primitive object={centeredScene} />}
      </group>
    </>
  );
}

function Scene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return (
    <Canvas
      ref={canvasRef}
      gl={{
        outputColorSpace: "srgb",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1, // Match Blender exposure
      }}
    >
      <OrthographicCamera
        makeDefault
        position={[0, 0, 3]}
        zoom={30}
        near={0.1}
        far={1000}
      />
      {/* Add Environment component */}
      <Suspense fallback={null}>
        <Environment files="/3d/scene.hdr" background={false} />
      </Suspense>
      <Suspense fallback={<LoadingIndicator />}>
        <MeshComponent canvasRef={canvasRef} />
      </Suspense>
    </Canvas>
  );
}

// Simple loading indicator
function LoadingIndicator() {
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

export default Scene;
