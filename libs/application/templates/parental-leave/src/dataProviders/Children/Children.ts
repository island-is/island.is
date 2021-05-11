import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  CustomTemplateFindQuery,
  getValueViaPath,
} from '@island.is/application/core'

import { ChildInformation, ChildrenAndExistingApplications } from './types'
import {
  getChildrenAndExistingApplications,
  getChildrenFromMockData,
} from './Children-utils'
import { NO, States, YES } from '../../constants'

const pregnancyStatusQuery = `
  query ParentalLeavePregnancyStatusQuery {
    getParentalLeavePregnancyStatus {
      hasActivePregnancy
      expectedDateOfBirth
    }
  }
`

export class Children extends BasicDataProvider {
  type = 'Children'
  async provide(
    application: Application,
    customTemplateFindQuery: CustomTemplateFindQuery,
  ): Promise<ChildrenAndExistingApplications> {
    const useMockData =
      getValueViaPath(application.answers, 'useMockData', NO) === YES

    if (useMockData) {
      return getChildrenFromMockData(application)
    }

    // Applications where this parent is applicant
    const applicationsWhereApplicant = (
      await customTemplateFindQuery({
        applicant: application.applicant,
      })
    ).filter(({ state }) => state !== States.PREREQUISITES)

    // Applications where this parent is other parent
    const applicationsWhereOtherParentHasApplied = (
      await customTemplateFindQuery({
        'answers.otherParentId': application.applicant,
      })
    ).filter(
      ({ state }) => state !== States.PREREQUISITES && state !== States.DRAFT,
    )

    const pregnancyStatusQueryResponse = await this.useGraphqlGateway(
      pregnancyStatusQuery,
    )
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data.getParentalLeavePregnancyStatus)
      })
      .catch((error) => {
        return this.handleError(error)
      })

    return getChildrenAndExistingApplications(
      applicationsWhereApplicant,
      applicationsWhereOtherParentHasApplied,
      pregnancyStatusQueryResponse,
    )
  }

  handleError(error: Error | unknown) {
    console.error('Provider.ParentalLeave.Children:', error)
    return Promise.reject('Failed to fetch children')
  }

  onProvideSuccess(children: ChildInformation[]): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: children,
      status: 'success',
    }
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      data: {},
      reason: 'Failed',
      status: 'failure',
    }
  }
}
