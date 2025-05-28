import { ApolloClient } from '@apollo/client'
import { Application } from '@island.is/application/types'
import { EXAMINEE_ELIGIBILITY_QUERY } from '../graphql/queries'
import {
  ExamineeEligibility,
  QueryGetExamineeEligibilityArgs,
} from '@island.is/api/schema'
import { ExamineeInput, PathAndValue } from './types'

export const submitExaminees = async (
  apolloClient: ApolloClient<object>,
  application: Application,
  tableItems: Array<ExamineeInput>,
) => {
  const nationalIdList: string[] = tableItems.flatMap(
    (item) => item.nationalId?.nationalId ?? [],
  )
  const pathItems: PathAndValue[] = []

  try {
    const { data } = await apolloClient.query<
      { getExamineeEligibility: ExamineeEligibility[] },
      QueryGetExamineeEligibilityArgs
    >({
      query: EXAMINEE_ELIGIBILITY_QUERY,
      variables: {
        input: {
          xCorrelationID: application.id,
          nationalIds: nationalIdList,
        },
      },
    })

    if (
      !Array.isArray(data.getExamineeEligibility) ||
      data.getExamineeEligibility.length === 0
    ) {
      return [{ path: 'examineesValidityError', value: 'true' }]
    }

    data.getExamineeEligibility.forEach((examinee, index) => {
      if (examinee.isEligible) {
        pathItems.push({ path: `examinees[${index}].disabled`, value: 'false' })
      } else {
        pathItems.push({ path: `examinees[${index}].disabled`, value: 'true' })
      }
    })
  } catch (e) {
    return [{ path: 'examineesGraphQLError', value: 'true' }]
  }
  return pathItems
}
