import gql from 'graphql-tag'

export const slices = gql`
  fragment ImageFields on Image {
    __typename
    id
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

  fragment BulletListFields on BulletListSlice {
    __typename
    id
    bullets {
      ... on IconBullet {
        __typename
        id
        title
        body
        url
        linkText
        icon {
          ...ImageFields
        }
      }
      ... on NumberBulletGroup {
        __typename
        id
        defaultVisible
        bullets {
          title
          body
        }
      }
    }
  }

  fragment FaqListFields on FaqList {
    __typename
    id
    title
    questions {
      question
      answer {
        ...HtmlFields
      }
    }
  }

  fragment StatisticsFields on Statistics {
    __typename
    id
    title
    statistics {
      id
      value
      label
    }
  }

  fragment ProcessEntryFields on ProcessEntry {
    id
    title
    subtitle
    details {
      ...HtmlFields
    }
    type
    processTitle
    processDescription
    processInfo {
      ...HtmlFields
    }
    processLink
    buttonText
  }

  fragment HtmlFields on Html {
    __typename
    id
    json
  }

  fragment AllSlices on Slice {
    ...PageHeaderFields
    ...TimelineFields
    ...MailingListSignupFields
    ...StoryFields
    ...LatestNewsFields
    ...LinkCardFields
    ...HeadingFields
    ...LogoListFields
    ...BulletListFields
    ...FaqListFields
    ...StatisticsFields
    ...ProcessEntryFields
    ...HtmlFields
  }
`
