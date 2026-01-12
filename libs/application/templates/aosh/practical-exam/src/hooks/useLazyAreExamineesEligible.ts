import { EXAMINEE_ELIGIBILITY_QUERY } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'
import { ExamineeEligibility } from '@island.is/api/schema'

export const useLazyAreExamineesEligible = () => {
  return useLazyQuery<
    {
      getExamineeEligibility: ExamineeEligibility[]
    },
    {
      input: {
        xCorrelationID: string
        nationalIds: Array<string>
      }
    }
  >(EXAMINEE_ELIGIBILITY_QUERY)
}
