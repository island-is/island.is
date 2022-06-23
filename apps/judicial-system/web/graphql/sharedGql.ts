import { gql } from '@apollo/client'

export const CreatePresignedPostMutation = gql`
  mutation CreatePresignedPostMutation($input: CreatePresignedPostInput!) {
    createPresignedPost(input: $input) {
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

export const GetSignedUrlQuery = gql`
  query GetSignedUrlQuery($input: GetSignedUrlInput!) {
    getSignedUrl(input: $input) {
      url
    }
  }
`

export const UploadFileToCourtMutation = gql`
  mutation UploadFileToCourtMutation($input: UploadFileToCourtInput!) {
    uploadFileToCourt(input: $input) {
      success
    }
  }
`

export const PoliceCaseFilesQuery = gql`
  query GetPoliceCaseFiles($input: PoliceCaseFilesQueryInput!) {
    policeCaseFiles(input: $input) {
      id
      name
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
