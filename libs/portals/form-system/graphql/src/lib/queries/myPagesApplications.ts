import { gql } from '@apollo/client'

export const FORM_SYSTEM_APPLICATIONS = gql`
  query myPagesApplications($locale: String) {
    formSystemMyPagesApplications(locale: $locale) {
      id
      created
      modified
      applicant
      state
      typeId
      name
      progress
      status
      institution
      formSystemSlug
      actionCard {
        draftTotalSteps
        draftFinishedSteps
        tag {
          label
          variant
        }
        pendingAction {
          title
        }
      }
    }
  }
`
