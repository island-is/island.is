import { gql } from '@apollo/client'
export const ADVERTS_QUERY = gql`
  query Adverts($input: MinistryOfJusticeAdvertsInput!) {
    ministryOfJusticeAdverts(input: $input) {
      adverts {
        id
        department {
          title
          slug
        }
        title
        publicationNumber {
          full
        }
        publicationDate
        categories {
          title
          slug
        }
        involvedParty {
          title
          slug
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
          title
          slug
        }
        type {
          title
          slug
        }
        status
        title
        subject
        publicationNumber {
          full
        }
        signatureDate
        publicationDate
        categories {
          title
          slug
        }
        involvedParty {
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
  query AdvertCategories($params: MinistryOfJusticeQueryInput!) {
    ministryOfJusticeCategories(params: $params) {
      categories {
        title
        slug
        mainCategory {
          title
          slug
        }
        department {
          title
          slug
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

export const INSTITUTIONS_QUERY = gql`
  query AdvertInstitutions($params: MinistryOfJusticeQueryInput!) {
    ministryOfJusticeInstitutions(params: $params) {
      institutions {
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

export const MAIN_CATEGORIES_QUERY = gql`
  query AdvertMainCategories($params: MinistryOfJusticeQueryInput!) {
    ministryOfJusticeMainCategories(params: $params) {
      mainCategories {
        title
        slug
        description
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
