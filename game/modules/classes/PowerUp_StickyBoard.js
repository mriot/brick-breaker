class StickyBoard extends PowerUp {
	constructor(x, y) {
		super(x, y, 'Sticky Board');
		this.lifetime = 30;

		this.activate = () => {
			game.playerBoard.sticky = true;
			game.equippedPowerUp = null;
			setTimeout(() => {
				game.playerBoard.sticky = false;
			}, this.lifetime * 1000)
		}
	}
}
