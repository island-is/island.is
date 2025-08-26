import { gql } from '@apollo/client'
import { ApplicantFragment } from '../fragments/applicant'

export const CREATE_APPLICANT = gql`
  mutation CreateFormSystemApplicant($input: CreateFormSystemApplicantInput!) {
    createFormSystemApplicant(input: $input) {
      ...Applicant
    }
  }
  ${ApplicantFragment}
`
