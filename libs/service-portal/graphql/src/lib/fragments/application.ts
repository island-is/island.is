import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignees
    state
    stateMetaData {
      title
      description
      tag {
        label
        variant
      }
    }
    typeId
    name
    progress
    status
  }
`
