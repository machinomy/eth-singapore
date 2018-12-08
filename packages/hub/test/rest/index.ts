import Logger from '@machinomy/logger'
import { NewmanRunSummary } from 'newman'
// tslint:disable-next-line:no-duplicate-imports
import * as newman from 'newman'

const log = new Logger('newman')

newman.run({
  // tslint:disable-next-line:no-require-imports
  collection: require('./REST.postman_collection.json'),
  reporters: 'cli'
}, (err: Error | null, summary: NewmanRunSummary) => {
  if (err) { throw err }
  log.info('collection run complete!')
})
