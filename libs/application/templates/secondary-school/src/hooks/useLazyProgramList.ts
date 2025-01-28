import { gql } from '@apollo/client'
import { SecondarySchoolProgram } from '@island.is/api/schema'
import { PROGRAMS_BY_SCHOOLS_ID_QUERY } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyProgramList = () => {
  return useLazyQuery<
    {
      secondarySchoolProgramsBySchoolId: SecondarySchoolProgram[]
    },
    {
      schoolId: string
      isFreshman: boolean
    }
  >(
    gql`
      ${PROGRAMS_BY_SCHOOLS_ID_QUERY}
    `,
  )
}
