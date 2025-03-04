import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { trees } from './trees.js'; 
import { generationLoop } from './lSystem.js'

let camera, scene, renderer;
let directionalLight;
let ground;
let mouse;
let raycaster;
let container;
let controls;
let model; // modello per un certo tipo di albero 
let isMouseDown = false;
let lastMouseX = 0; // posizione precedente del mouse


function init() { // sezione di set-up di progetto 
  
  container = document.getElementById("scene-container"); 
  
  scene = new THREE.Scene();  
  scene.background = new THREE.Color(0x0096ff);  // Cielo azzurro
  
  mouse = new THREE.Vector2(0, 0);
  raycaster = new THREE.Raycaster();
  
  createCamera();
  createGround();
  createControls();
  createRenderer();  
  createLights();
  
  container.appendChild(renderer.domElement); // aggiungo il canvas al container

  container.addEventListener('mousedown', onMouseDown, false);
  container.addEventListener('mousemove', onMouseMove, false);
  container.addEventListener('mouseup', onMouseUp, false);
  window.addEventListener("resize", onWindowResize);
  window.addEventListener('keydown', onKeyDown);

}

function createCamera() {
  camera = new THREE.PerspectiveCamera(75, container.clientWidth/container.clientHeight, 0.1, 2000); // (FOV, aspect ratio, near and far plane) 
  camera.position.set(0, 100, 200); // Sopraelevata e all'indietro
  scene.add(camera); 
}


function animate() {
  // sezione per l'aggiornamento e l'animazione 
  requestAnimationFrame(animate);  
  controls.update(); 
  render();          
}

function render() {
  // sezione di disegno su canvas  
  renderer.render(scene, camera);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.maxPolarAngle = (Math.PI); // 180 gradi
  controls.enableZoom = true;  
}


function createLights() {
 
  directionalLight = new THREE.DirectionalLight(0xFFD580, 2); //sole

  directionalLight.position.set(-500, 1000, 300); // luce in alto leggermente a sx davanti agli alberi
  directionalLight.castShadow = true;
  directionalLight.lookAt(scene.position);
  // area coperta dalla shadow camera lungo i piani orizzontale e verticale
  directionalLight.shadow.camera.left = -500;
  directionalLight.shadow.camera.right = 500;
  directionalLight.shadow.camera.top = 500;
  directionalLight.shadow.camera.bottom = -500;  
  // distanza in profondità per la shadow camera
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 3000; 
  // risoluzione della texture delle ombre
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add( directionalLight );
    
  const ambientLight = new THREE.AmbientLight(0x88B8E0, 0.4); 
  const hemiLight = new THREE.HemisphereLight(0xB0D0FF, 0xA0C070, 0.6); // luce che simula il cielo e il rimbalzo della luce sul terreno
  scene.add(ambientLight); 
  scene.add(hemiLight);
}

function changeLightPosition(lightPosition) {
 
  switch(lightPosition) {
    case 'sx': {
      directionalLight.position.set( -500, 1000, 300 ); // luce in alto leggermente a sx davanti agli alberi
      break;
    }
    case 'dx': {
      directionalLight.position.set( 500, 1000, 300 ); // luce in alto leggermente a dx davanti agli alberi
      break;
    }
    case 'front': {
      directionalLight.position.set( 0, 1000, -1500 ); // luce davanti all'osservatore
      break;
    }
    case 'behind': {
      directionalLight.position.set( 0, 1000, 1500 ); // luce dietro all'osservatore
      break;
    }
    case 'top': {
      directionalLight.position.set( 0, 1500, 0 ); // luce in alto
      break;
    }
    default: {
      directionalLight.position.set( -500, 1000, 300 ); // Posizione di default (sinistra)
      break;
    }
  }
  directionalLight.lookAt(scene.position);   
}


function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(container.clientWidth, container.clientHeight); 
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

