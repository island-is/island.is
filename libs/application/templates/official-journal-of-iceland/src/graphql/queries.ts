import { gql } from '@apollo/client'

export const GET_PRICE_QUERY = gql`
  query GetPrice($id: String!) {
    officialJournalOfIcelandApplicationGetPrice(id: $id) {
      price
    }
  }
`

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
  query Advert($params: OfficialJournalOfIcelandAdvertSingleParams!) {
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

export const DEPARTMENT_QUERY = gql`
  query AdvertDepartment($params: OfficialJournalOfIcelandAdvertSingleParams!) {
    officialJournalOfIcelandDepartment(params: $params) {
      department {
        id
        title
        slug
      }
    }
  }
`

export const TYPE_QUERY = gql`
  query AdvertType($params: OfficialJournalOfIcelandAdvertSingleParams!) {
    officialJournalOfIcelandType(params: $params) {
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

export const INVOLVED_PARTIES_QUERY = gql`
  query InvolvedParties($input: GetUserInvolvedPartiesInput!) {
    officialJournalOfIcelandApplicationGetUserInvolvedParties(input: $input) {
      involvedParties {
        id
        title
        slug
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

export const PDF_URL_QUERY = gql`
  query PdfUrl($id: String!) {
    officialJournalOfIcelandApplicationGetPdfUrl(id: $id) {
      url
    }
  }
`

export const GET_PRESIGNED_URL_MUTATION = gql`
  mutation GetPresignedUrl(
    $input: OfficialJournalOfIcelandApplicationGetPresignedUrlInput!
  ) {
    officialJournalOfIcelandApplicationGetPresignedUrl(input: $input) {
      url
    }
  }
`

export const ADD_APPLICATION_ATTACHMENT_MUTATION = gql`
  mutation AddApplicationAttachment(
    $input: OfficialJournalOfIcelandApplicationAddApplicationAttachmentInput!
  ) {
    officialJournalOfIcelandApplicationAddAttachment(input: $input) {
      success
    }
  }
`

export const GET_APPLICATION_ATTACHMENTS_QUERY = gql`
  query OfficialJournalOfIcelandApplicationGetAttachments(
    $input: OfficialJournalOfIcelandApplicationGetApplicationAttachmentInput!
  ) {
    officialJournalOfIcelandApplicationGetAttachments(input: $input) {
      attachments {
        id
        originalFileName
        fileName
        fileFormat
        fileExtension
        fileLocation
        fileSize
      }
    }
  }
`

export const DELETE_APPLICATION_ATTACHMENT_MUTATION = gql`
  mutation DeleteApplicationAttachment(
    $input: OfficialJournalOfIcelandApplicationDeleteApplicationAttachmentInput!
  ) {
    officialJournalOfIcelandApplicationDeleteAttachment(input: $input) {
      success
    }
  }
`

export const GET_COMMENTS_QUERY = gql`
  query GetComments($input: OJOIAGetCommentsInput!) {
    OJOIAGetComments(input: $input) {
      comments {
        id
        age
        title
        direction
        comment
        creator
        receiver
      }
    }
  }
`

export const POST_COMMENT_MUTATION = gql`
  mutation AddComment($input: OJOIAPostCommentInput!) {
    OJOIAPostComment(input: $input) {
      success
    }
  }
`
