import gql from 'graphql-tag'

export const GET_DIRECTORATE_OF_IMMIGRATION_WATSON_ASSISTANT_CHAT_IDENTITY_TOKEN = gql`
  query GetDirectorateOfImmigrationWatsonAssistantChatIdentityToken(
    $input: WatsonAssistantChatIdentityTokenInput!
  ) {
    watsonAssistantChatIdentityToken(input: $input) {
      token
    }
  }
`
