import gql from 'graphql-tag'

export const GET_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN = gql`
  query GetWatsonAssistantChatIdentityToken(
    $input: WatsonAssistantChatIdentityTokenInput!
  ) {
    watsonAssistantChatIdentityToken(input: $input) {
      token
    }
  }
`

export const SUBMIT_WATSON_ASSISTANT_CHAT_FEEDBACK = gql`
  mutation SubmitWatsonAssistantChatFeedback(
    $input: WatsonAssistantChatSubmitFeedbackInput!
  ) {
    watsonAssistantChatSubmitFeedback(input: $input) {
      success
    }
  }
`
