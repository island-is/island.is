import gql from 'graphql-tag'

export const GetListById = gql`
  query listbyid($input: SignatureCollectionIdInput!) {
    signatureCollectionList(input: $input) {
      id
      title
      area {
        id
        name
        min
        max
      }
      endTime
      startTime
      owner {
        nationalId
        name
        phone
        email
      }
      collectors {
        nationalId
        name
        phone
        email
      }
      active
      collectionId
      link
      numberOfSignatures
    }
  }
`

export const GetListSignatures = gql`
  query Signatures($input: SignatureCollectionIdInput!) {
    signatureCollectionSignatures(input: $input) {
      id
      listId
      signee {
        name
        nationalId
        areaId
        address
      }
      signatureType
      active
      created
      modified
    }
  }
`

export const GetSignedList = gql`
  query signedList {
    signatureCollectionSignedList {
      id
      title
      area {
        id
        name
        min
        max
      }
      endTime
      startTime
      owner {
        nationalId
        name
        phone
        email
      }
      collectors {
        nationalId
        name
        phone
        email
      }
      active
      collectionId
      link
    }
  }
`

export const GetOwnerLists = gql`
  query listsByOwner {
    signatureCollectionListsByOwner {
      id
      title
      area {
        id
        name
        min
        max
      }
      endTime
      startTime
      owner {
        nationalId
        name
        phone
        email
      }
      collectors {
        nationalId
        name
        phone
        email
      }
      active
      collectionId
      link
      numberOfSignatures
    }
  }
`
export const GetListsBySigneeArea = gql`
  query listsByArea($input: SignatureCollectionAreaInput!) {
    signatureCollectionListsByArea(input: $input) {
      id
      title
      area {
        id
        name
        min
        max
      }
      endTime
      startTime
      owner {
        nationalId
        name
        phone
        email
      }
      collectors {
        nationalId
        name
        phone
        email
      }
      active
      collectionId
      link
    }
  }
`

export const GetIsOwner = gql`
  query isOwner {
    signatureCollectionIsOwner {
      success
    }
  }
`
