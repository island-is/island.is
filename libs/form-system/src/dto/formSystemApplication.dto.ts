import { Application } from '@island.is/application/types'

export interface FormSystemApplication extends Application {
  formSlug: string
  orgSlug: string
  orgContentfulId: string
}
