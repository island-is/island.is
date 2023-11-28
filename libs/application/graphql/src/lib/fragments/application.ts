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
      }
      history {
        log
        date
      }
      deleteButton
      draftTotalSteps
      draftFinishedSteps
    }
    typeId
    answers
    externalData
    progress
    name
    institution
    status
    form {
      children {
        id
        title
        type
        condition
        isPartOfRepeater
        description
        space
        draftPageNumber
        children {
          id
          title
          type
          condition
          isPartOfRepeater
          description
          space
          draftPageNumber
          dataProviders {
            id
            action
            order
            title
            subTitle
            pageTitle
            source
          }
          children {
            id
            title
            type
            condition
            isPartOfRepeater
            description
            space
            draftPageNumber
            fields {
              id
              title
              type
              component
              disabled
              width
              colSpan
              defaultValue
              doesNotRequireAnswer
              specifics
            }
          }
        }
      }
      icon
      id
      logo
      mode
      renderLastScreenBackButton
      renderLastScreenButton
      title
      type
    }
  }
`
