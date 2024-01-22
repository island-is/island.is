import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import {
  SignatureCollection,
  SignatureCollectionList,
} from '@island.is/api/schema'
import { Query } from '@island.is/api/schema'

export const GetCurrentCollection = gql`
  query currentCollection {
    signatureCollectionCurrent {
      id
      endTime
      startTime
      name
      areas {
        id
        name
        min
        max
      }
      candidates {
        id
        nationalId
        collectionId
        name
      }
    }
  }
`
export const GetOpenLists = gql`
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
      candidate {
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

export const useGetCurrentCollection = () => {
  const { data, loading } = useQuery<Query>(GetCurrentCollection)
  const collection = data?.signatureCollectionCurrent as SignatureCollection

  return { collection, loading }
}

export const useGetOpenLists = () => {
  const { data, loading } = useQuery<Query>(GetOpenLists)
  const openLists =
    data?.signatureCollectionAllOpenLists as SignatureCollectionList[]

  return { openLists, loading }
}
