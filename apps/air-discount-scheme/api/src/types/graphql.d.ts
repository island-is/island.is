export type User = {
  ssn: string
  mobile: string
  name: string
}

export interface GraphQLContext {
  user?: User
}

export type Credentials = {
  user: User
  csrfToken: string
}
