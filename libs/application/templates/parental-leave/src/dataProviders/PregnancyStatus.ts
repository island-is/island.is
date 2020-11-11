import { BasicDataProvider, Application } from '@island.is/application/core'

export class PregnancyStatus extends BasicDataProvider {
  provide(application: Application): Promise<unknown> {
    // TODO mock this in future PR
    throw new Error('Method not implemented.')
  }
}
