class xxlBoard extends PowerUp {
	constructor(x, y) {
		super(x, y, 'XXL Board');
		this.lifetime = 30;// seconds

		this.activate = () => {
			game.playerBoard.w *= 2;
			game.equippedPowerUp = null;
			setTimeout(() => {
				game.playerBoard.w /= 2;
			}, this.lifetime * 1000)
		}
	}
}
