/**
 * Controller principal du casse-tête
 *
 * @class      MainController (name)
 */
class MainController {

	/**
	 * Constructeur de la classe.
	 *
	 * @param      {number}  size    Taille de la grille: nombre total de cases = size ** 2
	 */
	constructor(size) {
		this.gridSize = size;
		this.x = 0;
		this.y = 0;
		this.cases = [];
	}

	/**
	 * Initialisation du casse-tête.
	 */
	init() {
		let grille = document.getElementById("grille-cases");
		for (let i=0; i<this.gridSize**2; i++) {
			let caseJeu = document.createElement('div', { is: 'case-jeu' });
			caseJeu.x = i % this.gridSize;
			caseJeu.y = Math.floor(i / this.gridSize);
			this.cases.push(caseJeu);
			grille.appendChild(caseJeu);
			

			// La première case créée (en haut à gauche du plateau) constitue le point de départ
			if (i == 0) {
				caseJeu.setStatus(CaseJeu.POSITION);
			}


			// Mise à jour du statut de chacune des cases
			this.updateGridStatus(caseJeu);
		}
		
	}

	/**
	 * Mise à jour du statut de chacune des cases en fonction de la position actuelle
	 */
	updateGridStatus(caseJeu) {

		if((caseJeu.classList.contains("position") && !caseJeu.classList.contains("atteignable")) && !(this.x == 0 && this.y == 0)) { // on met en interdit l'ancienne position du cavalier
			caseJeu.setStatus(CaseJeu.INTERDIT);

		// on met en atteignable les cases non interdites accessibles par le cavalier
		} else if(((caseJeu.x == this.x+2 && caseJeu.y == this.y+1) || (caseJeu.x == this.x+1 && caseJeu.y == this.y+2) || (caseJeu.x == this.x-2 && caseJeu.y == this.y-1) || (caseJeu.x == this.x-1 && caseJeu.y == this.y-2) || (caseJeu.x == this.x+2 && caseJeu.y == this.y-1) || (caseJeu.x == this.x+1 && caseJeu.y == this.y-2) || (caseJeu.x == this.x-2 && caseJeu.y == this.y+1) || (caseJeu.x == this.x-1 && caseJeu.y == this.y+2)) && !caseJeu.classList.contains("interdit")) {
			caseJeu.setStatus(CaseJeu.ATTEIGNABLE);
			caseJeu.onclick = () => { // ajout du click sur la case pour pouvoir déplacer le cavalier
				this.updatePosition(caseJeu);
			}

		} else if(!(caseJeu.classList.contains("interdit"))) { // si la case est la nouvelle position ou une ancienne case atteignable
			caseJeu.setStatus(CaseJeu.RESET); // on enlève le rôle d'atteignable
		}

	}







	// fonction pour mettre à jour la position du cavalier
	updatePosition(caseJeu) {

		// mise à jour des coordonnées du cavalier
		this.x = caseJeu.x;
		this.y = caseJeu.y;
		caseJeu.setStatus(CaseJeu.POSITION);

		this.cases.forEach(el => { // mise à jour du plateau case par case
			this.updateGridStatus(el);
		});

		this.checkWinLose(); // on vérifie l'état de la partie après la dernière action du joueur

	}






	
	// fonction qui vérifie si l'utilisateur gagne ou perd
	checkWinLose() {
		let atteignable_counter = 0; // compteur des cases atteignables par le joueur
		let interdit_counter = 0; // compteur des cases déjà traversées par le joueur

		this.cases.forEach(el => { // mise à jour des compteurs
			if(el.classList.contains("atteignable")) {
				atteignable_counter++;
			}
			if(el.classList.contains("interdit")) {
				interdit_counter++;
			}
		});
		let grid_remove = 1;
		if(this.gridSize%2 == 0) {
			grid_remove = 2;
		}
		if(interdit_counter == (this.gridSize ** 2) - grid_remove) { // si le joueur a traversé toutes les cases, il gagne
			alert("you win");
		} else if(atteignable_counter == 0) { // s'il ne peut plus bouger, il perd
			alert("you lost");
		}
	}
}