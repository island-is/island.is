import gql from 'graphql-tag'

import { htmlFields, slices } from './fragments'

export const GET_SERVICE_WEB_PAGE_QUERY = gql`
  query GetServiceWebPage($input: GetServiceWebPageInput!) {
    getServiceWebPage(input: $input) {
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
      slices {
        ...AllSlices
      }
      contactFormDisclaimer {
        ...HtmlFields
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
  }
  ${slices}
`

export const GET_SUPPORT_QNAS = gql`
  query GetSupportQNAs($input: GetSupportQNAsInput!) {
    getSupportQNAs(input: $input) {
      id
      title
      answer {
        ...AllSlices
      }
      slug
      organization {
        id
        title
        slug
      }
      category {
        title
        description
        slug
      }
      subCategory {
        title
        description
        slug
      }
    }
  }
  ${slices}
`

export const GET_SUPPORT_QNAS_IN_CATEGORY = gql`
  query GetSupportQNAsInCategory($input: GetSupportQNAsInCategoryInput!) {
    getSupportQNAsInCategory(input: $input) {
      id
      title
      slug
      importance
      subCategory {
        title
        description
        slug
        importance
      }
      category {
        title
        description
        slug
      }
    }
  }
`

export const GET_SINGLE_SUPPORT_QNA = gql`
  query GetSingleSupportQNA($input: GetSingleSupportQNAInput!) {
    getSingleSupportQNA(input: $input) {
      id
      title
      slug
      importance
      subCategory {
        title
        description
        slug
        importance
      }
      category {
        title
        description
        slug
      }
      answer {
        ...AllSlices
      }
      relatedLinks {
        url
        text
      }
      contactLink
    }
  }
  ${slices}
`

export const GET_FEATURED_SUPPORT_QNAS = gql`
  query GetFeaturedSupportQNAs($input: GetFeaturedSupportQNAsInput!) {
    getFeaturedSupportQNAs(input: $input) {
      id
      title
      slug
      category {
        slug
      }
    }
  }
`

export const GET_SUPPORT_CATEGORY = gql`
  query GET_SUPPORT_CATEGORY($input: GetSupportCategoryInput!) {
    getSupportCategory(input: $input) {
      id
      title
      description
    }
  }
`

export const GET_SUPPORT_CATEGORIES = gql`
  query GET_SUPPORT_CATEGORIES($input: GetSupportCategoriesInput!) {
    getSupportCategories(input: $input) {
      title
      description
      slug
      organization {
        slug
        namespace {
          fields
        }
      }
      importance
    }
  }
`

export const GET_SUPPORT_CATEGORIES_IN_ORGANIZATION = gql`
  query GET_SUPPORT_CATEGORIES_IN_ORGANIZATION(
    $input: GetSupportCategoriesInOrganizationInput!
  ) {
    getSupportCategoriesInOrganization(input: $input) {
      id
      title
      description
      slug
      organization {
        slug
      }
      importance
    }
  }
`

export const GET_SUPPORT_SEARCH_RESULTS_QUERY = gql`
  query GetSupportSearchResults($query: SearcherInput!) {
    searchResults(query: $query) {
      total
      items {
        ... on SupportQNA {
          id
          title
          slug
          category {
            title
            slug
          }
          organization {
            slug
            title
            logo {
              url
            }
          }
        }
      }
      tagCounts {
        key
        value
        count
      }
    }
  }
`

export const GET_SERVICE_WEB_ORGANIZATION = gql`
  ${htmlFields}
  query GetServiceWebOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      id
      title
      shortTitle
      slug
      link
      trackingDomain
      logo {
        url
        width
        height
      }
      footerConfig
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
      phone
      email
      serviceWebTitle
      serviceWebEnabled
      serviceWebPopularQuestionCount
      namespace {
        fields
      }
      serviceWebFeaturedImage {
        url
        title
        width
        height
        contentType
        id
      }
    }
  }
`
