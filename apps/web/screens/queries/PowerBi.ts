import gql from 'graphql-tag'

export const POWERBI_EMBED_TOKEN_QUERY = gql`
  query PowerBiEmbedToken($input: PowerBiEmbedTokenInput!) {
    powerbiEmbedToken(input: $input) {
      token
      embedUrl
    }
  }
`
