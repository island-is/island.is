import gql from 'graphql-tag'

import { nestedFields, slices } from './fragments'

export const GET_SINGLE_MANUAL_QUERY = gql`
  fragment HtmlFields on Html {
    __typename
    id
    document
  }
  fragment AssetFields on Asset {
    __typename
    id
    title
    url
    contentType
  }
  fragment ImageFields on Image {
    __typename
    id
    title
    url
    contentType
    width
    height
  }
  query GetSingleManual($input: GetSingleManualInput!) {
    getSingleManual(input: $input) {
      id
      title
      slug
      info {
        ...AllSlices
        ${nestedFields}
      }
      description {
        ...AllSlices
        ${nestedFields}
      }
      organization {
        id
        title
        shortTitle
        slug
        link
        hasALandingPage
        trackingDomain
        footerConfig
        logo {
          url
          width
          height
        }
        footerItems {
          title
          content {
            ...HtmlFields
          }
          link {
            text
            url
          }
        }
      }
      chapters {
        id
        title
        slug
        changelog {
          items {
            dateOfChange
            textualDescription
          }
        }
        description {
          ...AllSlices
          ${nestedFields}
        }
        chapterItems {
          id
          title
          content {
            ...HtmlFields
            ...AssetFields
            ...ImageFields
          }
          link {
            url
            text
          }
        }
      }
    }
  }
  ${slices}
`
