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
      candidate {
        id
        nationalId
        name
        phone
        email
      }
      collectors {
        nationalId
        name
      }
      active
      collectionId
      slug
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
        address
      }
      signatureType
      active
      created
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
      candidate {
        id
        nationalId
        name
        phone
        email
      }
      collectors {
        nationalId
        name
      }
      active
      collectionId
      slug
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

export const GetListsForUser = gql`
  query listsForUser {
    signatureCollectionListsForUser {
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
      candidate {
        id
        nationalId
        name
        phone
        email
      }
      collectors {
        nationalId
        name
      }
      active
      collectionId
      slug
      numberOfSignatures
    }
  }
`
