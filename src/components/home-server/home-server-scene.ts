import * as THREE from "three";

type MeshMeta = {
  deviceId: string;
  group: THREE.Group;
  materials: THREE.MeshStandardMaterial[];
  baseZ: number;
  targetLift: number;
  targetGlow: number;
};

type SceneState = {
  animationFrameId: number | null;
  camera: THREE.PerspectiveCamera | null;
  hoverDeviceId: string | null;
  interactiveTargets: THREE.Object3D[];
  isReady: boolean;
  meshMeta: Map<string, MeshMeta>;
  pointer: THREE.Vector2;
  rackRoot: THREE.Group | null;
  raycaster: THREE.Raycaster;
  renderer: THREE.WebGLRenderer | null;
  resizeObserver: ResizeObserver | null;
  rotationTargetX: number;
  rotationTargetY: number;
  scene: THREE.Scene | null;
};

export type HomeServerSceneHandle = {
  destroy: () => void;
  syncVisualState: () => void;
};

type MountHomeServerSceneOptions = {
  canvas: HTMLCanvasElement;
  shell: HTMLDivElement;
  getHoveredDeviceId: () => string | null;
  getSelectedDeviceId: () => string;
  onHoverDeviceChange: (deviceId: string | null) => void;
  onSelectDevice: (deviceId: string) => void;
};

const BASE_RACK_ROTATION_X = -0.01;
const BASE_RACK_ROTATION_Y = 0.14;
const PARALLAX_ROTATION_X = 0.03;
const PARALLAX_ROTATION_Y = 0.045;

function createSceneState(): SceneState {
  return {
    animationFrameId: null,
    camera: null,
    hoverDeviceId: null,
    interactiveTargets: [],
    isReady: false,
    meshMeta: new Map(),
    pointer: new THREE.Vector2(2, 2),
    rackRoot: null,
    raycaster: new THREE.Raycaster(),
    renderer: null,
    resizeObserver: null,
    rotationTargetX: 0,
    rotationTargetY: 0,
    scene: null,
  };
}

function unitCenterY(startU: number, span: number, unitHeight: number) {
  const rackHeight = 12 * unitHeight;
  const rackBottom = -rackHeight / 2;
  return rackBottom + ((startU - 1) + span / 2) * unitHeight;
}

function createMaterial(color: number, emissiveColor: number) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.58,
    roughness: 0.42,
    emissive: new THREE.Color(emissiveColor),
    emissiveIntensity: 0.04,
  });
}

function createDetailLights(
  group: THREE.Group,
  xPositions: number[],
  y: number,
  z: number,
  color: number,
) {
  xPositions.forEach((x) => {
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.06, 0.04),
      new THREE.MeshStandardMaterial({
        color: 0x111722,
        emissive: color,
        emissiveIntensity: 1,
      }),
    );
    led.position.set(x, y, z);
    group.add(led);
  });
}

function createVentGrid(
  group: THREE.Group,
  rows: number,
  cols: number,
  width: number,
  height: number,
  z: number,
) {
  const cellWidth = width / cols;
  const cellHeight = height / rows;
  const geometry = new THREE.BoxGeometry(cellWidth * 0.68, cellHeight * 0.4, 0.015);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const vent = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: 0x0b1118,
          metalness: 0.12,
          roughness: 0.74,
        }),
      );
      vent.position.set(
        -width / 2 + cellWidth * (col + 0.5),
        height / 2 - cellHeight * (row + 0.7),
        z,
      );
      group.add(vent);
    }
  }
}

function registerDeviceMeta(
  sceneState: SceneState,
  deviceId: string,
  group: THREE.Group,
  hitMesh: THREE.Mesh,
  materials: THREE.MeshStandardMaterial[],
) {
  hitMesh.userData.deviceId = deviceId;
  sceneState.interactiveTargets.push(hitMesh);
  sceneState.meshMeta.set(deviceId, {
    deviceId,
    group,
    materials,
    baseZ: group.position.z,
    targetLift: 0,
    targetGlow: 0.04,
  });
}

type DeviceGroupOptions = {
  bodyInset?: number;
  color: number;
  decorate?: (
    group: THREE.Group,
    dimensions: {
      depth: number;
      height: number;
      panelZ: number;
      width: number;
    },
  ) => void;
  depth: number;
  emissive: number;
  id: string;
  panelColor?: number;
  panelInset?: number;
  panelWidth?: number;
  panelWidthFactor?: number;
  span: number;
  startU: number;
  width: number;
  widthFactor: number;
  xOffset?: number;
  zOffset?: number;
};

