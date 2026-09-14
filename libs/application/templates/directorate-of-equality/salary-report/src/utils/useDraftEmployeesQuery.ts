import { DocumentNode, useQuery } from '@apollo/client'
import type { Application } from '@island.is/application/types'
import type { Paging } from './types'

type PagedEmployeesResult<T> = { employees: T[]; paging: Paging }

// Shared Apollo wiring for the two live, paginated employee queries
// (with/without steps) — each screen supplies its own query document/field
// selection and response key, since the two DTOs differ in shape.
export const useDraftEmployeesQuery = <T>(
  query: DocumentNode,
  responseKey: string,
  application: Application,
  page: number,
  pageSize: number,
) => {
  const { data, loading, error, refetch } = useQuery<
    Record<string, PagedEmployeesResult<T>>
  >(query, {
    variables: {
      input: { applicationId: application.id, page, pageSize },
    },
    fetchPolicy: 'network-only',
  })

  const result = data?.[responseKey]

  return {
    employees: result?.employees ?? [],
    paging: result?.paging,
    loading,
    hasError: Boolean(error),
    refetch,
  }
}
