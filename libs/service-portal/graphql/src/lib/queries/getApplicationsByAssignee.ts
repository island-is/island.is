import { gql } from '@apollo/client'

import { ApplicationFragment } from '../fragments/application'

export const GET_APPLICATIONS_BY_ASSIGNEE = gql`
  query GetApplicationsByAssignee($typeId: ApplicationResponseDtoTypeIdEnum) {
    getApplicationsByAssignee(typeId: $typeId) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
