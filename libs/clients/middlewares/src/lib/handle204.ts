import { FetchError } from './FetchError'
import { ApiResponse } from './types'

export const handle204 = <T>(
  promise: Promise<ApiResponse<T>>,
): Promise<T | null> => {
  return promise.then(
    (response) => {
      if (response.raw.status === 204) {
        return null
      }
      return response.value()
    },
    (error) => {
      if (error instanceof FetchError && error.status === 204) {
        return null
      }
      throw error
    },
  )
}
