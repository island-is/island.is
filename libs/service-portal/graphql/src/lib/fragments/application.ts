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
      pendingAction {
        displayStatus
        content
        title
      }
      history {
        log
        date
      }
      deleteButton
    }
    typeId
    name
    progress
    status
  }
`
