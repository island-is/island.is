import { TagVariant } from '@island.is/island-ui/core'
import { CaseState } from '@island.is/judicial-system/types'

export const mapCaseStateToTagVariant = (
  state: CaseState,
  isCourtRole: boolean,
  isValidToDateInThePast?: boolean,
): { color: TagVariant; text: string } => {
  switch (state) {
    case CaseState.NEW:
    case CaseState.DRAFT:
      return { color: 'red', text: 'Drög' }
    case CaseState.SUBMITTED:
      return {
        color: 'purple',
        text: `${isCourtRole ? 'Ný krafa' : 'Krafa send'}`,
      }
    case CaseState.RECEIVED:
      return { color: 'blueberry', text: 'Krafa móttekin' }
    case CaseState.ACCEPTED:
      if (isValidToDateInThePast) {
        return {
          color: 'darkerBlue',
          text: 'Lokið',
        }
      } else {
        return {
          color: 'blue',
          text: 'Virkt',
        }
      }
    case CaseState.REJECTED:
      return { color: 'rose', text: 'Kröfu hafnað' }
    default:
      return { color: 'white', text: 'Óþekkt' }
  }
}
