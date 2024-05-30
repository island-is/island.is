import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import {
  SignatureCollection,
  SignatureCollectionListBase,
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
      isActive
    }
  }
`
export const GetOpenLists = gql`
  query allOpenLists($input: SignatureCollectionIdInput!) {
    signatureCollectionAllOpenLists(input: $input) {
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
    }
  }
`

export const useGetCurrentCollection = () => {
  const { data, loading } = useQuery<Query>(GetCurrentCollection)
  const collection = data?.signatureCollectionCurrent as SignatureCollection

  return { collection, loading }
}

export const useGetOpenLists = (collection: SignatureCollection) => {
  const { data, loading: openListsLoading } = useQuery<Query>(GetOpenLists, {
    variables: {
      input: { collectionId: collection?.id },
    },
    skip: !collection || collection.isActive,
  })
  const openLists =
    data?.signatureCollectionAllOpenLists as SignatureCollectionListBase[]

  return { openLists, openListsLoading }
}
