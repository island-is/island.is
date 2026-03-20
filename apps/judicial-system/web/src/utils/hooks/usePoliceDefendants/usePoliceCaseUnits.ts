import { gql, useQuery } from '@apollo/client'

const PoliceCaseUnitsDocument = gql`
  query PoliceCaseUnits($input: PoliceCaseUnitsQueryInput!) {
    policeCaseUnits(input: $input)
  }
`

/**
 * Fetches case units (malseiningar) from the dedicated police API for a case and each defendant national ID.
 * Call after defendants are synced (e.g. useSyncDefendantsFromPolice). Response is only logged for now.
 */
export const usePoliceCaseUnits = (
  caseId: string | undefined,
  nationalIds: string[] | undefined,
) => {
  return useQuery<{ policeCaseUnits?: unknown }>(PoliceCaseUnitsDocument, {
    variables: { input: { caseId: caseId ?? '', nationalIds: nationalIds ?? [] } },
    skip: !caseId || !nationalIds?.length,
    fetchPolicy: 'cache-first',
    onCompleted: (data) => {
      if (data?.policeCaseUnits != null) {
        // eslint-disable-next-line no-console
        console.log(
          'Police case units (GetRVMalseiningar) raw response:',
          data.policeCaseUnits,
        )
      }
    },
  })
}
