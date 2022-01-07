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

type ApplicationInfo = Omit<Application, 'externalData' | 'answers'>

const disallowedExistingStates: string[] = [States.PAYMENT, States.DRAFT]

export class ExistingApplicationProvider extends BasicDataProvider {
  type = 'ExistingApplicationProvider'

  async provide(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<ApplicationInfo[] | undefined> {
    const existingApplications = (
      await customTemplateFindQuery({
        applicant: application.applicant,
      })
    )
      .map<ApplicationInfo>(
        ({ externalData, answers, ...partialApplication }) =>
          partialApplication,
      )
      .filter(({ state }) => disallowedExistingStates.includes(state))
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
