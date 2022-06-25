/**
 * Case du plateau de jeu
 *
 * @class      CaseJeu (name)
 */
class CaseJeu extends HTMLDivElement {

	// Définition des constantes statiques de la classe
	static get POSITION() { return 1; }
	static get INTERDIT() { return -1; }
	static get ATTEIGNABLE() { return 2; }

	// Constructeur
	constructor() {
		super();
		this.classList.add("case");
	}

	setStatus(status) {
		switch(status) {
			case CaseJeu.POSITION: // définir une case en tant que position
				this.classList.add("position");
				break;
			case CaseJeu.INTERDIT: // définir une case en tant qu'interdit
				this.classList.add("interdit");
				this.classList.remove("position"); // on retire son ancien rôle en tant que position du cavalier
				break;
			case CaseJeu.ATTEIGNABLE: // définir une case en tant qu'atteignable par le cavalier
				this.classList.add("atteignable");
				break;

			case CaseJeu.RESET:
				this.classList.remove("atteignable");
				this.onclick = "";
				break;
			default:
				console.error("Echec de l'initialisation du statut. Statut inconnu : '" + status + "'");
		}
	}
}
customElements.define('case-jeu', CaseJeu, { extends: 'div' });