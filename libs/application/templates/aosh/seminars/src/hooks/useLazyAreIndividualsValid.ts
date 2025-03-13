import { gql } from '@apollo/client'
import { ARE_INDIVIDUALS_VALID } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { IndividualDTO } from '@island.is/clients/seminars-ver'
import { SeminarIndividual } from '@island.is/api/schema'

export const useLazyAreIndividualsValid = () => {
  return useLazyQuery<
    {
      areIndividualsValid: IndividualDTO[]
    },
    {
      input: { individuals: Array<SeminarIndividual> }
      courseID: string
      nationalIdOfRegisterer: string
    }
  >(
    gql`
      ${ARE_INDIVIDUALS_VALID}
    `,
  )
}
