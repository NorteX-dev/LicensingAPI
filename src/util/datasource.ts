import { DataSource } from "typeorm";

export const datasource = new DataSource({
	type: "sqlite",
	database: "database.sqlite",
	entities: ["src/models/**/*.ts"],
	synchronize: true,
	logging: false,
});
