import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignee
    externalId
    state
    attachments
    typeId
    answers
    externalData
  }
`
