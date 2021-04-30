import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  Application,
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
    customTemplateFindQuery: any,
  ): Promise<ChildrenAndExistingApplications> {
    // Applications where this parent is applicant
    const applicationsWhereApplicant = (
      await customTemplateFindQuery({
        applicant: application.applicant,
      })
    ).filter(({ state }: Application) => state !== 'prerequisites')

    // Applications where this parent is other parent
    const applicationsWhereOtherParentHasApplied = await customTemplateFindQuery(
      {
        'answers.otherParentId': application.applicant,
      },
    ).filter(
      ({ state }: Application) =>
        state !== 'prerequisites' && state !== 'draft',
    )

    // Pregnancy status
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

    const result = getChildrenAndExistingApplications(
      applicationsWhereApplicant,
      applicationsWhereOtherParentHasApplied,
      pregnancyStatusQueryResponse,
    )

    console.log(JSON.stringify(result, null, '  '))

    return result
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