function createGround() {
    
  const grassTexture = new THREE.TextureLoader().load('../images/grass.jpeg');

  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; // how to fill the remaining regions  
  grassTexture.repeat.set (16, 16); // Imposto il numero di ripetizioni della texture

  let groundMaterial = new THREE.MeshPhongMaterial({map:grassTexture}); // Applico la texture come immagine al materiale
  let groundGeometry = new THREE.BoxGeometry(1000, 1000, 5); // definisco la forma del terreno (x,y,z = larghezza, altezza, profondità)
  
  ground = new THREE.Mesh(groundGeometry, groundMaterial); // Combino la geometria e il materiale per creare un oggetto tridimensionale

  ground.position.y = - 50; // Posiziono il terreno sotto il livello "0" dell'asse Y.
  ground.rotation.x = - Math.PI / 2; // Ruoto il terreno di 90° sull'asse X per allinearlo al piano orizzontale.
  ground.receiveShadow = true; // Configuro il terreno per ricevere le ombre proiettate dagli oggetti nella scena.
  ground.doubleSided = true;
  scene.add(ground);
}


function onMouseDown(event) {  
  /* event.client fornisce la posizione del mouse rispetto alla finestra del browser,
  window.innerWidth è la larghezza della finestra. facendo il rapporto ottengo un valore compreso tra 0 e 1.
  poi devo normalizzare le coordinate tra -1 e 1. */

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(ground);
  if (intersects.length > 0) {
    isMouseDown = true; // Imposta lo stato su "trascinamento attivo"
    lastMouseX = event.clientX; // Memorizza la posizione attuale del mouse
  }  
}

function onMouseMove(event) {
  if (isMouseDown) {
    const deltaX = event.clientX - lastMouseX; // Differenza tra la posizione corrente e quella precedente del mouse
    camera.rotation.z -= deltaX * 0.005; // Ruota la camera
    lastMouseX = event.clientX; // Memorizza la posizione attuale del mouse per il prossimo movimento
  }
}

function onMouseUp() {
  isMouseDown = false; // Fine trascinamento
}

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function onKeyDown(event) {

  const moveSpeed = 5; // Velocità dello spostamento
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Blocchiamo il movimento sul piano X-Z
    direction.y = 0;
    direction.normalize();

    // Vettore laterale per movimenti sinistra/destra
    const right = new THREE.Vector3();
    right.crossVectors(camera.up, direction).normalize();

    // Nuova posizione calcolata
    let newPosition = camera.position.clone();
    let newLookAt = controls.target.clone(); // Aggiorniamo il punto di destinazione

    if (event.key === "ArrowUp") {        
      newPosition.addScaledVector(direction, moveSpeed); // Avanza
      newLookAt.addScaledVector(direction, moveSpeed);        
    } else if (event.key === "ArrowDown") {
        newPosition.addScaledVector(direction, -moveSpeed); // Indietreggia
        newLookAt.addScaledVector(direction, -moveSpeed);
    } else if (event.key === "ArrowRight") {
        newPosition.addScaledVector(right, -moveSpeed); // Sposta a destra
        newLookAt.addScaledVector(right, -moveSpeed);
    } else if (event.key === "ArrowLeft") {
        newPosition.addScaledVector(right, moveSpeed); // Sposta a sx
        newLookAt.addScaledVector(right, moveSpeed);
    }
        camera.position.copy(newPosition);
        controls.target.copy(newLookAt);
}



init();
animate();

// cambiamento posizione della luce
document.getElementById("light-position-selector").addEventListener("change", function(event) {
  changeLightPosition(event.target.value);
});


document.getElementById("render-button").addEventListener("click", function() {
  
  const treeTypeIndex = document.getElementById("tree-selector").value;
  const quantity = document.getElementById("quantity-selector").value;
  const iterations = document.getElementById("iterations-range").value;
  
  model = trees[treeTypeIndex];  // Seleziona l'albero 
  model.iterations = iterations;  // Imposta il numero di iterazioni
  //console.log(model);

  // Avvia la generazione degli alberi in posizione casuale
  for(let i=0; i<quantity; i++){
    // La camera è a z=200 quindi gli oggetti per apparire davanti a essa devono avere z<=200.
    let x = Math.random() * 800 - 400;  // Random tra -400 e 400
    let z = Math.random() * 600 - 400;  // Random tra -400 e 200 
    let treeHeight = model.branch_length;  // Altezza del tronco principale
    let y = -50 + treeHeight / 2;  // Posiziona il tronco sopra il terreno
    generationLoop(model, x, y, z, scene);
  }
  
});



  

