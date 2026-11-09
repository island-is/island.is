// Runs a spec ahead of UTC, where a local midnight is the previous day in
// UTC. Iceland is UTC+0 all year, which hides that shift.
//
// A spec can't set TZ itself: its process.env is a copy. The environment
// runs in the worker's own process, so set TZ here and put it back after,
// before the worker moves on to another spec.
const { TestEnvironment } = require('jest-environment-node')

class AheadOfUtcEnvironment extends TestEnvironment {
  async setup() {
    this.originalTZ = process.env.TZ
    process.env.TZ = 'Europe/Berlin'
    await super.setup()
  }

  async teardown() {
    if (this.originalTZ === undefined) {
      delete process.env.TZ
    } else {
      process.env.TZ = this.originalTZ
    }
    await super.teardown()
  }
}

module.exports = AheadOfUtcEnvironment
