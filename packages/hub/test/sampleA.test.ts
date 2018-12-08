import Logger from '@machinomy/logger'
import Options from '../src/config/Options'
import { Registry } from '../src/Registry'

const log = new Logger('sampleA-test')

describe('Main', () => {
  beforeAll(() => {
    log.info('before all')
  })

  afterAll(() => {
    log.info('after each')
  })

  beforeEach(() => {
    log.info('before each')
  })

  afterEach(() => {
    log.info('after each')
  })

  test('basic', () => {
    const registry = new Registry({} as Options)
    expect(registry.methodA()).toBe('I am methodA')
  })
})
