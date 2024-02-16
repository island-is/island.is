import { gql } from '@apollo/client'

export const GET_NEW_FORM = gql`
  query GetNewForm($input: ID!) {
    getNewForm(organisationId: $input) {
      id
      applicationsDaysToRemove
      dependencies
      documentTypes
      formApplicantTypes
      stepsList
      groupsList
      inputsList
      invalidationDate
      stopProgressOnValidatingStep
      name {
        is
        en
      }
      organization {
        id
        name {
          is
          en
        }
      }
    }
  }
`

export const GET_FORM_FROM_ID = gql`
  query GetFormFromId($input: ID!) {
    getFormFromId(formId: $input) {
      id
      applicationsDaysToRemove
      dependencies
      documentTypes
      formApplicantTypes
      stepsList
      groupsList
      inputsList
      invalidationDate
      stopProgressOnValidatingStep
      name {
        is
        en
      }
      organization {
        id
        name {
          is
          en
        }
      }

    }
  }
`


export const ADD_STEP = gql`
  mutation AddStep($input: AddStepInput!) {
    addStep(input: $input) {
      id
      name {
        is
        en
      }
      type
    }
  }
`