function createDeviceGroup(
  root: THREE.Group,
  sceneState: SceneState,
  options: DeviceGroupOptions,
) {
  const unitHeight = 0.34;
  const rackWidth = options.width;
  const rackDepth = options.depth;
  const group = new THREE.Group();
  const height = options.span * unitHeight - 0.03;
  const width = rackWidth * options.widthFactor - (options.bodyInset ?? 0.03);
  const panelWidth =
    options.panelWidth ??
    rackWidth * (options.panelWidthFactor ?? options.widthFactor) - (options.panelInset ?? 0.015);
  const depth = rackDepth - 0.22;

  group.position.set(
    options.xOffset ?? 0,
    unitCenterY(options.startU, options.span, unitHeight),
    options.zOffset ?? 0.06,
  );

  const bodyMaterial = createMaterial(options.color, options.emissive);
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), bodyMaterial);
  group.add(body);

  const panelMaterial = createMaterial(options.panelColor ?? options.color, options.emissive);
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(panelWidth, height * 0.95, 0.05),
    panelMaterial,
  );
  panel.position.z = depth / 2 + 0.03;
  group.add(panel);

  options.decorate?.(group, { depth, height, panelZ: panel.position.z + 0.03, width });

  const hitMesh = new THREE.Mesh(
    new THREE.BoxGeometry(width * 1.04, height * 1.08, depth * 1.04),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }),
  );
  group.add(hitMesh);

  registerDeviceMeta(sceneState, options.id, group, hitMesh, [bodyMaterial, panelMaterial]);
  root.add(group);
}

type BlankPanelOptions = {
  color?: number;
  emissive?: number;
  faceWidth?: number;
  height?: number;
  inset?: number;
  span: number;
  startU: number;
  width: number;
  widthFactor?: number;
  xOffset?: number;
  zOffset?: number;
};

function createBlankPanel(root: THREE.Group, options: BlankPanelOptions) {
  const unitHeight = 0.34;
  const group = new THREE.Group();
  const height = options.height ?? options.span * unitHeight - 0.03;
  const width = options.faceWidth ?? options.width * (options.widthFactor ?? 1) - (options.inset ?? 0.015);
  const faceMaterial = new THREE.MeshStandardMaterial({
    color: options.color ?? 0x1a2029,
    metalness: 0.62,
    roughness: 0.46,
    emissive: new THREE.Color(options.emissive ?? 0x1b2c3a),
    emissiveIntensity: 0.04,
  });

  group.position.set(
    options.xOffset ?? 0,
    unitCenterY(options.startU, options.span, unitHeight),
    options.zOffset ?? 0.74,
  );

  const face = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.04), faceMaterial);
  group.add(face);

  const screwGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.014);
  const screwMaterial = new THREE.MeshStandardMaterial({
    color: 0x647182,
    metalness: 0.84,
    roughness: 0.26,
  });

  [
    [-width * 0.46, height * 0.38],
    [width * 0.46, height * 0.38],
    [-width * 0.46, -height * 0.38],
    [width * 0.46, -height * 0.38],
  ].forEach(([x, y]) => {
    const screw = new THREE.Mesh(screwGeometry, screwMaterial);
    screw.position.set(x, y, 0.025);
    group.add(screw);
  });

  root.add(group);
}

