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
