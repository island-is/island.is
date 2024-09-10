export interface GraphqlError {
  message: string
  locations: string
  path: string
  extensions: {
    type: string
  }
}

export interface GraphqlFetchResponse<T> {
  data?: T
  error?: GraphqlError
}

export interface GraphqlErrorResponse {
  response: {
    errors?: Array<GraphqlError>
  }
}
