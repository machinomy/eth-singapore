import { MigrationInterface, QueryRunner } from 'typeorm'

export class BotRecord1544284208221 implements MigrationInterface {
  public async up (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE "bot_record" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "tweetId" varchar NOT NULL, "sourceAccount" varchar NOT NULL, "destinationAccount" varchar NOT NULL, "sourceAddress" varchar NOT NULL, "destinationAddress" varchar NOT NULL, "amount" varchar NOT NULL, "status" varchar NOT NULL)`)
  }

  public async down (queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "bot_record"`)
  }
}
