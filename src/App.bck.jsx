import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei';
import { CactusModel } from './models/CactusModel';
import { HareModel } from './models/HareModel';
import gridPlaneVert from './shaders/gridPlane.vert';
import gridPlaneFrag from './shaders/gridPlane.frag';
import { BufferAttribute, ShaderMaterial, Vector2 } from 'three';
import { PalmNeonModel } from './models/PalmNeonModel';
// PostProcessing
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from "./shaders/post/TransparentUnrealBloomPass"
import { BadTVShader } from './shaders/post/BadTVShader';
import { RGBShiftShader } from './shaders/post/RGBShiftShader';
import { FilmShader } from './shaders/post/FilmShader';
import { StaticShader } from './shaders/post/StaticShader';
import { WE2002Model } from './models/WE2002Model';
// Audio
import retrotypeMP3 from './assets/retrotype.mp3'
const typewriterSFX = new Audio(retrotypeMP3);
import targetsMind from './assets/targets.mind'
import volumePNG from './assets/volume.png'
import mutePNG from './assets/mute.png'


extend({EffectComposer, RenderPass, ShaderPass, UnrealBloomPass});

function Effects() {
  const composerRef = useRef();
  const badTVRef = useRef();
  const filmRef = useRef();
  const staticRef = useRef();
  const {gl, size, scene, camera} = useThree();

  useEffect(() => void composerRef.current.setSize(size.width, size.height), [size]);

  let shaderTime = 0;
  useFrame(() => {
    shaderTime += 0.1;
    badTVRef.current.uniforms.time.value = shaderTime;
    filmRef.current.uniforms.time.value = shaderTime;
    staticRef.current.uniforms.time.value = shaderTime;
    composerRef.current.render();
  },3);

  return(
    <effectComposer ref={composerRef} args={[gl]}>
      <renderPass attach="passes-0" scene={scene} camera={camera} />
      <shaderPass attach="passes-1" ref={badTVRef} args={[BadTVShader]} />
      <shaderPass attach="passes-2" args={[RGBShiftShader]} />
      <shaderPass attach="passes-3" ref={filmRef} args={[FilmShader]} />
      <shaderPass attach="passes-4" ref={staticRef} args={[StaticShader]} />
      <unrealBloomPass attach="passes-1" args={[undefined, 0.8/2, 1.2, 0.055]} />
    </effectComposer>
  )
}

function Bloom({ children }) {
  const { gl, camera, size } = useThree()
  const [scene, setScene] = useState()
  const composer = useRef()
  useEffect(() => void scene && composer.current.setSize(size.width, size.height), [size])
  useFrame(() => scene && composer.current.render(),1)
  return (
    <>
      <scene ref={setScene}>{children}</scene>
      <effectComposer ref={composer} args={[gl]}>
        <renderPass attach="passes-0" scene={scene} camera={camera} />
        <unrealBloomPass attach="passes-1" args={[undefined, 0.8, 1, 0]} />
      </effectComposer>
    </>
  )
}

function GridPlane(props) {
  const limit = 20
  const division = 50;
  const color =  "#d742f5";
  const material = new ShaderMaterial({
    fragmentShader: gridPlaneFrag,
    vertexShader: gridPlaneVert,
    uniforms: {
      time: { value: 0 },
      limits: { value: new Vector2(-limit, limit) },
      speed: { value: 1 },
    },
    vertexColors: true
  });
  const gridRef = useRef();

  useEffect(() => {
    let moveable = [];
    for (let i = 0; i <= division; i++) {
      moveable.push(1, 1, 0, 0);
    }

    gridRef.current.geometry.setAttribute(
      "moveable",
      new BufferAttribute(new Uint8Array(moveable), 1)
    );
  }, []);

  useFrame((state, delta) => {
    gridRef.current.material.uniforms.time.value += delta;
  });

  return (
    <gridHelper
      position={props.position}
      ref={gridRef}
      args={[limit * 2, division, color, color]}
      material={material}
      material-uniforms-speed-value={1.5}
    />
  );
}

