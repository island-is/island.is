import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignees
    applicantActors
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
        button
        hideButton
      }
      history {
        log
        date
      }
      deleteButton
      draftTotalSteps
      draftFinishedSteps
      historyButton
    }
    typeId
    answers
    externalData
    progress
    name
    institution
    status
    pruned
  }
`
