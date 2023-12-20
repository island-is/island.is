import { gql } from '@apollo/client'

export const SEARCH_CASE_TEMPLATES = gql`
  query SearchCaseTemplate($input: MinistryOfJusticeSearchCaseTemplateInput!) {
    ministryOfJusticeSearchCaseTemplates(input: $input) {
      items {
        applicationId
        department
        category
        subCategory
        title
        template
        documentContents
        signatureType
        signatureContents
        signatureDate
        ministry
        preferedPublicationDate
        fastTrack
      }
      count
    }
  }
`
