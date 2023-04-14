import { gql } from '@apollo/client'

export const CreatePresignedPostMutation = gql`
  mutation CreatePresignedPostMutation($input: CreatePresignedPostInput!) {
    createPresignedPost(input: $input) {
      url
      fields
    }
  }
`

export const LimitedAccessCreatePresignedPostMutation = gql`
  mutation LimitedAccessCreatePresignedPostMutation(
    $input: CreatePresignedPostInput!
  ) {
    limitedAccessCreatePresignedPost(input: $input) {
      url
      fields
    }
  }
`

export const CreateFileMutation = gql`
  mutation CreateFileMutation($input: CreateFileInput!) {
    createFile(input: $input) {
      id
      created
      caseId
      name
      key
      size
      category
      policeCaseNumber
    }
  }
`

export const LimitedAccessCreateFileMutation = gql`
  mutation LimitedAccessCreateFileMutation($input: CreateFileInput!) {
    limitedAccessCreateFile(input: $input) {
      id
      created
      caseId
      name
      key
      size
      category
      policeCaseNumber
    }
  }
`

export const DeleteFileMutation = gql`
  mutation DeleteFileMutation($input: DeleteFileInput!) {
    deleteFile(input: $input) {
      success
    }
  }
`

export const LimitedAccessDeleteFileMutation = gql`
  mutation LimitedAccessDeleteFileMutation($input: DeleteFileInput!) {
    limitedAccessDeleteFile(input: $input) {
      success
    }
  }
`

export const UploadPoliceCaseFileMutation = gql`
  mutation UploadPoliceCaseFileMutation($input: UploadPoliceCaseFileInput!) {
    uploadPoliceCaseFile(input: $input) {
      key
      size
    }
  }
`
