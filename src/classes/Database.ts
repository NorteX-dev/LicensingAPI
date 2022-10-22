import { Sequelize } from "sequelize-typescript";
import License from "../models/License";

export class Database {
	sequelize: any;

	constructor() {
		this.sequelize = new Sequelize({
			dialect: "sqlite",
			storage: "database.sqlite",
			logging: console.log,
			models: [License],
		});
	}

	sync() {
		return this.sequelize.sync({ alter: true });
	}
}
