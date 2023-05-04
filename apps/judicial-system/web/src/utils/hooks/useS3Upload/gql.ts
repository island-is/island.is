import { gql } from '@apollo/client'

export const CreatePresignedPostMutation = gql`
  mutation CreatePresignedPost($input: CreatePresignedPostInput!) {
    createPresignedPost(input: $input) {
      url
      fields
    }
  }
`

export const LimitedAccessCreatePresignedPostMutation = gql`
  mutation LimitedAccessCreatePresignedPost($input: CreatePresignedPostInput!) {
    limitedAccessCreatePresignedPost(input: $input) {
      url
      fields
    }
  }
`

export const CreateFileMutation = gql`
  mutation CreateFile($input: CreateFileInput!) {
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
  mutation LimitedAccessCreateFile($input: CreateFileInput!) {
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
  mutation DeleteFile($input: DeleteFileInput!) {
    deleteFile(input: $input) {
      success
    }
  }
`

export const LimitedAccessDeleteFileMutation = gql`
  mutation LimitedAccessDeleteFile($input: DeleteFileInput!) {
    limitedAccessDeleteFile(input: $input) {
      success
    }
  }
`

export const UploadPoliceCaseFileMutation = gql`
  mutation UploadPoliceCaseFile($input: UploadPoliceCaseFileInput!) {
    uploadPoliceCaseFile(input: $input) {
      key
      size
    }
  }
`
