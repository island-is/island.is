import gql from 'graphql-tag'

export const signatureMembers = gql`
  fragment SignatureMember on OfficialJournalOfIcelandApplicationSignatureMember {
    __typename
    name
    above
    after
    before
    below
  }
`
