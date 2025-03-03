/*  Array contenente una serie di oggetti "albero" di vario tipo. Ogni albero viene generato a partire da un assioma e da precise
regole di produzione. ognuno ha determinate proprietà e caratteristiche */

function toRadians(angle) {
    return (angle * Math.PI) / 180;
}

export const trees = [

	{
        name: "Plant",
        axiom: 'F', 
        rules: [
            {
                predecessor: 'F', 
                successor: [
                    { value: 'F[<Fl>]F[>Fl<]', prob: 0.5 }, 
                    { value: 'F^l[-Fl]&[+Fl]', prob: 0.5 }
                ],
            }
        ],
        iterations: 3,		
        branch_length: 8,
        branch_radius: 1.5,
        branch_radius_reduction: 0.08,
        angle: toRadians(30),
        bark_texture: '../images/bark2.jpg',
		leaf_texture: '../images/leaf.jpg'
    },

	{
		name: "Autumn tree", // Albero autunnale
		axiom: 'F', // stato iniziale del sistema
		rules: [
			{
				predecessor: 'F', 
				successor: [
					{ value: 'F^[-Fl+Fll]&[+Fl-Fll]', prob: 0.4 }, 
					{ value: 'F&[+Fl]ll^[-Fll]', prob: 0.3 },
					{ value: 'F^[-Fl]lFl&[+Fll]', prob: 0.3 },					
				],
			}
		],
		iterations: 4,		
		branch_length: 12, // lunghezza dei rami
		branch_radius: 2.6, // raggio iniziale del tronco
		branch_radius_reduction: 0.12, // riduzione del raggio dei rami ad ogni iterazione
		angle: toRadians(22), // angolo di inclinazione dei rami
		bark_texture: '../images/bark3.jpg',
		leaf_texture: '../images/leaf_autumn.jpg'
	},

	{
		name: "Birch", // betulla
		axiom: 'X',
		rules: [
			{
				predecessor: 'F',
				successor: [
					{ value: 'FF', prob: 1.0 }
				]
			},
			{
				predecessor: 'X',
				successor: [
					{value: 'F+[^Xll][[+Xll]--Xll][^Xl[&Xll]][<<Xl[&Xll]]', prob: 0.9 },  
					{ value: 'F[+Xl]F[-Xl]', prob: 0.1 }
				]
			}
		],
		iterations: 4,
		branch_length: 5.5,
		branch_radius: 5, 
		branch_radius_reduction: 0.08,
		angle: toRadians(50), 
		bark_texture: '../images/birch.jpg',
		leaf_texture: '../images/leaf.jpg'
	},
	
	{
		name: "Bush", // Cespuglio
		axiom: 'FF', 
        rules: [
            {
                predecessor: 'F', 
                successor: [
                    { value: 'F[+Fll][-Fllo]', prob: 0.6 },
                    { value: 'F&ll[<Fl]F[>Flo]', prob: 0.4 }
                ],
            }
        ],
        iterations: 2,		
        branch_length: 4.5,
        branch_radius: 0.5,
        branch_radius_reduction: 0.15,
        angle: toRadians(45),
		bark_texture: '../images/bark1.jpg',
		leaf_texture: '../images/bush.jpg'
	},

	{
		name: "Baobab", //Albero alto simmetrico con chioma
		axiom: 'X',
		rules: [
			{
				predecessor: 'F',
				successor: [
					{ value: 'FF', prob: 1.0 }
				]
			},
			{
				predecessor: 'X',
				successor: [
					{ value: 'F[+X][-X][&X][^X][<X][>Xl][X]', prob: 0.8 },
					{ value: 'F[<<X][>>Xl][X][^Xl][&X]', prob: 0.2 }  
				]
			}
		],
		iterations: 4,
		branch_length: 7,
		branch_radius: 6, 
		branch_radius_reduction: 0.10,
		angle: toRadians(48), 
		bark_texture: '../images/bark1.jpg',
		leaf_texture: '../images/leaf.jpg'
	},

	{
		name: "Apple tree", // Melo
		axiom: 'FFFA', 
		rules: [
			{
				predecessor: 'A', 
				successor: [
					{ value: 'F[^Al][&Al][+Al][-Alla][<Al][>Ala]', prob: .4 }, 
					{ value: 'F[^Al][&Al][<Alla][>Alla]', prob: .4 },
					{ value: '[<Al][>Al]lla', prob: .2 },
				],
			}
		],
		iterations: 4,		
		branch_length: 14, 
		branch_radius: 2.8, 
		branch_radius_reduction: 0.15, 
		angle: toRadians(46), 
		bark_texture: '../images/bark2.jpg',
		leaf_texture: '../images/leaf.jpg'
	},

	{
		name: "Flowering tree", // Albero floreale
		axiom: 'FFA', 
		rules: [
			{
				predecessor: 'A', 
				successor: [
					{ value: 'F[^^Allo]Ao[++Alolo]<<Allo', prob: .5 }, 
					{ value: 'F[&&All]Ao[--Alolo]>>Allo', prob: .3 },
					{ value: 'AloAl', prob: .2 },
				],
			}
		],
		iterations: 4,		
		branch_length: 8, 
		branch_radius: 2.6, 
		branch_radius_reduction: 0.15, 
		angle: toRadians(25), 
		bark_texture: '../images/bark2.jpg',  
		leaf_texture: '../images/leaf.jpg'
	},

];


