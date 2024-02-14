import { gql } from '@apollo/client'
import { UniversityGatewayUniversity } from '@island.is/api/schema'
import {
  GET_INNA_PERIONDS,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../graphql/queries'
import { useLazyQuery } from './useLazyQuery'

export const useLazyInnaQuery = () => {
  return useLazyQuery<{
    data: any
  }>(
    gql`
      ${GET_INNA_PERIONDS}
    `,
  )
}
