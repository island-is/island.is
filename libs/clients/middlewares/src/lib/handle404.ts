import { FetchError } from './FetchError'

export function handle404(error: Error) {
  if (error instanceof FetchError && error.status === 404) {
    return null
  }
  throw error
}