const CactusScene = () => {
  const cactusRef = useRef();

  return(
    <group ref={cactusRef} >
      <GridPlane position={[0,-3.5,0]} />
      <CactusModel scale={1.6} position={[-5.2,-2,0]} rotation={[0,0.5,0]} />
      <CactusModel scale={1.6} position={[-5.2,-2,-8]} rotation={[0,3.0,0]} />
      <CactusModel scale={1.6} position={[5,-2,-5]} rotation={[0,1.8,0]} />
      <CactusModel scale={2.6} position={[-1,-0.9,-5]} rotation={[0,3.5,0]} wireframe={true} color="#00ff22"/>
      <HareModel scale={0.8} position={[0,-3.5,-2]} rotation={[0,-0.7,0]} animation={0}/>
      <HareModel scale={0.8} rotationY={1.5}  position={[-5,-3.5,-5]} animation={0}/>
      <HareModel scale={0.8} rotationY={-0.5}  position={[-3,-3.5,-3]} animation={0} wireframe/>
      <PalmNeonModel scale={0.25} position={[-5,-3.5,-10.5]}/>
      <PalmNeonModel scale={0.25} position={[0,-3.5,-10.5]}/>
      <PalmNeonModel scale={0.25} position={[5,-3.5,-10.5]}/>
      <PalmNeonModel scale={0.25} position={[-2.5,-3.5,-12.5]}/>
      <PalmNeonModel scale={0.25} position={[2.5,-3.5,-12.5]}/>
      <PalmNeonModel scale={0.25} position={[-2.5,-3.5,-12.5]}/>
      <PalmNeonModel scale={0.25} position={[5,-3.5,-3]}/>
    </group>
  )
}

function Main({ children }) {
  const scene = useRef()
  const { gl, camera } = useThree()
  useFrame(() => {
    gl.autoClear = false
    gl.clearDepth()
    gl.render(scene.current, camera)
  }, 3)
  return <scene ref={scene}>{children}</scene>
}

function Typewriter(props) {
  const {text, delay} = props;
  const [currentText, setCurrentText] = useState('');
  const [indexText, setIndexText] = useState(0);

  useEffect(() => {
    if(indexText < text.length) {
      const timeout = setTimeout(() => {
        if(props.isMuted === false) {
          typewriterSFX.play();
        }
        setCurrentText(prevText => prevText + text[indexText]);
        setIndexText(prevIndex => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [indexText, delay, text]);

  useEffect(() => {
    setCurrentText('');
    setIndexText(0);
  }, [text]);

  return <p onClick={props.onClick}>{currentText}</p>
}

function App() {

  const inputsCactus = [
    'El clima de la región es desértico.',
    'Es comun ver cactus, palmas y liebres a las afueras de la ciudad.',
    'Recuerda protegerte del sol.'
  ];

  const inputs = [
    'Santos Laguna es el equipo de la ciudad.',
    'Ha sido campeon 6 veces. La ultima vez en 2018',
    'Su estadio está a 14km de aquí.',
    'COMPRE BENTA DE TSURUS TUNEADOS no es un grupo de autos.'
  ];

  const [index, setIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const onClick = () => {
    setIndex((index) => (index+1)%inputs.length);
  }

  return (
    <div id="canvas-container">
      <div id="tools">
        <button id="btn-sound" onClick={()=>setIsMuted(!isMuted)}>
          <img src={isMuted ? mutePNG : volumePNG}/>
        </button>
        <button id="btn-sound" onClick={()=>setShowModal(true)}>
          i
        </button>
      </div>
      {showModal ?
        <div id="modal">
          <div>
            <span>ARTRC</span>
            <p>
              Las pocas sombras de la ciudad son refugio de fragementos de código
              que cobran vida con impulsos eléctricos que revelan los bytes que
              han sidos afectados de tanta radiación solar, dandoles el aspecto
              de los gráficos de un Play 1 chipiado.<br/>
              La ciudad finalmente se ha entrelezado con lo virtual y el desierto.
            </p>
            <p>
              artrc.mx es un proyecto de realidad aumentada para la ciudad de Torreón
              con la finalidad de mostrar el arte y creatividad de las personas.
            </p>
            <p>
              Creado por Darkensses (Jasiel Guillén).<br/><br/>
              Colaboradores: Ramon Hernandez
            </p>
            <p>
              Social Media:<br/>
              <a href='https://www.instagram.com/darkensses'>instagram.com/darkensses</a>
              <br/>
              <a href='https://github.com/Darkensses'>github.com/Darkensses</a>
            </p>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
        : undefined }

      <Canvas camera={{ fov: 70, position: [0, 0, 5] }}>
        <OrbitControls />
        <ambientLight intensity={5.}/>
        <WE2002Model rotation-y={0.6} />
        <Effects/>
      </Canvas>

      <div id="text-display">
        <Typewriter isMuted={isMuted} onClick={onClick} delay={30} text={`${inputs[index]} [${index+1}/${inputs.length}]`}/>
      </div>


    </div>
  )
}

export default App
