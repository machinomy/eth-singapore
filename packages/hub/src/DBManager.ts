import { memoize } from 'decko'
import { Connection, createConnection } from 'typeorm'
import { Record } from './entity/Record'

export class DBManager {
  private static i: DBManager

  private constructor() {}

  static instance() {
    if (!DBManager.i) {
      DBManager.i = new DBManager()
    }
    return DBManager.i
  }

  @memoize
  async dbConnection (): Promise<Connection> {
    return await createConnection({
      type: "sqlite",
      synchronize: true,
      database: "db.sqlite3",
      entities: [Record]
    })
  }
}
