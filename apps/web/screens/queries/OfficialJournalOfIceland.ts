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
        additions {
          id
          title
          html
          order
        }
        corrections {
          description
          advertId
          documentPdfUrl
          createdDate
          legacyDate
          isLegacy
        }
      }
    }
  }
`

export const ADVERT_SIMILAR_QUERY = gql`
  query AdvertSimilar($params: OfficialJournalOfIcelandAdvertSimilarParams!) {
    officialJournalOfIcelandAdvertsSimilar(params: $params) {
      adverts {
        id
        department {
          title
          slug
        }
        subject
        title
        publicationNumber {
          full
          year
          number
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
        id
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
        departmentId
        categories {
          id
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

export const CASES_IN_PROGRESS_QUERY = gql`
  query CasesInProgress($params: OfficialJournalOfIcelandQueryInput!) {
    officialJournalOfIcelandCasesInProgress(params: $params) {
      cases {
        id
        title
        status
        involvedParty
        createdAt
        fastTrack
        requestedPublicationDate
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
