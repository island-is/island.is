import gql from 'graphql-tag'
import {
  nestedAccordionAndFaqListFields,
  nestedOneColumnTextFields,
  slices,
} from './fragments'

export const GET_PROJECT_PAGE_QUERY = gql`
  query GetProjectPage($input: GetProjectPageInput!) {
    getProjectPage(input: $input) {
      id
      title
      slug
      theme
      sidebar
      featuredDescription
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
      subtitle
      intro
      content {
        ...AllSlices
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
        ${nestedAccordionAndFaqListFields}
      }
      bottomSlices {
        ...AllSlices
        ${nestedAccordionAndFaqListFields}
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
          ${nestedAccordionAndFaqListFields}
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
    }
  }
  ${slices}
  ${nestedOneColumnTextFields}
`
