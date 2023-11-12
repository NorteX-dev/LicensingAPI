import { BaseEntity, BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from "typeorm";

import { genId } from "../util/genId";

export abstract class WithId extends BaseEntity {
	@PrimaryColumn({ type: "varchar", length: 12 })
	id!: string;

	@BeforeInsert()
	assignId() {
		this.id = genId();
	}

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