function buildRackScene(sceneState: SceneState) {
  const rackRoot = new THREE.Group();
  const frameGroup = new THREE.Group();
  const rackOuterWidth = 2.85;
  const rackOuterDepth = 2.05;
  const rackInnerWidth = 2.32;
  const rackInnerDepth = 1.52;
  const rackHeight = 12 * 0.34 + 0.18;

  const shellMaterial = new THREE.MeshStandardMaterial({
    color: 0x151b23,
    metalness: 0.68,
    roughness: 0.38,
  });
  const rearFrameMaterial = new THREE.MeshStandardMaterial({
    color: 0x232c37,
    metalness: 0.72,
    roughness: 0.34,
  });
  const shellEdgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a3441,
    metalness: 0.8,
    roughness: 0.28,
  });
  const sideWallGeometry = new THREE.BoxGeometry(0.08, rackHeight, rackOuterDepth);
  const roofGeometry = new THREE.BoxGeometry(rackOuterWidth, 0.08, rackOuterDepth);
  const rearPanelGeometry = new THREE.BoxGeometry(rackOuterWidth - 0.12, rackHeight - 0.12, 0.05);
  const rearPostGeometry = new THREE.BoxGeometry(0.08, rackHeight, 0.08);
  const rearCrossGeometry = new THREE.BoxGeometry(rackOuterWidth - 0.08, 0.06, 0.08);
  const frontEdgeGeometry = new THREE.BoxGeometry(0.06, rackHeight - 0.12, 0.12);
  const frontRailX = rackInnerWidth / 2 + 0.045;
  const frontRailHalfWidth = 0.03;
  const flushFrontWidth = 2 * (frontRailX - frontRailHalfWidth) + 0.008;
  const flushHalfFrontWidth = flushFrontWidth / 2;
  const halfDeviceOffset = flushHalfFrontWidth / 2;
  const frontMountPlaneZ = rackOuterDepth / 2 - 0.14;
  const devicePanelCenterZ = frontMountPlaneZ - 0.025;
  const blankPanelCenterZ = frontMountPlaneZ - 0.02;

  [
    [-rackOuterWidth / 2, 0, 0],
    [rackOuterWidth / 2, 0, 0],
  ].forEach(([x, y, z]) => {
    const wall = new THREE.Mesh(sideWallGeometry, shellMaterial);
    wall.position.set(x, y, z);
    frameGroup.add(wall);
  });

  [
    [0, rackHeight / 2, 0],
    [0, -rackHeight / 2, 0],
  ].forEach(([x, y, z]) => {
    const panel = new THREE.Mesh(roofGeometry, shellMaterial);
    panel.position.set(x, y, z);
    frameGroup.add(panel);
  });

  const rearPanel = new THREE.Mesh(rearPanelGeometry, rearFrameMaterial);
  rearPanel.position.set(0, 0, -rackOuterDepth / 2 + 0.03);
  frameGroup.add(rearPanel);

  [
    [-rackOuterWidth / 2, 0, -rackOuterDepth / 2],
    [rackOuterWidth / 2, 0, -rackOuterDepth / 2],
  ].forEach(([x, y, z]) => {
    const post = new THREE.Mesh(rearPostGeometry, rearFrameMaterial);
    post.position.set(x, y, z);
    frameGroup.add(post);
  });

  [
    [0, rackHeight / 2 - 0.03, -rackOuterDepth / 2],
    [0, -rackHeight / 2 + 0.03, -rackOuterDepth / 2],
  ].forEach(([x, y, z]) => {
    const cross = new THREE.Mesh(rearCrossGeometry, rearFrameMaterial);
    cross.position.set(x, y, z);
    frameGroup.add(cross);
  });

  [
    [-frontRailX, 0, rackOuterDepth / 2 - 0.08],
    [frontRailX, 0, rackOuterDepth / 2 - 0.08],
  ].forEach(([x, y, z]) => {
    const edge = new THREE.Mesh(frontEdgeGeometry, shellEdgeMaterial);
    edge.position.set(x, y, z);
    frameGroup.add(edge);
  });

  rackRoot.add(frameGroup);

  createBlankPanel(rackRoot, {
    startU: 7,
    span: 1,
    width: rackInnerWidth,
    color: 0x181f28,
    emissive: 0x20303f,
    faceWidth: flushFrontWidth,
    zOffset: blankPanelCenterZ,
  });

  createBlankPanel(rackRoot, {
    startU: 9,
    span: 1,
    width: rackInnerWidth,
    color: 0x181f28,
    emissive: 0x20303f,
    faceWidth: flushFrontWidth,
    zOffset: blankPanelCenterZ,
  });

  createBlankPanel(rackRoot, {
    startU: 11,
    span: 2,
    width: rackInnerWidth,
    color: 0x161d25,
    emissive: 0x1b2937,
    faceWidth: flushFrontWidth,
    zOffset: blankPanelCenterZ,
  });

  createDeviceGroup(rackRoot, sceneState, {
    id: "ups",
    startU: 1,
    span: 2,
    width: rackInnerWidth,
    depth: rackInnerDepth,
    widthFactor: 1,
    panelWidth: flushFrontWidth,
    zOffset: devicePanelCenterZ - (rackInnerDepth - 0.22) / 2 - 0.03,
    color: 0x202833,
    panelColor: 0x293341,
    emissive: 0x2f6f8a,
    decorate(group, dimensions) {
      const display = new THREE.Mesh(
        new THREE.BoxGeometry(dimensions.width * 0.24, dimensions.height * 0.26, 0.025),
        new THREE.MeshStandardMaterial({
          color: 0x0f1822,
          emissive: 0x54d2ff,
          emissiveIntensity: 0.48,
        }),
      );
      display.position.set(-dimensions.width * 0.22, 0.05, dimensions.panelZ);
      group.add(display);
      createVentGrid(group, 3, 12, dimensions.width * 0.62, dimensions.height * 0.62, dimensions.panelZ);
      createDetailLights(
        group,
        [dimensions.width * 0.28, dimensions.width * 0.34],
        -0.18,
        dimensions.panelZ,
        0x7ee787,
      );
    },
  });

  createDeviceGroup(rackRoot, sceneState, {
    id: "stratton",
    startU: 3,
    span: 4,
    width: rackInnerWidth,
    depth: rackInnerDepth,
    widthFactor: 1,
    panelWidth: flushFrontWidth,
    zOffset: devicePanelCenterZ - (rackInnerDepth - 0.22) / 2 - 0.03,
    color: 0x2a3341,
    panelColor: 0x313d4e,
    emissive: 0x4cc9f0,
    decorate(group, dimensions) {
      createVentGrid(group, 6, 16, dimensions.width * 0.74, dimensions.height * 0.64, dimensions.panelZ);

      [-dimensions.width * 0.4, dimensions.width * 0.4].forEach((x) => {
        const handle = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, dimensions.height * 0.74, 0.08),
          new THREE.MeshStandardMaterial({
            color: 0x7a8698,
            metalness: 0.9,
            roughness: 0.26,
          }),
        );
        handle.position.set(x, 0, dimensions.panelZ + 0.02);
        group.add(handle);
      });

      const badge = new THREE.Mesh(
        new THREE.BoxGeometry(dimensions.width * 0.18, 0.16, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0x101722,
          emissive: 0x4cc9f0,
          emissiveIntensity: 0.34,
        }),
      );
      badge.position.set(0, dimensions.height * 0.34, dimensions.panelZ);
      group.add(badge);

      createDetailLights(
        group,
        [-dimensions.width * 0.3, -dimensions.width * 0.22, -dimensions.width * 0.14],
        -dimensions.height * 0.34,
        dimensions.panelZ,
        0x7ee787,
      );
    },
  });

  createDeviceGroup(rackRoot, sceneState, {
    id: "nut",
    startU: 8,
    span: 1,
    width: rackInnerWidth,
    depth: rackInnerDepth,
    widthFactor: 0.5,
    panelWidth: flushHalfFrontWidth,
    xOffset: -halfDeviceOffset,
    zOffset: devicePanelCenterZ - (rackInnerDepth - 0.22) / 2 - 0.03,
    color: 0x2f2620,
    panelColor: 0x423224,
    emissive: 0xf7b955,
    decorate(group, dimensions) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(dimensions.width * 0.82, 0.08, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0x2e1f14,
          emissive: 0xf7b955,
          emissiveIntensity: 0.22,
        }),
      );
      stripe.position.set(0, 0.02, dimensions.panelZ);
      group.add(stripe);
      createDetailLights(group, [0.22, 0.3], -0.06, dimensions.panelZ, 0xf7b955);
    },
  });

  createDeviceGroup(rackRoot, sceneState, {
    id: "rocky",
    startU: 8,
    span: 1,
    width: rackInnerWidth,
    depth: rackInnerDepth,
    widthFactor: 0.5,
    panelWidth: flushHalfFrontWidth,
    xOffset: halfDeviceOffset,
    zOffset: devicePanelCenterZ - (rackInnerDepth - 0.22) / 2 - 0.03,
    color: 0x1f2b33,
    panelColor: 0x28404d,
    emissive: 0x4cc9f0,
    decorate(group, dimensions) {
      const stripe = new THREE.Mesh(
        new THREE.BoxGeometry(dimensions.width * 0.82, 0.08, 0.02),
        new THREE.MeshStandardMaterial({
          color: 0x13232d,
          emissive: 0x4cc9f0,
          emissiveIntensity: 0.24,
        }),
      );
      stripe.position.set(0, 0.02, dimensions.panelZ);
      group.add(stripe);
      createDetailLights(group, [0.18, 0.28], -0.06, dimensions.panelZ, 0x4cc9f0);
    },
  });

  createDeviceGroup(rackRoot, sceneState, {
    id: "router",
    startU: 10,
    span: 1,
    width: rackInnerWidth,
    depth: rackInnerDepth,
    widthFactor: 1,
    panelWidth: flushFrontWidth,
    zOffset: devicePanelCenterZ - (rackInnerDepth - 0.22) / 2 - 0.03,
    color: 0x1d232b,
    panelColor: 0x252e3a,
    emissive: 0x7dd3fc,
    decorate(group, dimensions) {
      const portGeometry = new THREE.BoxGeometry(0.12, 0.035, 0.018);
      const portMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f141d,
        metalness: 0.1,
        roughness: 0.82,
      });

      for (let index = 0; index < 10; index += 1) {
        const port = new THREE.Mesh(portGeometry, portMaterial);
        port.position.set(-dimensions.width * 0.32 + index * 0.14, -0.02, dimensions.panelZ);
        group.add(port);
      }

      createDetailLights(
        group,
        [-dimensions.width * 0.42, -dimensions.width * 0.36, -dimensions.width * 0.3],
        0.08,
        dimensions.panelZ,
        0x7ee787,
      );
    },
  });

  rackRoot.rotation.x = BASE_RACK_ROTATION_X;
  rackRoot.rotation.y = BASE_RACK_ROTATION_Y;

  return rackRoot;
}

