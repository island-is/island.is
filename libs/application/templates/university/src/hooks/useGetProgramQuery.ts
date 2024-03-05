import { gql } from '@apollo/client'
import { UniversityGatewayProgramDetails } from '@island.is/api/schema'
import { GET_UNIVERSITY_GATEWAY_PROGRAM } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useGetProgramQuery = () => {
  return useLazyQuery<
    {
      program: UniversityGatewayProgramDetails
    },
    {
      input: {
        id: string
      }
    }
  >(
    gql`
      ${GET_UNIVERSITY_GATEWAY_PROGRAM}
    `,
  )
}
