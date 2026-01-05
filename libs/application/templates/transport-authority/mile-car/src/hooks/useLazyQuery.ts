import {
  DocumentNode,
  OperationVariables,
  useApolloClient,
} from '@apollo/client'
import { useCallback } from 'react'

export const useLazyQuery = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TData = any,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client],
  )
}
