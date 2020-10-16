import { gql } from '@apollo/client'

export const ApplicationFragment = gql`
  fragment Application on Application {
    id
    created
    modified
    applicant
    assignee
    state
    attachments
    typeId
    answers
    externalData
  }
`
