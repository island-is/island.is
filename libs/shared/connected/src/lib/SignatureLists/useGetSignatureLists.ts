import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'
import { SignatureCollection } from '@island.is/api/schema'
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

export const useGetCurrentCollection = () => {
  const { data, loading } = useQuery<Query>(GetCurrentCollection)
  const collection = data?.signatureCollectionCurrent as SignatureCollection

  return { collection, loading }
}
