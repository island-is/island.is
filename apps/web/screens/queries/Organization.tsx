import gql from 'graphql-tag'

import {
  htmlFields,
  nestedFields,
  processEntryFields,
  slices,
} from './fragments'

export const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        id
        slug
        title
        description
        showsUpOnTheOrganizationsPage
        hasALandingPage
        logo {
          title
          url
        }
        link
        tag {
          id
          title
        }
      }
    }
  }
`

export const GET_ORGANIZATION_BY_TITLE_QUERY = gql`
  query GetOrganizationByTitle($input: GetOrganizationByTitleInput!) {
    getOrganizationByTitle(input: $input) {
      id
      slug
      email
      phone
      title
      hasALandingPage
      trackingDomain
      logo {
        title
        url
      }
      publishedMaterialSearchFilterGenericTags {
        id
        title
        slug
        genericTagGroup {
          id
          title
          slug
        }
      }
      link
      tag {
        id
        title
      }
      description
      namespace {
        fields
      }
    }
  }
`

export const GET_ORGANIZATION_QUERY = gql`
  ${htmlFields}
  query GetOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      id
      slug
      email
      phone
      title
      hasALandingPage
      trackingDomain
      canPagesBeFoundInSearchResults
      logo {
        title
        url
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
      publishedMaterialSearchFilterGenericTags {
        id
        title
        slug
        genericTagGroup {
          id
          title
          slug
        }
      }
      link
      tag {
        id
        title
      }
      description
      namespace {
        fields
      }
    }
  }
