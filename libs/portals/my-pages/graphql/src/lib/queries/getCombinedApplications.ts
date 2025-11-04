import { gql } from '@apollo/client'

export const COMBINED_APPLICATIONS = gql`
  query CombinedApplications(
    $input: ApplicationApplicationsInput
    $locale: String!
  ) {
    myPagesApplications(input: $input, locale: $locale) {
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
      formSystemFormSlug
      formSystemOrgContentfulId
      formSystemOrgSlug
      path
      localhostPath
      slug
    }
  }
`
