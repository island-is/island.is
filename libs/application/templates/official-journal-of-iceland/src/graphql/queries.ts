import { gql } from '@apollo/client'
export const ADVERTS_QUERY = gql`
  query Adverts($input: MinistryOfJusticeAdvertsInput!) {
    ministryOfJusticeAdverts(input: $input) {
      adverts {
        id
        department {
          id
          title
          slug
        }
        type {
          id
          title
          slug
          department {
            id
            title
            slug
          }
        }
        status
        title
        subject
        publicationNumber {
          number
          year
          full
        }
        createdDate
        updatedDate
        signatureDate
        publicationDate
        categories {
          id
          title
          slug
        }
        involvedParty {
          id
          title
          slug
        }
        document {
          isLegacy
          html
          pdfUrl
        }
      }
      paging {
        page
        pageSize
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
        nextPage
        previousPage
      }
    }
  }
`

export const ADVERT_QUERY = gql`
  query Advert($params: MinistryOfJusticeAdvertQuery!) {
    ministryOfJusticeAdvert(params: $params) {
      advert {
        id
        department {
          id
          title
          slug
        }
        type {
          id
          title
          slug
          department {
            id
            title
            slug
          }
        }
        status
        title
        subject
        publicationNumber {
          number
          year
          full
        }
        createdDate
        updatedDate
        signatureDate
        publicationDate
        categories {
          id
          title
          slug
        }
        involvedParty {
          id
          title
          slug
        }
        document {
          isLegacy
          html
          pdfUrl
        }
      }
    }
  }
`

export const TYPES_QUERY = gql`
  query AdvertTypes($params: MinistryOfJusticeTypesInput!) {
    ministryOfJusticeTypes(params: $params) {
      types {
        id
        title
        slug
      }
      paging {
        page
        pageSize
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
        nextPage
        previousPage
      }
    }
  }
`

export const DEPARTMENTS_QUERY = gql`
  query AdvertDepartments($params: MinistryOfJusticeQueryInput!) {
    ministryOfJusticeDepartments(params: $params) {
      departments {
        id
        title
        slug
      }
      paging {
        page
        pageSize
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
        nextPage
        previousPage
      }
    }
  }
`

export const CATEGORIES_QUERY = gql`
  query AdvertCategories($input: MinistryOfJusticeQueryInput!) {
    ministryOfJusticeCategories(params: $input) {
      categories {
        id
        title
        slug
      }
      paging {
        page
        pageSize
        totalPages
        totalItems
        hasNextPage
        hasPreviousPage
        nextPage
        previousPage
      }
    }
  }
`
