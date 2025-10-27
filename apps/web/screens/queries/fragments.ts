import gql from 'graphql-tag'

export const processEntryFields = gql`
  fragment ProcessEntryFields on ProcessEntry {
    __typename
    id
    processTitle
    processLink
    openLinkInModal
    buttonText
  }
`

export const htmlFields = gql`
  fragment HtmlFields on Html {
    __typename
    id
    document
  }
`

export const assetFields = gql`
  fragment AssetFields on Asset {
    __typename
    id
    title
    url
    contentType
  }
`

export const imageFields = gql`
  fragment ImageFields on Image {
    __typename
    id
    title
    description
    url
    contentType
    width
    height
  }
`

export const slices = gql`
  ${imageFields}
  ${assetFields}

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
    hasBorderAbove
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
        slug
      }
    }
    readMoreText
    readMoreLink {
      url
    }
  }

  fragment LinkCardFields on LinkCard {
    __typename
    id
    title
    body
    linkUrl
    linkText
  }

  fragment LinkCardSectionFields on LinkCardSection {
    __typename
    id
    title
    cards {
      ...LinkCardFields
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
    dividerOnTop
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
      publishDate
    }
  }

  fragment ConnectedComponentFields on ConnectedComponent {
    __typename
    id
    title
    json
    configJson
    componentType: type
    translationStrings
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

  ${htmlFields}

  fragment EmbeddedVideoFields on EmbeddedVideo {
    __typename
    id
    title
    url
    thumbnailImageUrl
  }

  fragment SectionWithImageFields on SectionWithImage {
    __typename
    id
    title
    image {
      ...ImageFields
    }
    content {
      ...HtmlFields
      ...FaqListFields
    }
  }

  fragment SectionWithVideoFields on SectionWithVideo {
    __typename
    id
    title
    showTitle
    showDividerOnTop
    video {
      ...EmbeddedVideoFields
    }
    html {
      ...HtmlFields
    }
    link {
      text
      url
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
    variant
    filterTags {
      id
      title
      slug
      genericTagGroup {
        id
        title
        slug
      }
    }
    teamMembers {
      name
      title
      image {
        ...ImageFields
      }
      imageOnSelect {
        ...ImageFields
      }
    }
    showSearchInput
    teamMemberOrder
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
    automaticallyFetchArticles
    sortBy
    hasBorderAbove
    articles {
      id
      slug
      title
      processEntry {
        ...ProcessEntryFields
      }
      processEntryButtonText
    }
    resolvedArticles {
      id
      slug
      title
      processEntry {
        ...ProcessEntryFields
      }
      processEntryButtonText
      importance
    }
    link {
      text
      url
    }
    introText {
      ...HtmlFields
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
    dividerOnTop
    onlyUseOneTitle
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
      ...AssetFields
      ...ImageFields
    }
    dividerOnTop
    showTitle
  }

  fragment AccordionSliceFields on AccordionSlice {
    __typename
    id
    title
    type
    hasBorderAbove
    showTitle
    titleHeadingLevel
    accordionItems {
      id
      title
      content {
        ...HtmlFields
        ...AssetFields
        ...ImageFields
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
    titleAbove
    hasBorderAbove
    linkData {
      variant
      categoryCardItems {
        title
        description
        href
      }
    }
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
        description
      }
      openLinkInNewTab
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
      description
    }
  }

  fragment FormFields on Form {
    __typename
    id
    title
    intro
    defaultFieldNamespace
    fields {
      id
      title
      name
      placeholder
      type
      required
      options
      informationText
    }
    successText
    aboutYouHeadingText
    questionsHeadingText
    recipientFormFieldDecider {
      id
      title
      placeholder
      type
      required
      options
    }
  }

  fragment StepperFields on Stepper {
    __typename
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

  fragment GraphCardFields on GraphCard {
    id
    graphTitle
    graphDescription
    organization
    data
    datakeys
    type
    displayAsCard
    organizationLogo {
      id
      url
      title
      contentType
      width
      height
      description
    }
  }

  fragment AnchorPageListSliceFields on AnchorPageListSlice {
    id
    title
    pages {
      id
      title
      shortTitle
      slug
      pageType
      tinyThumbnail {
        url
        title
      }
      thumbnail {
        url
        title
      }
      intro
    }
  }

  fragment SidebarCardFields on SidebarCard {
    id
    title
    contentString
    type
    image {
      url
      title
      width
      height
      description
    }
    link {
      text
      url
    }
  }

  fragment PowerBiSliceFields on PowerBiSlice {
    __typename
    id
    title
    powerBiEmbedProps
    workspaceId
    reportId
    owner
    powerBiEmbedPropsFromServer {
      accessToken
      embedUrl
    }
  }

  fragment TableSliceFields on TableSlice {
    __typename
    id
    title
    tableContent
  }

  fragment EmailSignupFields on EmailSignup {
    __typename
    id
    title
    description
    formFields {
      id
      title
      name
      placeholder
      type
      required
      options
      informationText
    }
    translations
  }

  fragment SliceDropdownFields on SliceDropdown {
    __typename
    id
    dropdownLabel
    alphabeticallyOrdered
    slices {
      ...OneColumnTextFields
    }
  }

  fragment FeaturedEventsFields on FeaturedEvents {
    __typename
    id
    namespace
    noEventsFoundText {
      ...HtmlFields
    }
    resolvedEventList {
      total
      items {
        id
        title
        slug
        startDate
        time {
          startTime
          endTime
          endDate
        }
        location {
          streetAddress
          floor
          postalCode
          useFreeText
          freeText
        }
        thumbnailImage {
          url
          title
          width
          height
          description
        }
        organization {
          slug
        }
      }
    }
  }

  fragment FeaturedSupportQNAsFields on FeaturedSupportQNAs {
    __typename
    id
    renderedTitle
    resolvedSupportQNAs {
      id
      title
      slug
      answer {
        ...BaseSlices
      }
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
    link {
      text
      url
    }
    supportQNAs {
      id
      title
      slug
      answer {
        ...BaseSlices
      }
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

  fragment EmbedFields on Embed {
    embedUrl
    altText
    aspectRatio
  }

  fragment GrantCardsListFields on GrantCardsList {
    __typename
    id
    title
    displayTitle
    namespace
    maxNumberOfCards
    sorting
    alwaysDisplayResultsAsCards
    resolvedGrantsList {
      total
      items {
        id
        name
        description
        applicationId
        applicationUrl {
          slug
          type
        }
        dateFrom
        dateTo
        status
        statusText
        categoryTags {
          id
          title
          genericTagGroup {
            title
          }
        }
        typeTag {
          id
          title
          genericTagGroup {
            title
          }
        }
        fund {
          id
          title
          link {
            slug
            type
          }
          featuredImage {
            id
            url
          }
          parentOrganization {
            id
            title
            logo {
              url
            }
          }
        }
      }
    }
  }

  fragment LatestEventsSliceFields on LatestEventsSlice {
    title
    events {
      title
      slug
      startDate
      time {
        startTime
        endTime
        endDate
      }
      location {
        streetAddress
        floor
        postalCode
        freeText
        useFreeText
      }
      thumbnailImage {
        url
        title
        width
        height
        description
      }
    }
  }

  fragment ChartFields on Chart {
    __typename
    id
    title
    chartDescription
    alternativeDescription
    displayAsCard
    startExpanded
    dateFrom
    dateTo
    numberOfDataPoints
    components {
      __typename
      label
      type
      sourceDataKey
      interval
      stackId
      values
    }
    sourceData
    flipAxis
    xAxisKey
    xAxisFormat
    xAxisValueType
    customStyleConfig
    reduceAndRoundValue
    yAxisLabel
  }

  fragment ChartNumberBoxFields on ChartNumberBox {
    __typename
    chartNumberBoxId: id
    title
    numberBoxDescription
    sourceDataKey
    valueType
    displayChangeMonthOverMonth
    displayChangeYearOverYear
    numberBoxDate
    reduceAndRoundValue
    displayTimestamp
  }

  fragment GenericListFields on GenericList {
    __typename
    id
    searchInputPlaceholder
    itemType
    defaultOrder
    textSearchOrder
    showSearchInput
    filterTags {
      id
      title
      slug
      genericTagGroup {
        id
        title
        slug
      }
    }
  }

  fragment IntroLinkImageFields on IntroLinkImage {
    id
    title
    introHtml {
      ...HtmlFields
    }
    linkTitle
    linkHref
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
      description
    }
    openLinkInNewTab
  }

  fragment LatestGenericListItemsFields on LatestGenericListItems {
    title
    genericList {
      itemType
    }
    seeMorePage {
      ... on OrganizationSubpage {
        id
        title
        slug
        organizationPage {
          slug
        }
      }
    }
    seeMoreLinkText
    itemResponse {
      items {
        id
        date
        title
        cardIntro {
          ...HtmlFields
        }
        filterTags {
          id
          title
          slug
        }
        slug
        assetUrl
        externalUrl
        image {
          url
          title
          width
          height
          description
        }
      }
    }
  }

  fragment FeaturedLinksFields on FeaturedLinks {
    __typename
    id
    title
    featuredLinks {
      title
      attention
      thing {
        slug
        type
      }
    }
  }

  fragment OrganizationParentSubpageListFields on OrganizationParentSubpageList {
    __typename
    id
    title
    pageLinkVariant
    pageLinks {
      id
      pageLinkIntro
      label
      href
      thumbnailImageHref
      tinyThumbnailImageHref
    }
    seeMoreLink {
      text
      url
    }
  }

  fragment FeaturedGenericListItemsFields on FeaturedGenericListItems {
    __typename
    id
    baseUrl
    filterUrl
    seeMoreLinkTextString
    items {
      id
      date
      title
      genericList {
        itemType
      }
      cardIntro {
        ...HtmlFields
      }
      filterTags {
        id
        title
        slug
      }
      slug
      assetUrl
      externalUrl
      image {
        url
        title
        width
        height
        description
      }
    }
  }

  fragment BaseSlices on Slice {
    ...TimelineFields
    ...StoryFields
    ...LatestNewsFields
    ...LinkCardFields
    ...LinkCardSectionFields
    ...HeadingFields
    ...LogoListFields
    ...BulletListFields
    ...StatisticsFields
    ...ProcessEntryFields
    ...HtmlFields
    ...ImageFields
    ...AssetFields
    ...EmbeddedVideoFields
    ...SectionWithVideoFields
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
    ...FormFields
    ...StepperFields
    ...GraphCardFields
    ...AnchorPageListSliceFields
    ...SidebarCardFields
    ...PowerBiSliceFields
    ...TableSliceFields
    ...EmailSignupFields
    ...SliceDropdownFields
    ...EmbedFields
    ...LatestEventsSliceFields
    ...ChartFields
    ...ChartNumberBoxFields
    ...FeaturedEventsFields
    ...GenericListFields
    ...LatestGenericListItemsFields
    ...FeaturedLinksFields
    ...GrantCardsListFields
    ...OrganizationParentSubpageListFields
    ...IntroLinkImageFields
    ...FeaturedGenericListItemsFields
  }

  fragment AllSlices on Slice {
    ...BaseSlices
    ...FaqListFields
    ...SectionWithImageFields
    ...FeaturedSupportQNAsFields
  }
  ${processEntryFields}
`

export const nestedOneColumnTextFields = gql`
  fragment NestedOneColumnTextFields on OneColumnText {
    ...OneColumnTextFields
    content {
      ...AllSlices
    }
  }
`

const nestedContainerFields = `
  ... on AccordionSlice {
    ...AccordionSliceFields
    accordionItems {
      ... on OneColumnText {
        ...OneColumnTextFields
        content {
          ...AllSlices
        }
      }
    }
  }
  ... on FaqList {
    ...FaqListFields
    questions {
      id
      question
      answer {
        ...AllSlices
      }
      publishDate
    }
  }
  ... on TabSection {
    ...TabSectionFields
    tabs {
      tabTitle
      contentTitle
      image {
        ...ImageFields
      }
      body {
        ...AllSlices
      }
    }
  }
  ... on SliceDropdown {
    ...SliceDropdownFields
    slices {
      ... on OneColumnText {
        ...OneColumnTextFields
        content {
          ...AllSlices
        }
      }
    }
  }
`

export const nestedFields = `
  ... on OneColumnText {
    ...OneColumnTextFields
    content {
      ...AllSlices
      ${nestedContainerFields}
    }
  }
  ${nestedContainerFields}
`
