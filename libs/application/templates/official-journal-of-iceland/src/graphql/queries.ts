import { gql } from '@apollo/client'
export const ADVERTS_QUERY = gql`
  query Adverts($input: OfficialJournalOfIcelandAdvertsInput!) {
    officialJournalOfIcelandAdverts(input: $input) {
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
  query Advert($params: OfficialJournalOfIcelandAdvertQuery!) {
    officialJournalOfIcelandAdvert(params: $params) {
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
  query AdvertTypes($params: OfficialJournalOfIcelandTypesInput!) {
    officialJournalOfIcelandTypes(params: $params) {
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
  query AdvertDepartments($params: OfficialJournalOfIcelandQueryInput!) {
    officialJournalOfIcelandDepartments(params: $params) {
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
  query AdvertCategories($params: OfficialJournalOfIcelandQueryInput!) {
    officialJournalOfIcelandCategories(params: $params) {
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
