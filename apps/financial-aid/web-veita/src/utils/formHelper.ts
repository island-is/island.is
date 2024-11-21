import { ApplicationState } from '@island.is/financial-aid/shared/lib'

export const getTagByState = (state: ApplicationState) => {
  switch (state) {
    case ApplicationState.NEW:
      return 'new'
    case ApplicationState.INPROGRESS:
      return 'processing'
    case ApplicationState.APPROVED:
      return 'approved'
    case ApplicationState.REJECTED:
      return 'outDatedOrDenied'
    case ApplicationState.DATANEEDED:
      return 'outDatedOrDenied'
  }
}
