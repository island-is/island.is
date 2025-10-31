import { StateTagColorEnum } from '@island.is/clients/judicial-system-sp'
import { CourtCaseStateTagColorEnum } from '../models/law-and-order/courtCases.model'

export const mapTagTypes = (
  color?: StateTagColorEnum,
): CourtCaseStateTagColorEnum => {
  switch (color) {
    case StateTagColorEnum.Blue:
      return CourtCaseStateTagColorEnum.blue
    case StateTagColorEnum.Blueberry:
      return CourtCaseStateTagColorEnum.blueberry
    case StateTagColorEnum.DarkerBlue:
      return CourtCaseStateTagColorEnum.darkerBlue
    case StateTagColorEnum.Disabled:
      return CourtCaseStateTagColorEnum.disabled
    case StateTagColorEnum.Dark:
      return CourtCaseStateTagColorEnum.dark
    case StateTagColorEnum.Mint:
      return CourtCaseStateTagColorEnum.mint
    case StateTagColorEnum.Purple:
      return CourtCaseStateTagColorEnum.purple
    case StateTagColorEnum.Red:
      return CourtCaseStateTagColorEnum.red
    case StateTagColorEnum.Rose:
      return CourtCaseStateTagColorEnum.rose
    case StateTagColorEnum.Warn:
      return CourtCaseStateTagColorEnum.warn
    case StateTagColorEnum.White:
      return CourtCaseStateTagColorEnum.white
    case StateTagColorEnum.Yellow:
      return CourtCaseStateTagColorEnum.yellow

    default:
      return CourtCaseStateTagColorEnum.blue
  }
}
