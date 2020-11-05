import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const ASSIGNEE_APPLICATIONS = gql`
  query GetAssigneeApplications($typeId: ApplicationResponseDtoTypeIdEnum) {
    getApplicationsByAssignee(typeId: $typeId) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
