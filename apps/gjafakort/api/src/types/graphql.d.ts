import { FerdalagAPI, ApplicationAPI, RskAPI } from '../services'

export type User = {
  ssn: string
  mobile: string
}

export interface GraphQLContext {
  user?: User
}

export type Credentials = {
  user: User
  csrfToken: string
}

export type DataSource = {
  applicationApi: ApplicationAPI
  ferdalagApi: FerdalagAPI
  rskApi: RskAPI
}
