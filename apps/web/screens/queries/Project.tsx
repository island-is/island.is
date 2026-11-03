import gql from 'graphql-tag'

import { nestedFields, nestedOneColumnTextFields, slices } from './fragments'

export const GET_PROJECT_PAGE_QUERY = gql`
  query GetProjectPage($input: GetProjectPageInput!) {
    getProjectPage(input: $input) {
      id
      title
      slug
      theme
      sidebar
      featuredDescription
      contentIsFullWidth
      namespace {
        fields
      }
      sidebarLinks {
        primaryLink {
          text
          url
        }
        childrenLinks {
          text
          url
        }
      }
      secondarySidebar {
        name
        childrenLinks {
          text
          url
        }
      }
      sidebarCards {
        ...SidebarCardFields
      }
      footerConfig
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
      backLink {
        text
        url
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
      subtitle
      intro
      content {
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
            ...HtmlFields
          }
          config
        }
        config
      }
      slices {
        ...AllSlices
        ${nestedFields}
      }
      bottomSlices {
        ...AllSlices
        ${nestedFields}
      }
      newsTag {
        id
        title
        slug
      }
      secondaryNewsTags {
        id
        title
        slug
      }
      # Only what's needed to find the organization of the project's events.
      # The ids are left out so that this doesn't overwrite a full subpage in the Apollo cache.
      projectSubpages {
        slices {
          ... on LatestEventsSlice {
            organizationSlug
          }
        }
        bottomSlices {
          ... on LatestEventsSlice {
            organizationSlug
          }
        }
      }
      featuredImage {
        url
        contentType
        width
        height
      }
      defaultHeaderImage {
        url
        contentType
        width
        height
      }
      defaultHeaderBackgroundColor
      themeProperties {
        gradientStartColor
        gradientEndColor
        useGradientColor
        backgroundColor
        textColor
        fullWidth
        imagePadding
        imageIsFullHeight
        imageObjectFit
        imageObjectPosition
        titleSectionPaddingLeft
        mobileBackgroundColor
      }
    }
  }
  ${slices}
`

export const GET_PROJECT_SUBPAGE_QUERY = gql`
  query GetProjectSubpage($input: GetProjectSubpageInput!) {
    getProjectSubpage(input: $input) {
      id
      title
      slug
      content {
        ...AllSlices
        ${nestedFields}
      }
      renderSlicesAsTabs
      slices {
        ...AllSlices
        ...NestedOneColumnTextFields
        ${nestedFields}
      }
      showTableOfContents
      contentLastReviewed
      showDateOfTheMostRecentReview
      bottomSlices {
        ...AllSlices
        ...NestedOneColumnTextFields
        ${nestedFields}
      }
    }
  }
  ${slices}
  ${nestedOneColumnTextFields}
`
