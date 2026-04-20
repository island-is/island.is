import { FetchError } from './FetchError'

export const handle404 = (error: Error): null => {
  if (error instanceof FetchError && error.status === 404) {
    return null
  }
  throw error
}
