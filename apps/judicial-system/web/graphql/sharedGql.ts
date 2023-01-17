import { gql } from '@apollo/client'

export const CreatePresignedPostGql = gql`
  mutation CreatePresignedPost($input: CreatePresignedPostInput!) {
    createPresignedPost(input: $input) {
      url
      fields
    }
  }
`

export const CreateFileGql = gql`
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

export const DeleteFileGql = gql`
  mutation DeleteFile($input: DeleteFileInput!) {
    deleteFile(input: $input) {
      success
    }
  }
`

export const GetSignedUrlGql = gql`
  query GetSignedUrl($input: GetSignedUrlInput!) {
    getSignedUrl(input: $input) {
      url
    }
  }
`

export const UploadFileToCourtGql = gql`
  mutation UploadFileToCourt($input: UploadFileToCourtInput!) {
    uploadFileToCourt(input: $input) {
      success
    }
  }
`

export const PoliceCaseFilesGql = gql`
  query GetPoliceCaseFiles($input: PoliceCaseFilesQueryInput!) {
    policeCaseFiles(input: $input) {
      id
      name
    }
  }
`

export const UploadPoliceCaseFileGql = gql`
  mutation UploadPoliceCaseFile($input: UploadPoliceCaseFileInput!) {
    uploadPoliceCaseFile(input: $input) {
      key
      size
    }
  }
`
