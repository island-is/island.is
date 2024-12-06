import { gql } from '@apollo/client'
import { SecondarySchoolProgram } from '@island.is/api/schema'
import { GET_PROGRAMS_BY_SCHOOL_ID } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyProgramList = () => {
  return useLazyQuery<
    {
      secondarySchoolProgramsBySchoolId: SecondarySchoolProgram[]
    },
    {
      schoolId: string
    }
  >(
    gql`
      ${GET_PROGRAMS_BY_SCHOOL_ID}
    `,
  )
}
