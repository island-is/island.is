import gql from 'graphql-tag'
import { slices } from './fragments'

export const GET_ORGANIZATIONS_QUERY = gql`
  query GetOrganizations($input: GetOrganizationsInput!) {
    getOrganizations(input: $input) {
      items {
        id
        slug
        title
        description
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
      title
      logo {
        title
        url
      }
      link
      tag {
        id
        title
      }
      description
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
        title
        slug
        logo {
          url
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
        title
        content
        type
        link {
          text
          url
        }
      }
      theme
      themeProperties {
        gradientStartColor
        gradientEndColor
      }
    }
  }
  ${slices}
`

export const GET_ORGANIZATION_SUBPAGE_QUERY = gql`
  query GetOrganizationSubpage($input: GetOrganizationSubpageInput!) {
    getOrganizationSubpage(input: $input) {
      title
      slug
      description {
        ...AllSlices
      }
      links {
        text
        url
      }
      slices {
        ...AllSlices
      }
      sliceCustomRenderer
      sliceExtraText
      parentSubpage
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
      results {
        location
        name
        street
        postalCode
        validUntil
        type
        category
        issuedBy
        licenseHolder
        licenseNumber
      }
    }
  }
`
