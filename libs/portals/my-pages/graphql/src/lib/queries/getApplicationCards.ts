import { gql } from '@apollo/client'

export const APPLICATION_CARDS = gql`
  query ApplicationCards($input: ApplicationCardsInput, $locale: String!) {
    ApplicationCard(input: $input, locale: $locale) {
      id
      created
      modified
      typeId
      status
      name
      progress
      slug
      org
      applicationPath
      orgContentfulId
      nationalId
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
    }
  }
`