function updateRendererSize(sceneState: SceneState, shell: HTMLDivElement) {
  if (!sceneState.renderer || !sceneState.camera) {
    return;
  }

  const width = shell.clientWidth;
  const height = shell.clientHeight;

  if (!width || !height) {
    return;
  }

  sceneState.renderer.setSize(width, height, false);
  sceneState.camera.aspect = width / height;
  sceneState.camera.updateProjectionMatrix();
}

function pickRackDevice(sceneState: SceneState, event: PointerEvent) {
  if (!sceneState.camera || !sceneState.renderer) {
    return null;
  }

  const rect = sceneState.renderer.domElement.getBoundingClientRect();
  sceneState.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  sceneState.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  sceneState.raycaster.setFromCamera(sceneState.pointer, sceneState.camera);

  const intersections = sceneState.raycaster.intersectObjects(sceneState.interactiveTargets, false);
  return intersections[0]?.object?.userData?.deviceId ?? null;
}

function syncVisualState(sceneState: SceneState, options: MountHomeServerSceneOptions) {
  const selectedDeviceId = options.getSelectedDeviceId();
  const hoveredDeviceId = sceneState.hoverDeviceId ?? options.getHoveredDeviceId();

  sceneState.meshMeta.forEach((meta) => {
    const isSelected = meta.deviceId === selectedDeviceId;
    const isHovered = meta.deviceId === hoveredDeviceId;

    meta.targetLift = isSelected ? 0.12 : isHovered ? 0.06 : 0;
    meta.targetGlow = isSelected ? 0.5 : isHovered ? 0.24 : 0.04;
  });
}

