import { gql } from '@apollo/client'
export const ADVERTS_QUERY = gql`
  query Adverts($input: OfficialJournalOfIcelandAdvertsInput!) {
    officialJournalOfIcelandAdverts(input: $input) {
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
  query Advert($params: OfficialJournalOfIcelandAdvertSingleParams!) {
    officialJournalOfIcelandAdvert(params: $params) {
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
  query AdvertTypes($params: OfficialJournalOfIcelandTypesInput!) {
    officialJournalOfIcelandTypes(params: $params) {
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
  query AdvertDepartments($params: OfficialJournalOfIcelandQueryInput!) {
    officialJournalOfIcelandDepartments(params: $params) {
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
  query AdvertCategories($params: OfficialJournalOfIcelandQueryInput!) {
    officialJournalOfIcelandCategories(params: $params) {
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
  query AdvertInstitutions($params: OfficialJournalOfIcelandQueryInput!) {
    officialJournalOfIcelandInstitutions(params: $params) {
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
  query AdvertMainCategories($params: OfficialJournalOfIcelandQueryInput!) {
    officialJournalOfIcelandMainCategories(params: $params) {
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
