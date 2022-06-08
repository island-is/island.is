import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  CustomTemplateFindQuery,
  StaticText,
} from '@island.is/application/core'
import { States } from '../lib/constants'
import { m } from '../lib/messages'

type ApplicationInfo = Omit<Application, 'externalData'>

export class ExistingApplicationProvider extends BasicDataProvider {
  type = 'ExistingApplicationProvider'

  async provide(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<ApplicationInfo[] | undefined> {
    // Returns only an application with the same active announcment
    const existingApplications = (
      await customTemplateFindQuery({
        applicant: application.applicant,
      })
    )
      .map<ApplicationInfo>(
        ({ externalData, ...partialApplication }) => partialApplication,
      )
      // The casenumber is mapped to answers on application entry in the initial state (see service.syslumennOnEntry)
      // It is therefore the case that a correctly formed application will have the casenumber
      // in the answers. A malformed application will not be considered.

      // The prerequisites states are not listed and will be pruned anyways
      .filter(
        ({ id, state, answers }) =>
          id !== application.id &&
          state !== States.PREREQUISITES &&
          answers?.caseNumber === application.answers?.caseNumber,
      )
      .sort(({ created: a }, { created: b }) => b.getTime() - a.getTime())

    return existingApplications
  }

  onProvideSuccess(
    application: Application[] | undefined,
  ): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: application,
      status: 'success',
    }
  }

  onProvideError(error?: { reason?: StaticText }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: error?.reason ?? m.errorDataProvider,
      status: 'failure',
    }
  }
}
