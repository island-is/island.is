import { ARE_INDIVIDUALS_VALID_QUERY } from '../graphql/queries'
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
  >(ARE_INDIVIDUALS_VALID_QUERY)
}
