import gql from 'graphql-tag'

export const GET_WEB_CHAT = gql`
  query GetWebChat($input: GetWebChatInput!) {
    getWebChat(input: $input) {
      webChatConfiguration
    }
  }
`
