import gql from 'graphql-tag'

export const GET_PAGE_QUERY = gql`
  fragment ImageFields on Image {
    title
    url
    contentType
    width
    height
  }

  fragment PageHeaderFields on PageHeaderSlice {
    __typename
    id
    title
    introduction
    navigationText
    links {
      text
      url
    }
    slices {
      ...TimelineFields
    }
  }

  fragment TimelineFields on TimelineSlice {
    __typename
    id
    title
    events {
      id
      title
      date
      numerator
      denominator
      label
      body
      tags
      link
    }
  }

  fragment MailingListSignupFields on MailingListSignupSlice {
    __typename
    id
    title
    description
    inputLabel
    buttonText
  }

  fragment StoryFields on StorySlice {
    __typename
    id
    readMoreText
    stories {
      title
      intro
      label
      logo {
        ...ImageFields
      }
      body
    }
  }

  fragment LatestNewsFields on LatestNewsSlice {
    __typename
    id
    title
    news {
      title
      slug
      date
      intro
      content
      image {
        ...ImageFields
      }
    }
  }

  fragment LinkCardFields on LinkCardSlice {
    __typename
    id
    title
    cards {
      title
      body
      link
      linkText
    }
  }

  fragment HeadingFields on HeadingSlice {
    __typename
    id
    title
    body
  }

  fragment LogoListFields on LogoListSlice {
    __typename
    id
    title
    body
    images {
      ...ImageFields
    }
  }

  query($input: GetPageInput!) {
    getPage(input: $input) {
      title
      slug
      seoDescription
      theme
      slices {
        ...PageHeaderFields
        ...TimelineFields
        ...MailingListSignupFields
        ...StoryFields
        ...LatestNewsFields
        ...LinkCardFields
        ...HeadingFields
        ...LogoListFields
      }
    }
  }
`
