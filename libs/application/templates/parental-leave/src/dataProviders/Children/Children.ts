import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
  CustomTemplateFindQuery,
} from '@island.is/application/core'

import { ChildInformation, ChildrenAndExistingApplications } from './types'
import { getChildrenAndExistingApplications } from './Children-utils'

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
    // Applications where this parent is applicant
    const applicationsWhereApplicant = (
      await customTemplateFindQuery({
        applicant: application.applicant,
      })
    ).filter(({ state }) => state !== 'prerequisites')

    // Applications where this parent is other parent
    const applicationsWhereOtherParentHasApplied = (
      await customTemplateFindQuery({
        'answers.otherParentId': application.applicant,
      })
    ).filter(({ state }) => state !== 'prerequisites' && state !== 'draft')

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
