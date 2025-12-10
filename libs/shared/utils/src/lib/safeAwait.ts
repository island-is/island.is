type Success<T> = {
  data: T
  error: null
}

type Failure<E> = {
  data: null
  error: E
}

type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * Safely awaits a promise and captures the result in a standardized Result object.
 *
 * This utility provides a type-safe alternative to traditional try/catch blocks around `await`.
 * Instead of throwing on error, it returns a structured object representing either success or failure,
 * making it easier to handle asynchronous logic without exceptions.
 */
export const safeAwait = async <T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> => {
  try {
    const data = await promise

    return {
      data,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error as E,
    }
  }
}