`

export const GET_ORGANIZATION_PAGE_QUERY = gql`
  query GetOrganizationPage($input: GetOrganizationPageInput!) {
    getOrganizationPage(input: $input) {
      id
      slug
      title
      description
      canBeFoundInSearchResults
      showPastEventsOption
      topLevelNavigation {
        links {
          label
          href
        }
      }
      defaultHeaderImage {
        url
        contentType
        width
        height
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
      menuLinks {
        primaryLink {
          text
          url
        }
        childrenLinks {
          text
          url
        }
      }
      secondaryMenu {
        name
        childrenLinks {
          text
          url
        }
      }
      organization {
        id
        title
        slug
        email
        phone
        trackingDomain
        canPagesBeFoundInSearchResults
        publishedMaterialSearchFilterGenericTags {
          id
          title
          slug
          genericTagGroup {
            id
            title
            slug
          }
        }
        logo {
          url
        }
        namespace {
          fields
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
      }
      slices {
        ...AllSlices
      }
      bottomSlices {
        ...AllSlices
      }
      secondaryNewsTags {
        id
        title
        slug
      }
      featuredImage {
        url
        title
        width
        height
      }
      sidebarCards {
        ...SidebarCardFields
        ...ConnectedComponentFields
      }
      theme
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
      externalLinks {
        text
        url
      }
    }
  }
  ${slices}
`

export const GET_ORGANIZATION_SUBPAGE_QUERY = gql`
  query GetOrganizationSubpage($input: GetOrganizationSubpageInput!) {
    getOrganizationSubpage(input: $input) {
      id
      title
      slug
      signLanguageVideo {
        url
        thumbnailImageUrl
      }
      description {
        ...AllSlices
        ${nestedFields}
      }
      links {
        text
        url
      }
      slices {
        ...AllSlices
        ${nestedFields}
      }
      bottomSlices {
        ...AllSlices
      }
      showTableOfContents
      sliceCustomRenderer
      sliceExtraText
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

export const GET_ORGANIZATION_SUBPAGE_BY_ID_QUERY = gql`
  query GetOrganizationSubpageById($input: GetOrganizationSubpageByIdInput!) {
    getOrganizationSubpageById(input: $input) {
      id
      title
      slug
      signLanguageVideo {
        url
        thumbnailImageUrl
      }
      description {
        ...AllSlices
        ${nestedFields}
      }
      links {
        text
        url
      }
      slices {
        ...AllSlices
        ${nestedFields}
      }
      bottomSlices {
        ...AllSlices
      }
      showTableOfContents
      sliceCustomRenderer
      sliceExtraText
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

export const GET_ORGANIZATION_SERVICES_QUERY = gql`
  query GetOrganizationServices($input: GetArticlesInput!) {
    getArticles(input: $input) {
      title
      slug
      body {
        ...ProcessEntryFields
      }
      processEntryButtonText
      processEntry {
        ...ProcessEntryFields
      }
      category {
        slug
        title
      }
      group {
        slug
        title
      }
    }
  }
  ${processEntryFields}
`

export const GET_ORGANIZATION_TAGS_QUERY = gql`
  query GetOrganizationTags($input: GetOrganizationTagsInput!) {
    getOrganizationTags(input: $input) {
      items {
        id
        title
      }
    }
  }
`

export const GET_HOMESTAYS_QUERY = gql`
  query GetHomestays($input: GetHomestaysInput!) {
    getHomestays(input: $input) {
      registrationNumber
      address
      name
      city
      manager
      guests
      rooms
      propertyId
      apartmentId
    }
  }
`

export const GET_SYSLUMENN_AUCTIONS_QUERY = gql`
  query GetSyslumennAuctions {
    getSyslumennAuctions {
      office
      location
      auctionType
      lotType
      lotName
      lotId
      lotItems
      auctionDate
      auctionTime
      petitioners
      respondent
      publishText
      auctionTakesPlaceAt
    }
  }
`

export const GET_OPERATING_LICENSES_QUERY = gql`
  query GetOperatingLicenses($input: GetOperatingLicensesInput!) {
    getOperatingLicenses(input: $input) {
      paginationInfo {
        pageSize
        pageNumber
        totalCount
        totalPages
        currentPage
        hasNext
        hasPrevious
      }
      searchQuery
      results {
        id
        issuedBy
        licenseNumber
        location
        name
        street
        postalCode
        type
        type2
        restaurantType
        validFrom
        validTo
        licenseHolder
        licenseResponsible
        category
        outdoorLicense
        alcoholWeekdayLicense
        alcoholWeekendLicense
        alcoholWeekdayOutdoorLicense
        alcoholWeekendOutdoorLicense
        maximumNumberOfGuests
        numberOfDiningGuests
      }
    }
  }
`

export const GET_OPERATING_LICENSES_CSV_QUERY = gql`
  query GetOperatingLicensesCSV {
    getOperatingLicensesCSV {
      value
    }
  }
`

export const EMAIL_SIGNUP_MUTATION = gql`
  mutation EmailSignupSubscription($input: EmailSignupInput!) {
    emailSignupSubscription(input: $input) {
      subscribed
    }
  }
`

export const GET_ORGANIZATION_PARENT_SUBPAGE_QUERY = gql`
  query GetOrganizationParentSubpageQuery(
    $input: GetOrganizationParentSubpageInput!
  ) {
    getOrganizationParentSubpage(input: $input) {
      id
      title
      childLinks {
        id
        label
        href
      }
    }
  }
`

export const GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL1_QUERY = gql`
  query GetOrganizationPageStandaloneSitemapLevel1Query(
    $input: GetOrganizationPageStandaloneSitemapLevel1Input!
  ) {
    getOrganizationPageStandaloneSitemapLevel1(input: $input) {
      childLinks {
        label
        href
        description
      }
    }
  }
`

export const GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL2_QUERY = gql`
  query GetOrganizationPageStandaloneSitemapLevel2Query(
    $input: GetOrganizationPageStandaloneSitemapLevel2Input!
  ) {
    getOrganizationPageStandaloneSitemapLevel2(input: $input) {
      label
      childCategories {
        label
        href
        childLinks {
          label
          href
        }
      }
    }
  }
`
