import {
  DocumentNode,
  OperationVariables,
  useApolloClient,
} from '@apollo/client'
import { MachineDto } from '@island.is/clients/work-machines'
import { useCallback } from 'react'

export const useLazyQuery = <
  TData = MachineDto,
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
