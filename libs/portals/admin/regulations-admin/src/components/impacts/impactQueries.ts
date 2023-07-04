import { gql } from '@apollo/client'

export const CREATE_DRAFT_REGULATION_CANCEL = gql`
  mutation CreateDraftRegulationCancel(
    $input: CreateDraftRegulationCancelInput!
  ) {
    createDraftRegulationCancel(input: $input) {
      type
      id
      name
      regTitle
      date
      dropped
    }
  }
`
export const UPDATE_DRAFT_REGULATION_CANCEL = gql`
  mutation UpdateDraftRegulationCancel(
    $input: UpdateDraftRegulationCancelInput!
  ) {
    updateDraftRegulationCancel(input: $input) {
      type
      id
      name
      regTitle
      date
      dropped
    }
  }
`

export const DELETE_DRAFT_REGULATION_CANCEL = gql`
  mutation DeleteDraftRegulationCancel(
    $input: DeleteDraftRegulationCancelInput!
  ) {
    deleteDraftRegulationCancel(input: $input) {
      id
    }
  }
`

export const CREATE_DRAFT_REGULATION_CHANGE = gql`
  mutation CreateDraftRegulationChange(
    $input: CreateDraftRegulationChangeInput!
  ) {
    createDraftRegulationChange(input: $input) {
      id
      type
      name
      regTitle
      date
      title
      text
      diff
      appendixes {
        title
        text
      }
      comments
      dropped
    }
  }
`
export const UPDATE_DRAFT_REGULATION_CHANGE = gql`
  mutation UpdateDraftRegulationChange(
    $input: UpdateDraftRegulationChangeInput!
  ) {
    updateDraftRegulationChange(input: $input) {
      id
      type
      name
      regTitle
      date
      title
      text
      diff
      appendixes {
        title
        text
      }
      comments
      dropped
    }
  }
`

export const DELETE_DRAFT_REGULATION_CHANGE = gql`
  mutation DeleteDraftRegulationChange(
    $input: DeleteDraftRegulationChangeInput!
  ) {
    deleteDraftRegulationChange(input: $input) {
      id
    }
  }
`
