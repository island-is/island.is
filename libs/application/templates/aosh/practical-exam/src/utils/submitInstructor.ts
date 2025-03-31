import { ApolloClient } from '@apollo/client'
import { Application } from '@island.is/application/types'
import { VALIDATE_INSTRUCTOR_QUERY } from '../graphql/queries'
import {
  PracticalExamInstructor,
  QueryValidateInstructorArgs,
} from '@island.is/api/schema'
import { InstructorInformationInput } from './type'

export const submitInstructor = async (
  apolloClient: ApolloClient<object>,
  application: Application,
  tableItems: Array<InstructorInformationInput>,
) => {
  const index = tableItems.length - 1
  const nationalId = tableItems[index].nationalId.nationalId

  try {
    const { data } = await apolloClient.query<
      { validateInstructor: PracticalExamInstructor },
      QueryValidateInstructorArgs
    >({
      query: VALIDATE_INSTRUCTOR_QUERY,
      variables: {
        input: {
          xCorrelationID: application.id,
          nationalId: nationalId,
        },
      },
    })
    if (
      !Array.isArray(data.validateInstructor.categoriesMayTeach) ||
      data.validateInstructor.categoriesMayTeach.length === 0
    )
      return [
        { path: `instructors[${index}].disabled`, value: 'true' },
        { path: 'instructorsValidityError', value: 'true' },
      ]

    return [{ path: `instructors[${index}].disabled`, value: 'false' }]
  } catch (e) {
    return [{ path: 'instructorsGraphQLError', value: 'true' }]
  }
}
