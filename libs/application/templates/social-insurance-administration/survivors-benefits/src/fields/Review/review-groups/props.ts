import { Application, FormValue } from '@island.is/application/types'

export interface ReviewGroupProps {
  application: Application<FormValue>
  editable: boolean
  groupHasNoErrors: (ids: string[]) => boolean
  hasError: (id: string) => string
  goToScreen?: (id: string) => void
}