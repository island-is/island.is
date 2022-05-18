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

  fragment AssetFields on Asset {
    __typename
    id
    title
    url
    contentType
  }

  fragment TimelineFields on TimelineSlice {
    __typename
    id
    title
    intro
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
    id
    title
    variant
    description
    inputLabel
    fullNameLabel
    questionLabel
    yesLabel
    noLabel
    disclaimerLabel
    buttonText
    signupUrl
  }

  fragment StoryFields on StorySlice {
    __typename
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
      linkedPage
      link
    }
  }

  fragment LatestNewsFields on LatestNewsSlice {
    __typename
    id
    title
    tag
    news {
      id
      title
      subtitle
      slug
      date
      intro
      image {
        ...ImageFields
      }
      genericTags {
        id
        title
      }
    }
    readMoreText
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
          id
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
    showTitle
    questions {
      id
      question
      answer {
        ...BaseSlices
      }
    }
  }

  fragment ConnectedComponentFields on ConnectedComponent {
    __typename
    id
    title
    json
    componentType: type
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
    __typename
    id
    type
    processTitle
    processLink
    openLinkInModal
    buttonText
  }

  fragment HtmlFields on Html {
    __typename
    id
    document
  }

  fragment EmbeddedVideoFields on EmbeddedVideo {
    __typename
    id
    title
    url
  }

  fragment SectionWithImageFields on SectionWithImage {
    __typename
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
    id
    teamMembers {
      name
      title
      image {
        ...ImageFields
      }
    }
  }

  fragment ContactUsFields on ContactUs {
    __typename
    id
    title
    required
    invalidPhone
    invalidEmail
    labelName
    labelPhone
    labelEmail
    labelSubject
    labelMessage
    submitButtonText
    successMessage
    errorMessage
  }

  fragment TellUsAStoryFields on TellUsAStory {
    __typename
    id
    introTitle
    introImage {
      title
      url
    }
    introDescription {
      ...HtmlFields
    }
    instructionsTitle
    instructionsDescription {
      ...HtmlFields
    }
    firstSectionTitle
    organizationLabel
    organizationPlaceholder
    organizationInputErrorMessage
    dateOfStoryLabel
    dateOfStoryPlaceholder
    dateOfStoryInputErrorMessage
    secondSectionTitle
    subjectLabel
    subjectPlaceholder
    subjectInputErrorMessage
    messageLabel
    messagePlaceholder
    messageInputErrorMessage
    thirdSectionTitle
    instructionsImage {
      title
      url
    }
    nameLabel
    namePlaceholder
    nameInputErrorMessage
    emailLabel
    emailPlaceholder
    emailInputErrorMessage
    publicationAllowedLabel
    submitButtonTitle
    errorMessageTitle
    SuccessMessageTitle
    tellUsAStorySuccessMessage: successMessage {
      ...HtmlFields
    }
  }

  fragment DistrictsFields on Districts {
    __typename
    id
    title
    description
    image {
      ...ImageFields
    }
    links {
      text
      url
    }
  }

  fragment FeaturedArticlesFields on FeaturedArticles {
    __typename
    id
    title
    image {
      ...ImageFields
    }
    articles {
      id
      slug
      title
      processEntry {
        id
      }
    }
    link {
      text
      url
    }
  }

  fragment TwoColumnTextFields on TwoColumnText {
    __typename
    id
    rightTitle
    rightContent {
      ...HtmlFields
    }
    rightLink {
      text
      url
    }
    leftTitle
    leftContent {
      ...HtmlFields
    }
    leftLink {
      text
      url
    }
  }

  fragment MultipleStatisticsFields on MultipleStatistics {
    __typename
    id
    title
    statistics {
      title
      statistics {
        label
        value
      }
    }
    link {
      text
      url
    }
  }

  fragment OneColumnTextFields on OneColumnText {
    __typename
    id
    title
    link {
      text
      url
    }
    content {
      ...HtmlFields
    }
  }

  fragment AccordionSliceFields on AccordionSlice {
    __typename
    id
    title
    type
    accordionItems {
      id
      title
      content {
        ...HtmlFields
      }
      link {
        url
        text
      }
    }
  }

  fragment OverviewLinksField on OverviewLinks {
    __typename
    id
    overviewLinks {
      title
      intro {
        ...HtmlFields
      }
      linkTitle
      link {
        type
        slug
      }
      leftImage
      image {
        title
        url
        width
        height
      }
    }
    link {
      text
      url
    }
  }

  fragment EventSliceFields on EventSlice {
    __typename
    id
    title
    subtitle
    date
    link {
      text
      url
    }
    backgroundImage {
      title
      url
      width
      height
    }
  }

  fragment EmbedSliceFields on EmbedSlice {
    title
    url
    frameHeight
  }

  fragment BaseSlices on Slice {
    ...TimelineFields
    ...MailingListSignupFields
    ...StoryFields
    ...LatestNewsFields
    ...LinkCardFields
    ...HeadingFields
    ...LogoListFields
    ...BulletListFields
    ...StatisticsFields
    ...ProcessEntryFields
    ...HtmlFields
    ...ImageFields
    ...AssetFields
    ...EmbeddedVideoFields
    ...SectionWithImageFields
    ...TabSectionFields
    ...TeamListFields
    ...ContactUsFields
    ...TellUsAStoryFields
    ...ConnectedComponentFields
    ...DistrictsFields
    ...FeaturedArticlesFields
    ...TwoColumnTextFields
    ...MultipleStatisticsFields
    ...OneColumnTextFields
    ...AccordionSliceFields
    ...OverviewLinksField
    ...EventSliceFields
    ...EmbedSliceFields
  }

  fragment AllSlices on Slice {
    ...BaseSlices
    ...FaqListFields
  }
`

export const nestedOneColumnTextFields = gql`
  fragment NestedOneColumnTextFields on OneColumnText {
    ...OneColumnTextFields
    content {
      ...AllSlices
    }
  }
`
