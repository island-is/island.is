import chunk from 'lodash/chunk'
import {
  ApolloClient,
  DocumentNode,
  NormalizedCacheObject,
} from '@apollo/client'

export const formatPaymentTypeGroupTooltip = (
  codes: Array<string>,
  name: string,
  and: string,
) => {
  const list =
    codes.length > 1
      ? `${codes.slice(0, -1).join(', ')} ${and} ${codes[codes.length - 1]}`
      : codes[0] ?? ''

  return `${list} (${name})`
}

export const MAX_LOOKUP_BATCH = 100

export const resolveExisting = async <TData>(
  apolloClient: ApolloClient<NormalizedCacheObject>,
  query: DocumentNode,
  values: string[] | undefined,
  extractIds: (data: TData) => string[],
) => {
  if (!values?.length) return values
  const results = await Promise.all(
    chunk(values, MAX_LOOKUP_BATCH).map((lookup) =>
      apolloClient.query<TData, { lookup: string[]; limit: number }>({
        query,
        variables: { lookup, limit: lookup.length },
      }),
    ),
  )
  const found = new Set(results.flatMap(({ data }) => extractIds(data)))
  return values.filter((v) => found.has(v))
}
