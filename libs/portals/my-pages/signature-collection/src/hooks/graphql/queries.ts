import gql from 'graphql-tag'

export const GetListById = gql`
  query ListById($input: SignatureCollectionListIdInput!) {
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
  query Signatures($input: SignatureCollectionListIdInput!) {
    signatureCollectionSignatures(input: $input) {
      id
      listId
      signee {
        name
        nationalId
        address
      }
      isDigital
      valid
      created
      pageNumber
    }
  }
`

export const GetSignedList = gql`
  query signedList($input: SignatureCollectionBaseInput!) {
    signatureCollectionSignedList(input: $input) {
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
      isDigital
      pageNumber
      signedDate
      active
      isValid
      collectionId
      canUnsign
      slug
      signedDate
    }
  }
`

export const GetIsOwner = gql`
  query isOwner($input: SignatureCollectionBaseInput!) {
    signatureCollectionIsOwner(input: $input) {
      success
    }
  }
`

export const GetListsForUser = gql`
  query listsForUser($input: SignatureCollectionIdInput!) {
    signatureCollectionListsForUser(input: $input) {
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
      active
      collectionId
      slug
      numberOfSignatures
    }
  }
`

export const GetListsForOwner = gql`
  query listsForOwner($input: SignatureCollectionIdInput!) {
    signatureCollectionListsForOwner(input: $input) {
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
      maxReached
    }
  }
`

export const GetCurrentCollection = gql`
  query currentCollection($input: SignatureCollectionBaseInput!) {
    signatureCollectionCurrent(input: $input) {
      id
      endTime
      startTime
      name
      isActive
      collectionType
      status
      areas {
        id
        name
        min
        max
      }
    }
  }
`

export const GetCanSign = gql`
  query Query($input: SignatureCollectionCanSignFromPaperInput!) {
    signatureCollectionCanSignFromPaper(input: $input)
  }
`

export const GetCollectors = gql`
  query SignatureCollectionCollectors($input: SignatureCollectionBaseInput!) {
    signatureCollectionCollectors(input: $input) {
      nationalId
      name
    }
  }
`

export const getPdfReport = gql`
  query SignatureCollectionOverview($input: SignatureCollectionListIdInput!) {
    signatureCollectionListOverview(input: $input) {
      candidateName
      listName
      partyBallotLetter
      nrOfSignatures
      nrOfDigitalSignatures
      nrOfPaperSignatures
    }
  }
`
