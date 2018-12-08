import { memoize } from 'decko'
import { Connection, createConnection } from 'typeorm'
import { BotRecord } from './entity/BotRecord'

export class DBManager {
  private static i: DBManager

  private constructor () {}

  static instance () {
    if (!DBManager.i) {
      DBManager.i = new DBManager()
    }
    return DBManager.i
  }

  @memoize
  async dbConnection (): Promise<Connection> {
    return createConnection({
      type: 'sqlite',
      synchronize: true,
      database: 'db.sqlite3',
      entities: [ BotRecord ]
    })
  }
}
