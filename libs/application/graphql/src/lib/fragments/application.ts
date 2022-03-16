import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignees
    state
    actionCard {
      title
      description
      tag {
        label
        variant
      }
      cta {
        delete
      }
    }
    typeId
    answers
    externalData
    progress
    name
    institution
    status
  }
`
