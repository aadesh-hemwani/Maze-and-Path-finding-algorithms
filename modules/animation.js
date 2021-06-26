import { wall, path, explore, visited } from "./colors.js";

export const wallAnimation = [
	{
		transform: "scale(0)",
		backgroundColor: "rgb(200,200,200)",
	},
	{
		transform: "scale(1.3)",
		backgroundColor: "rgb(120, 120, 120)",
	},
	{
		transform: "scale(1.0)",
		backgroundColor: `${wall}`,
	},
];

export const exploreAnimation = [
	{
		transform: "scale(0.1)",
		backgroundColor: "rgba(0, 0, 66, 0.75)",
		borderRadius: "100%",
	},
	{
		backgroundColor: "rgba(64, 88, 230,.75)",
	},
	{
		transform: "scale(1.2)",
		backgroundColor: "rgba(0, 217, 159, 0.75)",
	},
	{
		transform: "scale(1.0)",
		backgroundColor: `${explore}`,
	},
];

export const visitedAnimation = [
	{
		backgroundColor: `${explore}`,
		transform: "scale(1.3)",
	},
	{
		backgroundColor: `${visited}`,
		transform: "scale(1)",
	},
];

export const pathAnimation = [
	{
		backgroundColor: `${explore}`,
		transform: "scale(1.2)",
	},
	{
		backgroundColor: `${path}`,
	},
];
