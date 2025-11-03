import { Application } from '@island.is/application/types'

export interface MyPagesApplication extends Application {
  formSystemFormSlug?: string
  formSystemOrgSlug?: string
  formSystemOrgContentfulId?: string
  path?: string
  localhostPath?: string
  slug?: string
}
