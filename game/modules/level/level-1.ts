import { viewport } from "../global";
import { Brick } from "../classes/Brick";
import { BrickArea } from "../classes/BrickArea";
import { StatsUI } from "../classes/StatsUI";

export const level_1 = () => {
	StatsUI.instance.level = 1;

	let rowCount = 0, offsetX = 0;
	let center = blocksPerRow => {
		return ((blocksPerRow * 60) - viewport.w) / 2 * -1;
	}

	const createRow = blocksPerRow => {
		for (var i = 0; i < blocksPerRow; i++) {
			offsetX = (i * 60) + center(blocksPerRow);
			new Brick(offsetX, BrickArea.instance.y + (rowCount * 43));
		}
		rowCount++;
	}

	createRow(17);
	createRow(10);
	createRow(15);
	createRow(2);
	createRow(11);
	createRow(4);
	createRow(6);
}
