import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { SignatureCollectionList } from '@island.is/api/schema'
import { Query } from '@island.is/api/schema'

export const GetSignatureLists = gql`
  query allOpenLists {
    signatureCollectionAllOpenLists {
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

export const useGetSignatureLists = () => {
  const { data, loading } = useQuery<Query>(GetSignatureLists)
  const lists =
    data?.signatureCollectionAllOpenLists ?? ([] as SignatureCollectionList[])

  return { lists, loading }
}
