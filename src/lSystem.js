import * as THREE from 'three';

// questo file contiene la logica di calcolo per generare gli alberi tramite L-system

// funzione che data la produzione corrente restituisce la successiva secondo le regole di produzione (rewriting rules)
function nextIteration(currentIteration, model) {
    let nextIteration = '';
    for (let i=0; i<currentIteration.length; i++) {
        let c = currentIteration[i]; // per ogni carattere
        let rulesIdx = 0;
        let ruleFound = false;
        while (rulesIdx < model.rules.length && !ruleFound) { // possono esserci più di una regola 
            if (model.rules[rulesIdx].predecessor == c) { // Se c'è corrispondenza tra il carattere e una regola
                nextIteration += getStochasticRule(model.rules[rulesIdx]);
                ruleFound = true;
            }
            rulesIdx++;
        }
        if (!ruleFound) {
            nextIteration += c;
        }
    }

    return nextIteration;
}

// creo la struttura finale. per ogni iterazione applico "nextIteration"
export function generationLoop(model, x, y, z, scene) {
    var currentIteration = model.axiom;
    for (let i=0; i<model.iterations; i++) {
        currentIteration = nextIteration(currentIteration, model);
    }
    drawTree(model, currentIteration, x, y, z, scene); // x, y e z forniscono la posizione dell'albero
} 
 

// Calcola una probabilità casuale di scegliere una determinata regola per il successore
function getStochasticRule(rule) {
    let random = Math.random(); // Calcola una probabilità casuale tra 0 e 1
    let cumulativeProb = 0;
    for (let i=0; i<rule.successor.length; i++) {
        cumulativeProb += rule.successor[i].prob;
        if (random < cumulativeProb) {
            return rule.successor[i].value; 
        }
    }
}

const petalGeometry = new THREE.SphereGeometry(0.3, 16, 16); // geometria dei petali
const centerGeometry = new THREE.SphereGeometry(0.2, 12, 12); // Centro del fiore
// materiali 
const petalMaterial = new THREE.MeshPhongMaterial({ color: 0xFF1493 }); // fucsia
const centerMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 }); // giallo

function createFlower() {

    const flowerGroup = new THREE.Group();

    // Petali
    for (let i = 0; i < 5; i++) {
        const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
        petalMesh.position.set(Math.cos((i / 5) * Math.PI * 2) * 0.6, 2.2, Math.sin((i / 5) * Math.PI * 2) * 0.6);
        petalMesh.rotation.x = -Math.PI / 2;
        petalMesh.scale.set(1, 2, 0.5);
        flowerGroup.add(petalMesh);
    }

    const centerMesh = new THREE.Mesh(centerGeometry, centerMaterial);
    centerMesh.position.y = 2.2;
    centerMesh.scale.set(2, 2, 2);
    
    flowerGroup.add(centerMesh);

    return flowerGroup;
}

    
function createLeaf() {
    /* Passaggi: Definire i vertici della foglia: array di punti per rappresentare la forma. Definire gli indici per i triangoli:
    Collego i vertici con facce triangolari. Aggiungo l'Illuminazione: calcolo le normali per ottenere effetti di luce realistici.
    Applico una texture. */

    const leafGeometry = new THREE.BufferGeometry();

    // Vertici 
    const vertices = new Float32Array([
        0, 1, 0,    // Punta superiore
        -0.5, 0.8, 0,   // sx curva alta
        -0.7, 0.6, 0,   // sx medio-alta
        -0.8, 0.3, 0,   // sx bassa
        -0.6, -0.2, 0,  // sx inferiore
        0, -0.8, 0,     // Base
        0.6, -0.2, 0,   // dx inferiore
        0.8, 0.3, 0,    // dx bassa
        0.7, 0.6, 0,    // dx medio-alta
        0.5, 0.8, 0,    // dx curva alta
    ]);

    // indici per costruire i triangoli
    const indices = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 5,
        0, 5, 6,
        0, 6, 7,
        0, 7, 8,
        0, 8, 9,
        1, 2, 9,
        2, 3, 9,
        3, 4, 9,
        4, 5, 9,
        5, 6, 9,
        6, 7, 9,
        7, 8, 9,
        8, 1, 9
    ];

    // coordinate UV per la texture (per passare da 2D a 3D)
    const uvCoordinate = new Float32Array([
        0.5, 1,   // Punta superiore
        0.2, 0.9, // Curva sinistra alta
        0.1, 0.8, // Curva sinistra media
        0, 0.6,   // Curva sinistra bassa
        0.2, 0.3, // Curva sinistra inferiore
        0.5, 0,   // Base
        0.8, 0.3, // Curva destra inferiore
        1, 0.6,   // Curva destra bassa
        0.9, 0.8, // Curva destra media
        0.8, 0.9  // Curva destra alta
    ]);

    // Definiamo le normali per l'illuminazione 
    const normals = new Float32Array(vertices.length);
    for (let i = 0; i < normals.length; i += 3) {
        normals[i] = 0;
        normals[i + 1] = 0;
        normals[i + 2] = 1;
    }

    // Assegniamo i dati alla geometria
    leafGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    leafGeometry.setAttribute('uv', new THREE.BufferAttribute(uvCoordinate, 2));
    leafGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
    leafGeometry.setIndex(indices);

    return leafGeometry;
}


