import { gql } from '@apollo/client'

export const ADVERTS = gql`
  query Adverts($input: MinistryOfJusticeAdvertsInput!) {
    ministryOfJusticeAdverts(input: $input) {
      adverts {
        id
        department
        type
        status
        title
        subject
        publicationNumber {
          number
          year
        }
        createdDate
        updatedDate
        signatureDate
        publicationDate
        categories {
          id
          name
          slug
        }
        involvedParty {
          id
          name
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
