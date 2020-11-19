import { gql } from '@apollo/client'
import { ApplicationFragment } from '../fragments/application'

export const APPLICANT_APPLICATIONS = gql`
  query GetApplicantApplications($typeId: ApplicationResponseDtoTypeIdEnum) {
    getApplicationsByApplicant(typeId: $typeId) {
      ...Application
    }
  }
  ${ApplicationFragment}
`
