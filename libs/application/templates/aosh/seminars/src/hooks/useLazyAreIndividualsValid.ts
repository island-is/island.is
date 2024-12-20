import { gql } from '@apollo/client'
import { ARE_INDIVIDUALS_VALID } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { IndividualDTO } from '@island.is/clients/seminars-ver'

export const useLazyAreIndividualsValid = () => {
  return useLazyQuery<
    {
      areIndividualsValid: IndividualDTO[]
    },
    {
      nationalIds: Array<string>
      courseID: number
    }
  >(
    gql`
      ${ARE_INDIVIDUALS_VALID}
    `,
  )
}
