import { Application, InstitutionTypes } from '@island.is/application/types'

export interface MyPagesApplication extends Application {
  formSystemFormSlug?: string
  formSystemOrgSlug?: InstitutionTypes
  formSystemOrgContentfulId?: string
  path?: string
  localhostPath?: string
  slug?: string
}
