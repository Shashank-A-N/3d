
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ModelConfig } from '../types';

interface ModelViewerProps {
  config: ModelConfig;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    character: THREE.Group;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    
    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lights
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(config.lighting === 'eerie' ? 0x00ff88 : 0x3366ff, 2);
    backLight.position.set(-5, 2, -5);
    scene.add(backLight);

    // Placeholder Character Geometry (Stylized abstract representation)
    const character = new THREE.Group();
    
    // Torso
    const torsoGeom = new THREE.CylinderGeometry(0.5, 0.4, 1.2, 6);
    const material = new THREE.MeshStandardMaterial({ 
      color: config.primaryColor, 
      metalness: config.material === 'metallic' ? 0.9 : 0.1,
      roughness: config.material === 'matte' ? 0.8 : 0.2,
      emissive: config.material === 'glowing' ? config.secondaryColor : 0x000000,
      emissiveIntensity: 0.5
    });
    const torso = new THREE.Mesh(torsoGeom, material);
    character.add(torso);

    // Head
    const headGeom = new THREE.OctahedronGeometry(0.35, 1);
    const head = new THREE.Mesh(headGeom, material);
    head.position.y = 1;
    character.add(head);

    // Spikes / Details based on "features"
    if (config.features.some(f => f.toLowerCase().includes('spike') || f.toLowerCase().includes('armor'))) {
        for(let i=0; i<8; i++) {
            const spikeGeom = new THREE.ConeGeometry(0.1, 0.4, 4);
            const spike = new THREE.Mesh(spikeGeom, new THREE.MeshStandardMaterial({ color: config.secondaryColor }));
            const angle = (i / 8) * Math.PI * 2;
            spike.position.set(Math.cos(angle) * 0.5, 0.4, Math.sin(angle) * 0.5);
            spike.rotation.x = Math.PI / 2;
            spike.rotation.z = angle;
            character.add(spike);
        }
    }

    // Cape representation
    const capeGeom = new THREE.PlaneGeometry(1.2, 2);
    const capeMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', side: THREE.DoubleSide });
    const cape = new THREE.Mesh(capeGeom, capeMat);
    cape.position.set(0, -0.2, -0.4);
    cape.rotation.x = -0.1;
    character.add(cape);

    scene.add(character);

    // Grid Floor
    const grid = new THREE.GridHelper(10, 10, 0x333333, 0x1a1a1a);
    grid.position.y = -0.8;
    scene.add(grid);

    sceneRef.current = { scene, renderer, camera, controls, character };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
          containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [config]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-black/40 border border-white/5 shadow-2xl group">
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 pointer-events-none">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Interactive Preview</p>
        <p className="text-white font-mono text-xs">{config.name}.mesh</p>
      </div>
      <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono flex items-center gap-2">
        <i className="fas fa-expand-arrows-alt"></i> Orbit to inspect
      </div>
    </div>
  );
};

export default ModelViewer;
