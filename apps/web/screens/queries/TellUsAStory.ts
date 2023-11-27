import gql from 'graphql-tag'

export const TELL_US_A_STORY_MUTATION = gql`
  mutation TellUsAStory($input: TellUsAStoryInput!) {
    tellUsAStory(input: $input) {
      sent
    }
  }
`
