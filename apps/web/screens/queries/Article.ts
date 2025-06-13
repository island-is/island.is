import gql from 'graphql-tag'

import { nestedFields, slices } from './fragments'

export const GET_ARTICLE_QUERY = gql`
  query GetSingleArticle($input: GetSingleArticleInput!) {
    getSingleArticle(input: $input) {
      id
      slug
      title
      shortTitle
      intro
      keywords
      importance
      showTableOfContents
      processEntryButtonText
      signLanguageVideo {
        url
        thumbnailImageUrl
      }
      alertBanner {
        showAlertBanner
        bannerVariant
        title
        description
        linkTitle
        link {
          slug
          type
        }
        isDismissable
        dismissedForDays
      }
      body {
        ...AllSlices
        ${nestedFields}
      }
      stepper {
        id
        title
        steps {
          id
          title
          slug
          stepType
          subtitle {
            ...AllSlices
          }
          config
        }
        config
      }
      processEntry {
        ...ProcessEntryFields
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
        canPagesBeFoundInSearchResults
        namespace {
          fields
        }
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
          serviceWebContent {
            ...HtmlFields
          }
          link {
            text
            url
          }
        }
      }
      relatedOrganization {
        title
        slug
        link
        hasALandingPage
        logo {
          url
          width
          height
        }
      }
      responsibleParty {
        title
        slug
        link
        logo {
          url
          width
          height
        }
      }
      group {
        title
        slug
        description
      }
      category {
        id
        title
        slug
        description
      }
      relatedArticles {
        title
        slug
      }
      relatedContent {
        text
        url
      }
      subArticles {
        id
        title
        slug
        signLanguageVideo {
          url
          thumbnailImageUrl
        }
        body {
          ...AllSlices
          ${nestedFields}
        }
        showTableOfContents
        stepper {
          id
          title
          steps {
            id
            title
            slug
            stepType
            subtitle {
              ...AllSlices
            }
            config
          }
          config
        }
      }
      featuredImage {
        url
        title
        width
        height
      }
    }
  }
  ${slices}
`

export const GET_CONTENT_SLUG = gql`
  query GetContentSlug($input: GetContentSlugInput!) {
    getContentSlug(input: $input) {
      id
      activeTranslations
      title {
        en
        is
      }
      slug {
        en
        is
      }
      url {
        en
        is
      }
      type
    }
  }
`
