import gql from 'graphql-tag'

import {
  assetFields,
  htmlFields,
  imageFields,
  nestedFields,
  slices,
} from './fragments'

export const GET_SINGLE_MANUAL_QUERY = gql`
  ${htmlFields}
  ${assetFields}
  ${imageFields}
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
        intro
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
        }
      }
    }
  }
  ${slices}
`
