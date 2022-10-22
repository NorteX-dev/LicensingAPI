import { Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";
import { genId } from "../util/genId";
import { genLicenseKey } from "../util/genLicenseKey";

@Table
export default class License extends Model<License> {
	@Default(() => genId())
	@PrimaryKey
	@Column(DataType.STRING)
	public id!: number;

	@Column(DataType.STRING)
	public label!: string;

	@Default(() => genLicenseKey())
	@Column(DataType.STRING)
	public key!: string;

	@Column(DataType.DATE)
	public exp?: Date;

	get sanitised() {
		return {
			id: this.id,
			label: this.label,
		};
	}

	get valid() {
		if (this.exp) return this.exp.getTime() > Date.now();
		else return true;
	}
}
