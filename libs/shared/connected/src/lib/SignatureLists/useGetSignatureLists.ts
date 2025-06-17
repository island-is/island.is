import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import {
  SignatureCollection,
  SignatureCollectionCollectionType,
  SignatureCollectionListBase,
} from '@island.is/api/schema'
import { Query } from '@island.is/api/schema'

export const GetLatestCollectionForType = gql`
  query collectionLatestForType($input: SignatureCollectionCollectionType!) {
    signatureCollectionLatestForType(input: $input) {
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

export const useGetLatestCollectionForType = (
  collectionType: SignatureCollectionCollectionType,
) => {
  const { data, loading } = useQuery<Query>(GetLatestCollectionForType, {
    variables: {
      input: {
        collectionType,
      },
    },
  })
  const collection =
    data?.signatureCollectionLatestForType as SignatureCollection

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
