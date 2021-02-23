import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    isApplicant
    assignees
    isAssignee
    state
    typeId
    name
    progress
  }
`
