import { handle404 } from '../handle404'

type Exclude204<T> = T extends { readonly statusCode?: number } ? never : T

type DataOf<T> = T extends { data: unknown }
  ? Exclude<T['data'], undefined>
  : never

export const dataOr204Null = async <
  T extends { data: unknown; response: { status: number } },
>(
  promise: Promise<T>,
): Promise<Exclude204<DataOf<T>> | null> => {
  const result = await promise
  if (result.response.status === 204) {
    return null
  }
  return result.data as Exclude204<DataOf<T>>
}

export const dataOr404Null = <T extends { data: unknown }>(
  promise: Promise<T>,
): Promise<DataOf<T> | null> => {
  return data(promise).catch(handle404)
}

export const data = <T extends { data: unknown }>(
  promise: Promise<T>,
): Promise<DataOf<T>> => {
  return promise.then((response) => response.data as DataOf<T>)
}
