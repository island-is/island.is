import { Counter } from 'prom-client'
import { ApplicationsModel } from './data'

const applicationsRegistered = new Counter({
  name: 'apps.registered',
  labelNames: ['resource'],
  help: 'Number of applications',
})

export class Applications {
  /**
   * register a new application
   */
  public async register({ ssn }: { ssn: string }) {
    if (ssn && ssn.length === 10) {
      const newApp = await ApplicationsModel.create({ ssn })
      applicationsRegistered.labels('res1').inc()
      return newApp.id
    } else {
      applicationsRegistered
      throw new Error(`SSN missing or invalid length ${ssn}`)
    }
  }
}