function animateScene(sceneState: SceneState) {
  if (!sceneState.isReady || !sceneState.renderer || !sceneState.scene || !sceneState.camera) {
    return;
  }

  sceneState.animationFrameId = window.requestAnimationFrame(() => animateScene(sceneState));

  if (sceneState.rackRoot) {
    sceneState.rackRoot.rotation.y +=
      (BASE_RACK_ROTATION_Y + sceneState.rotationTargetY - sceneState.rackRoot.rotation.y) * 0.08;
    sceneState.rackRoot.rotation.x +=
      (BASE_RACK_ROTATION_X + sceneState.rotationTargetX - sceneState.rackRoot.rotation.x) * 0.08;
  }

  sceneState.meshMeta.forEach((meta) => {
    meta.group.position.z += (meta.baseZ + meta.targetLift - meta.group.position.z) * 0.14;

    meta.materials.forEach((material) => {
      material.emissiveIntensity += (meta.targetGlow - material.emissiveIntensity) * 0.14;
    });
  });

  sceneState.renderer.render(sceneState.scene, sceneState.camera);
}

function disposeObject(object: THREE.Object3D) {
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;

    mesh.geometry?.dispose?.();

    const material = (mesh as { material?: THREE.Material | THREE.Material[] }).material;

    if (Array.isArray(material)) {
      material.forEach((entry) => entry.dispose());
      return;
    }

    material?.dispose();
  });
}

