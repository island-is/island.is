import gql from 'graphql-tag'
import { slices, nestedAccordionAndFaqListFields } from './fragments'

export const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        id
        slug
        title
        description
        showsUpOnTheOrganizationsPage
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

export const GET_ORGANIZATION_QUERY = gql`
  query GetOrganization($input: GetOrganizationInput!) {
    getOrganization(input: $input) {
      id
      slug
      email
      phone
      title
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

export const GET_ORGANIZATION_PAGE_QUERY = gql`
  query GetOrganizationPage($input: GetOrganizationPageInput!) {
    getOrganizationPage(input: $input) {
      id
      slug
      title
      description
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
        logo {
          url
        }
        namespace {
          fields
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
      slices {
        ...AllSlices
      }
      bottomSlices {
        ...AllSlices
      }
      newsTag {
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
        backgroundColor
        darkText
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
      description {
        ...AllSlices
        ${nestedAccordionAndFaqListFields}
      }
      links {
        text
        url
      }
      slices {
        ...AllSlices
        ${nestedAccordionAndFaqListFields}
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
      processEntryButtonText
      processEntry {
        id
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
