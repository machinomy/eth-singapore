import { MigrationInterface, QueryRunner } from 'typeorm'

export class recordTable1544273924600 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "record" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "account" varchar NOT NULL, "address" varchar NOT NULL, "signature" varchar NOT NULL)`)
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "record"`)
  }
}
