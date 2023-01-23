import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { BASE_URL } from './networking'

const defaultTimeout = 22000

async function _fetch(...fetchArgs: Parameters<typeof fetch>) {
  const [input, init] = fetchArgs
  const abortController = new AbortController()

  setTimeout(() => {
    abortController.abort()
  }, defaultTimeout)

  const result = await fetch(input, { ...init, signal: abortController.signal })
  return result
}

export const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    return headers
  },
  fetchFn: _fetch,
})
