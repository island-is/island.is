import gql from 'graphql-tag'

export const GET_SITEMAP_LEVEL1_QUERY = gql`
  query GetSitemapLevel1($input: GetSitemapInput!) {
    getSitemap(input: $input) {
      links {
        label
        href
        description
        childLinks {
          label
          href
          description
        }
      }
    }
  }
`

export const GET_SITEMAP_LEVEL2_QUERY = gql`
  query GetSitemapLevel2($input: GetSitemapInput!) {
    getSitemap(input: $input) {
      links {
        label
        href
        description
        childLinks {
          label
          href
          description
          childLinks {
            label
            href
            description
            childLinks {
              label
              href
              description
            }
          }
        }
      }
    }
  }
`
