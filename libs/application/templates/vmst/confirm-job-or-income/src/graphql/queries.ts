import { gql } from '@apollo/client'

export const VALIDATE_PART_TIME_JOBS_QUERY = gql`
  query VmstApplicationsValidatePartTimeJobs(
    $input: [PartTimeJobValidationInput!]!
  ) {
    vmstApplicationsValidatePartTimeJobs(input: $input) {
      isValid
      title
      message
      invalidValidationIds
    }
  }
`