function createApple() {

    const appleGroup = new THREE.Group();
    const appleTexture = new THREE.TextureLoader().load('../images/apple.jpg');       
    const appleMaterial = new THREE.MeshPhongMaterial({
        map: appleTexture,
        transparent: false, 
        side: THREE.DoubleSide
    });
    
    // Corpo della mela
    const appleGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const appleMesh = new THREE.Mesh(appleGeometry, appleMaterial);

    // Leggera deformazione per renderla più naturale
    appleMesh.scale.set(2.5, 2, 2.5);
    appleMesh.castShadow = true
    appleMesh.receiveShadow = true
    
    // Picciolo della mela
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8);
    const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    const stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
    stemMesh.scale.set(1.5, 1.5, 1.5); 
    stemMesh.position.set(0, 1.8, 0);
    
    appleGroup.add(appleMesh);
    appleGroup.add(stemMesh);

    return appleGroup;
}


// traduco le regole in geometrie 3D
function drawTree(model, currentIteration, x, y, z, scene) {    

    // Negli L-System è importante tenere a mente lo stato del modello. creo una pila per gestire gli stati intermedi e operazioni di push/pop
    var state_stack = [{
        position: new THREE.Vector3(x, y, z), // posizione dell'albero
        branch_radius: model.branch_radius, // raggio del tronco, che man mano diventa più piccolo
        direction: 
        {
            X: new THREE.Vector3(1,0,0),
            Y: new THREE.Vector3(0,1,0),
            Z: new THREE.Vector3(0,0,1)
        } 
    }]

    // Crea il materiale della corteccia
    const barkTexture = new THREE.TextureLoader().load(model.bark_texture);
    const branchMaterial = new THREE.MeshPhongMaterial({ map: barkTexture }); 

    // foglie
    const leafTexture = new THREE.TextureLoader().load(model.leaf_texture);       
    const leafMaterial = new THREE.MeshPhongMaterial({ // MeshPhongMaterial è più leggero computazionalmente, per avere maggior realismo meglio MeshStandardMaterial
        map: leafTexture,
        transparent: false,
        side: THREE.DoubleSide
    });
    const leafGeometry = createLeaf();
    const leaf_model = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf_model.castShadow = true
    leaf_model.receiveShadow = true
    leaf_model.scale.set(3, 3, 3); // Ingrandisce la foglia 3 volte

    
    // Per ogni carattere della stringa generata
    for (let i = 0; i < currentIteration.length; i++) {
        let c = currentIteration[i];
        switch(c) {
            case 'F': { // genera una sezione del tronco rappresentata come un cilindro
                
                var currentState = state_stack[state_stack.length - 1]; // Stato attuale
                
                // Crea la geometria del cilindro (raggio superiore e inferiore)                
                var geometry = new THREE.CylinderGeometry( Math.max(.1, currentState.branch_radius-model.branch_radius_reduction), 
                Math.max(.1,currentState.branch_radius), model.branch_length, 16, 10);

                // creo un nuovo vettore basato sulla direzione attuale del ramo. il nuovo vettore ha la stessa direzione, ma una lunghezza ridotta del 5%.
                var new_direction = (new THREE.Vector3().copy(currentState.direction.Y).multiplyScalar(model.branch_length*0.95));
               
                geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, model.branch_length/2, 0));
                geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(Math.PI / 2));

                const branch = new THREE.Mesh(geometry, branchMaterial);
                branch.castShadow = true; // proietta l'ombra
                branch.receiveShadow = true;

                // ruota il ramo, allineandolo all'asse del sistema di riferimento attuale
                branch.lookAt(new THREE.Vector3(new_direction.x, new_direction.y, new_direction.z)); 
                branch.position.set(currentState.position.x, currentState.position.y, currentState.position.z)

                // riduco il raggio del tronco
                currentState.branch_radius *= (1 - model.branch_radius_reduction / currentState.branch_radius);

                // evito che il raggio del tronco diventi troppo piccolo, evito artefatti nel rendering
                currentState.branch_radius = Math.max(0.3, currentState.branch_radius); 

                currentState.position.add(new_direction);
                scene.add(branch);
                break;
            }

            case 'l': { // Aggiungo una foglia
                var currentState = state_stack[state_stack.length - 1]; // Stato attuale
            
                const leaf = leaf_model.clone();
                
                // Genera un offset casuale attorno al ramo per evitare sovrapposizioni
                const randomAngle = Math.random() * Math.PI * 2;
                const offsetDistance = currentState.branch_radius * (1.2 + Math.random() * 0.5); // Sposta leggermente fuori dal ramo
            
                // Calcola una posizione casuale attorno al ramo nel sistema di riferimento locale
                const offsetX = Math.cos(randomAngle) * offsetDistance;
                const offsetZ = Math.sin(randomAngle) * offsetDistance;
            
                // Sposta la foglia lontano dal centro del ramo
                const leafPosition = new THREE.Vector3()
                    .copy(currentState.position)
                    .addScaledVector(currentState.direction.X, offsetX)
                    .addScaledVector(currentState.direction.Z, offsetZ)
                    .addScaledVector(currentState.direction.Y, currentState.branch_radius * 0.5); 
            
                leaf.position.set(leafPosition.x, leafPosition.y, leafPosition.z);
            
                // Random rotation per variare l'orientamento
                leaf.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
            
                scene.add(leaf);
                break;
            }
           
            case 'a': { // mele

                var currentState = state_stack[state_stack.length - 1]; 
            
                const apple = createApple();
            
                // Genera un offset casuale intorno al ramo
                const randomAngle = Math.random() * Math.PI * 2;
                const randomOffset = currentState.branch_radius * (0.8 + Math.random() * 0.4); // Tra 80% e 120% del raggio del ramo
            
                // Calcola una posizione casuale attorno al ramo nel sistema di riferimento locale
                const offsetX = Math.cos(randomAngle) * randomOffset;
                const offsetZ = Math.sin(randomAngle) * randomOffset;
            
                // Sposta la mela attorno al ramo usando il sistema di riferimento locale
                const applePosition = new THREE.Vector3()
                    .copy(currentState.position)
                    .addScaledVector(currentState.direction.X, offsetX)
                    .addScaledVector(currentState.direction.Z, offsetZ);
            
                apple.position.set(applePosition.x, applePosition.y, applePosition.z);
                // Rotazione casuale per un effetto più naturale
                apple.rotation.set(
                    Math.random() * 2 * Math.PI,
                    Math.random() * 2 * Math.PI,
                    Math.random() * 2 * Math.PI
                );
            
                scene.add(apple);             
                break;
            }
            case 'o': { // fiori (stesso procedimento delle mele)
                var currentState = state_stack[state_stack.length - 1]; 

                const flower = createFlower();
            
                const randomAngle = Math.random() * Math.PI * 2;
                const randomOffset = currentState.branch_radius * (0.8 + Math.random() * 0.4);             
                // Calcola una posizione casuale attorno al ramo
                const offsetX = Math.cos(randomAngle) * randomOffset;
                const offsetZ = Math.sin(randomAngle) * randomOffset;            
                const flowerPosition = new THREE.Vector3()
                    .copy(currentState.position)
                    .addScaledVector(currentState.direction.X, offsetX)
                    .addScaledVector(currentState.direction.Z, offsetZ);            
                flower.position.set(flowerPosition.x, flowerPosition.y, flowerPosition.z);
                // Rotazione casuale per un effetto più naturale
                flower.rotation.set(
                    Math.random() * 2 * Math.PI,
                    Math.random() * 2 * Math.PI,
                    Math.random() * 2 * Math.PI
                );
            
                scene.add(flower); 
                break;
                
            }
            
            case '[': {
                // Salva lo stato corrente (posizione, raggio e direzione)
                var currentState = state_stack[state_stack.length - 1];
                state_stack.push({
                    position: currentState.position.clone(),
                    branch_radius: currentState.branch_radius,
                    direction: {
                        X: currentState.direction.X.clone(),
                        Y: currentState.direction.Y.clone(),
                        Z: currentState.direction.Z.clone()
                    }
                });
                break;
            }
            case ']': {
                // Ripristina lo stato precedente
                state_stack.pop();
                break;
            }
            case '+': { // Rotazione in senso orario attorno all'asse Z
                var currentState = state_stack[state_stack.length - 1];               
                currentState.direction.X.applyAxisAngle(currentState.direction.Z, model.angle);
                currentState.direction.Y.applyAxisAngle(currentState.direction.Z, model.angle);
                break;
            }
            case '-': { // Rotazione in senso antiorario attorno all'asse Z
                var currentState = state_stack[state_stack.length - 1]; 
                currentState.direction.X.applyAxisAngle(currentState.direction.Z, -model.angle);
                currentState.direction.Y.applyAxisAngle(currentState.direction.Z, -model.angle);
                break;
            }
            case '&': { // Rotazione a dx attorno all'asse X
                var currentState = state_stack[state_stack.length - 1];
                currentState.direction.Y.applyAxisAngle(currentState.direction.X, model.angle);
                currentState.direction.Z.applyAxisAngle(currentState.direction.X, model.angle);
                break;
            }
            case '^': { // Rotazione a sx attorno all'asse X
                var currentState = state_stack[state_stack.length - 1];
                currentState.direction.Y.applyAxisAngle(currentState.direction.X, -model.angle);
                currentState.direction.Z.applyAxisAngle(currentState.direction.X, -model.angle);
                break;
            }
            case '<': { // Rotazione a dx attorno all'asse Y
                var currentState = state_stack[state_stack.length - 1];
                currentState.direction.X.applyAxisAngle(currentState.direction.Y, model.angle);
                currentState.direction.Z.applyAxisAngle(currentState.direction.Y, model.angle);
                break;
            }
            case '>': { // Rotazione a sx attorno all'asse Y
                var currentState = state_stack[state_stack.length - 1];
                currentState.direction.X.applyAxisAngle(currentState.direction.Y, -model.angle);
                currentState.direction.Z.applyAxisAngle(currentState.direction.Y, -model.angle);
                break;
            }
            
        }
    }
}