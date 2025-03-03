# L-System-Tree-Simulator
A JavaScript-based simulation of tree and plant growth using L-systems.

3D real time rendering of a garden, where put trees and plants. It is based on Lindenmayer System, that consists of an alphabet simbols with some production rules. The algorithm starts with an axiom (an initial string) and expands it iteratively by applying the rules a defined number of times. The resulting string is then interpreted geometrically to generate branches and plant structures, following a fractal-like growth pattern.

The project was written in Javascript with Three.js framework, which is based on WebGL API.
To start the project in a local environment use Node.js which also allows you to manage dependencies via npm (Node Package Manager).
From the project folder the npm run start command starts the tree and plant growth simulator. 

In this demo, you can:

- Select the tree type.
- Select the number of trees to display.
- Select the number of iterations; each iteration generates a more complex version of the plant, with branching, leaves and other natural features. 
- Select the position of the light source in the scene that determines the position of the plants' shadow.
- Render with the button.

<img src="https://github.com/user-attachments/assets/f565cd4b-a9d7-4403-a89b-5520a87f7e8e" height="250" >

<img src="https://github.com/user-attachments/assets/659ae429-accf-49a5-af5a-ae1ff05328b0" height="250" >

<img src="https://github.com/user-attachments/assets/3ecf20f5-eddc-4e23-9454-a8214e9fa579" height="250" >



