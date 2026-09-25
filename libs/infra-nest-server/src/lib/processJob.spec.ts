import { processJob } from './processJob'

describe('job entrypoints', () => {
  const argv = process.argv
  afterEach(() => {
    process.argv = argv
  })

  it.each(['server', 'worker', 'cleanup', 'metrics', 'external-metrics'])(
    'accepts %s',
    (job) => {
      process.argv = ['node', 'main.cjs', `--job=${job}`]
      expect(processJob()).toBe(job)
    },
  )
  it('preserves the default server invocation', () => {
    process.argv = ['node', 'main.cjs']
    expect(processJob()).toBeUndefined()
  })
})
