import { gql } from '@apollo/client'
import { UniversityGatewayUniversity } from '@island.is/api/schema'
import { GET_UNIVERSITY_GATEWAY_UNIVERSITIES } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyUniversityQuery = () => {
  return useLazyQuery<{
    universityGatewayUniversities: Array<UniversityGatewayUniversity>
  }>(
    gql`
      ${GET_UNIVERSITY_GATEWAY_UNIVERSITIES}
    `,
  )
}
