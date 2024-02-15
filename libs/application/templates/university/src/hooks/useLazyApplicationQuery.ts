import { gql } from '@apollo/client'
import { UniversityGatewayApplication } from '@island.is/api/schema'
import { GET_UNIVERSITY_APPLICATION_BY_ID } from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyApplicationQuery = () => {
  return useLazyQuery<
    {
      universityApplication: UniversityGatewayApplication
    },
    {
      id: string
    }
  >(
    gql`
      ${GET_UNIVERSITY_APPLICATION_BY_ID}
    `,
  )
}
