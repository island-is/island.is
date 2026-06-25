export type ContentfulFetchResponse<T> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: unknown
    }
