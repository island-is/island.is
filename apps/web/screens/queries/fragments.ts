import gql from 'graphql-tag'

export const slices = gql`
  fragment ImageFields on Image {
    __typename
    typename
    id
    title
    url
    contentType
    width
    height
  }

  fragment AssetFields on Asset {
    __typename
    id
    title
    url
    contentType
  }

  fragment TimelineFields on TimelineSlice {
    __typename
    typename
    id
    title
    events {
      id
      title
      date
      numerator
      denominator
      label
      body {
        ...HtmlFields
      }
      tags
      link
    }
  }

  fragment MailingListSignupFields on MailingListSignupSlice {
    __typename
    typename
    id
    title
    description
    inputLabel
    buttonText
  }

  fragment StoryFields on StorySlice {
    __typename
    typename
    id
    readMoreText
    stories {
      title
      intro
      label
      readMoreText
      date
      logo {
        ...ImageFields
      }
      body
    }
  }

  fragment LatestNewsFields on LatestNewsSlice {
    __typename
    typename
    id
    title
    news {
      id
      title
      subtitle
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
    typename
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
    typename
    id
    title
    body
  }

  fragment LogoListFields on LogoListSlice {
    __typename
    typename
    id
    title
    body
    images {
      ...ImageFields
    }
  }

  fragment BulletListFields on BulletListSlice {
    __typename
    typename
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
          id
          title
          body
        }
      }
    }
  }

  fragment FaqListFields on FaqList {
    __typename
    typename
    id
    title
    questions {
      id
      question
      answer {
        ...HtmlFields
      }
    }
  }

  fragment StatisticsFields on Statistics {
    __typename
    typename
    id
    title
    statistics {
      id
      value
      label
    }
  }

  fragment ProcessEntryFields on ProcessEntry {
    __typename
    typename
    id
    type
    processTitle
    processLink
    buttonText
  }

  fragment HtmlFields on Html {
    __typename
    typename
    id
    document
  }

  fragment EmbeddedVideoFields on EmbeddedVideo {
    __typename
    typename
    id
    title
    url
  }

  fragment SectionWithImageFields on SectionWithImage {
    __typename
    typename
    id
    title
    image {
      ...ImageFields
    }
    html {
      ...HtmlFields
    }
  }

  fragment TabSectionFields on TabSection {
    __typename
    typename
    id
    title
    tabs {
      tabTitle
      contentTitle
      image {
        ...ImageFields
      }
      body {
        ...HtmlFields
      }
    }
  }

  fragment TeamListFields on TeamList {
    __typename
    typename
    id
    teamMembers {
      name
      title
      image {
        ...ImageFields
      }
    }
  }

  fragment AllSlices on Slice {
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
    ...ImageFields
    ...AssetFields
    ...EmbeddedVideoFields
    ...SectionWithImageFields
    ...TabSectionFields
    ...TeamListFields
  }
`
