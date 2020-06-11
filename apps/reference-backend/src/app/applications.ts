import { Counter } from 'prom-client'
import { ApplicationModel } from './data'
import { logger } from '@island.is/logging'

const applicationsRegistered = new Counter({
  name: 'apps_registered',
  labelNames: ['resource'],
  help: 'Number of applications',
})

export class Applications {
  /**
   * register a new application
   */
  public async register({ ssn }: { ssn: string }) {
    if (ssn && ssn.length === 10) {
      logger.debug(`SSN looks valid`)
      const newApp = await ApplicationModel.create({ ssn })
      applicationsRegistered.labels('res1').inc()
      return newApp.id
    } else {
      logger.error(`SSN too short`)
      throw new Error(`SSN missing or invalid length ${ssn}`)
    }
  }

  public async getBySsn({ ssn }: { ssn: string }) {
    return await ApplicationModel.findOne({ where: { ssn } })
  }
}
