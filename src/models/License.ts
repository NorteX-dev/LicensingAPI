import { BeforeInsert, Column, Entity } from "typeorm";

import { genId } from "../util/genId";
import { genLicenseKey } from "../util/genLicenseKey";
import { WithId } from "./WithId";

@Entity({ name: "licenses" })
export default class License extends WithId {
	@Column({ type: "text" })
	label!: string;

	@Column({ type: "text" })
	key!: string;

	@Column({ type: "boolean", default: false })
	revoked!: boolean;

	@Column({ type: "timestamp", nullable: true })
	exp?: Date;

	@BeforeInsert()
	assignId() {
		this.id = genId();
		this.key = genLicenseKey();
	}

	get sanitised() {
		return {
			id: this.id,
			label: this.label,
			expires: this.exp,
			status: this.unexpired ? "valid" : "invalid",
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
		};
	}

	get unexpired() {
		if (this.exp) return this.exp.getTime() > Date.now();
		else return true;
	}
}
