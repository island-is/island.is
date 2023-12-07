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
      projectSubpages {
        id
        title
        slug
        content {
          ...AllSlices
        }
        renderSlicesAsTabs
        slices {
          ...AllSlices
          ...NestedOneColumnTextFields
          ${nestedFields}
        }
        showTableOfContents
        bottomSlices {
          ...AllSlices
          ...NestedOneColumnTextFields
          ${nestedFields}
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
      }
    }
  }
  ${slices}
  ${nestedOneColumnTextFields}
`
