import { useCallback } from 'react'
import {
  DocumentNode,
  OperationVariables,
  useApolloClient,
} from '@apollo/client'

export const useLazyQuery = <
  TData,
  TVariables extends OperationVariables = OperationVariables,
>(
  query: DocumentNode,
) => {
  const client = useApolloClient()

  return useCallback(
    (variables: TVariables) =>
      client.query<TData, TVariables>({
        query,
        variables,
      }),
    [client, query],
  )
}
