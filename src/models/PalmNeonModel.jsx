/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: 𝔼ℕ𝔼𝔸 𝕃𝔼 𝔽𝕆ℕ𝕊 (https://sketchfab.com/enealefons)
License: SKETCHFAB Standard (https://sketchfab.com/licenses)
Source: https://sketchfab.com/3d-models/uxrzone-lofi-palm-tree-ea2cd882db41471fa601f727bc73895d
Title: UXR.zone LOFI Palm Tree
*/

import React, { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import model from "./palm_neon.glb";
import { useGraph } from "@react-three/fiber";

export function PalmNeonModel(props) {
  const { materials, scene } = useGLTF(model);
  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  // useGraph creates two flat object collections for nodes and materials
  const { nodes } = useGraph(clone)
  return (
    <group {...props} dispose={null}>
      <primitive object={nodes._rootJoint} />
      <skinnedMesh
        geometry={nodes.Object_5.geometry}
        material={materials.Material}
        skeleton={nodes.Object_5.skeleton}
      >
        <meshBasicMaterial wireframe color="#693505"/>
      </skinnedMesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes["0"].geometry}
        material={materials.Material1}
      />
    </group>
  );
}

useGLTF.preload("./palm_neon.glb");