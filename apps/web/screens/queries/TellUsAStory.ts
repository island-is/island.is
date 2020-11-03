import gql from 'graphql-tag'

export const TELL_US_A_STORY_MUTATION = gql`
  mutation TellUsAStory($input: TellUsAStoryInput!) {
    tellUsAStory(input: $input) {
      sent
    }
  }
`
export const GET_TELL_US_A_STORY_DATA = gql`
  fragment HtmlFields on Html {
    __typename
    id
    document
  }

  query GetTellUsAStory($input: GetTellUsAStoryInput!) {
    getTellUsAStory(input: $input) {
      typename
      id
      introTitle
      introImage {
        title
        url
      }
      introDescription {
        ...HtmlFields
      }
      instructionsTitle
      instructionsDescription {
        ...HtmlFields
      }
      firstSectionTitle
      organizationLabel
      organizationPlaceholder
      organizationInputErrorMessage
      dateOfStoryLabel
      dateOfStoryPlaceholder
      dateOfStoryInputErrorMessage
      secondSectionTitle
      subjectLabel
      subjectPlaceholder
      subjectInputErrorMessage
      messageLabel
      messagePlaceholder
      messageInputErrorMessage
      thirdSectionTitle
      instructionsImage {
        title
        url
      }
      nameLabel
      namePlaceholder
      nameInputErrorMessage
      emailLabel
      emailPlaceholder
      emailInputErrorMessage
      publicationAllowedLabel
      submitButtonTitle
      errorMessageTitle
      SuccessMessageTitle
      successMessage {
        ...HtmlFields
      }
      errorMessage {
        ...HtmlFields
      }
    }
  }
`
