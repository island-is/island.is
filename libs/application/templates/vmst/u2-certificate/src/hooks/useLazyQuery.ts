import {
  DocumentNode,
  OperationVariables,
  useApolloClient,
} from '@apollo/client'
import { useCallback } from 'react'

export const useLazyQuery = <
  TData = unknown,
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