export function mountHomeServerScene(
  options: MountHomeServerSceneOptions,
): HomeServerSceneHandle {
  const sceneState = createSceneState();

  sceneState.renderer = new THREE.WebGLRenderer({
    canvas: options.canvas,
    antialias: true,
    alpha: true,
  });
  sceneState.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  sceneState.renderer.outputColorSpace = THREE.SRGBColorSpace;

  sceneState.scene = new THREE.Scene();
  sceneState.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
  sceneState.camera.position.set(1.1, 0.82, 9.7);
  sceneState.camera.lookAt(0, 0.08, 0);

  sceneState.scene.add(new THREE.AmbientLight(0xffffff, 1.15));

  const keyLight = new THREE.DirectionalLight(0xa8ddff, 1.7);
  keyLight.position.set(4, 7, 6);
  sceneState.scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffd2b0, 0.75);
  fillLight.position.set(-5, 2, 4);
  sceneState.scene.add(fillLight);

  const rimLight = new THREE.PointLight(0x4cc9f0, 1.1, 18);
  rimLight.position.set(0, 2.6, 3.6);
  sceneState.scene.add(rimLight);

  sceneState.rackRoot = buildRackScene(sceneState);
  sceneState.scene.add(sceneState.rackRoot);

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  const handlePointerMove = (event: PointerEvent) => {
    const deviceId = pickRackDevice(sceneState, event);

    sceneState.hoverDeviceId = deviceId;
    options.onHoverDeviceChange(deviceId);
    syncVisualState(sceneState, options);

    if (!isCoarsePointer && !prefersReducedMotion) {
      const rect = options.canvas.getBoundingClientRect();
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
      sceneState.rotationTargetY = offsetX * PARALLAX_ROTATION_Y;
      sceneState.rotationTargetX = offsetY * PARALLAX_ROTATION_X;
      return;
    }

    sceneState.rotationTargetY = 0;
    sceneState.rotationTargetX = 0;
  };

  const handlePointerLeave = () => {
    sceneState.hoverDeviceId = null;
    sceneState.rotationTargetY = 0;
    sceneState.rotationTargetX = 0;
    options.onHoverDeviceChange(null);
    syncVisualState(sceneState, options);
  };

  const handleClick = (event: PointerEvent) => {
    const deviceId = pickRackDevice(sceneState, event);

    if (deviceId) {
      options.onSelectDevice(deviceId);
      syncVisualState(sceneState, options);
    }
  };

  options.canvas.addEventListener("pointermove", handlePointerMove);
  options.canvas.addEventListener("pointerleave", handlePointerLeave);
  options.canvas.addEventListener("click", handleClick);

  const handleResize = () => updateRendererSize(sceneState, options.shell);
  updateRendererSize(sceneState, options.shell);
  window.addEventListener("resize", handleResize);

  if ("ResizeObserver" in window) {
    sceneState.resizeObserver = new ResizeObserver(handleResize);
    sceneState.resizeObserver.observe(options.shell);
  }

  sceneState.isReady = true;
  syncVisualState(sceneState, options);
  animateScene(sceneState);

  return {
    destroy() {
      sceneState.isReady = false;

      if (sceneState.animationFrameId !== null) {
        window.cancelAnimationFrame(sceneState.animationFrameId);
      }

      options.canvas.removeEventListener("pointermove", handlePointerMove);
      options.canvas.removeEventListener("pointerleave", handlePointerLeave);
      options.canvas.removeEventListener("click", handleClick);

      if (sceneState.resizeObserver) {
        sceneState.resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);

      if (sceneState.rackRoot) {
        disposeObject(sceneState.rackRoot);
      }

      sceneState.renderer?.dispose();
      sceneState.meshMeta.clear();
      sceneState.interactiveTargets.length = 0;
    },
    syncVisualState() {
      syncVisualState(sceneState, options);
    },
  };
}
