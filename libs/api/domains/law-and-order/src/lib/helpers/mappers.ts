import {
  DefenderInfoDefenderChoiceEnum,
  StateTagColorEnum,
  SubpoenaDataDefaultDefenderChoiceEnum,
  UpdateSubpoenaDtoDefenderChoiceEnum,
} from '@island.is/clients/judicial-system-sp'
import { CourtCaseStateTagColorEnum } from '../../models/courtCases.model'
import { DefenseChoiceEnum } from '../../models/defenseChoiceEnum.model'
import { m } from '../messages'

// Maps the application's internal representation of defense choices to the judicial system's representation.
export const mapDefenseChoice = (
  choice: DefenseChoiceEnum,
): UpdateSubpoenaDtoDefenderChoiceEnum => {
  switch (choice) {
    // Each case maps a local enum value to the corresponding value in the judicial system's enum.
    case DefenseChoiceEnum.CHOOSE:
      return UpdateSubpoenaDtoDefenderChoiceEnum.CHOOSE
    case DefenseChoiceEnum.WAIVE:
      return UpdateSubpoenaDtoDefenderChoiceEnum.WAIVE
    case DefenseChoiceEnum.DELAY:
      return UpdateSubpoenaDtoDefenderChoiceEnum.DELAY
    case DefenseChoiceEnum.DELEGATE:
      return UpdateSubpoenaDtoDefenderChoiceEnum.DELEGATE
    default:
      // Provides a default mapping if the input doesn't match any known value.
      return UpdateSubpoenaDtoDefenderChoiceEnum.DELAY
  }
}

// Maps the application's internal representation of defense choices to the judicial system's representation.
export const mapDefenseChoiceForSummon = (
  choice?: DefenderInfoDefenderChoiceEnum,
): DefenseChoiceEnum => {
  switch (choice) {
    // Each case maps a local enum value to the corresponding value in the judicial system's enum.
    case DefenderInfoDefenderChoiceEnum.CHOOSE:
      return DefenseChoiceEnum.CHOOSE
    case DefenderInfoDefenderChoiceEnum.WAIVE:
      return DefenseChoiceEnum.WAIVE
    case DefenderInfoDefenderChoiceEnum.DELAY:
      return DefenseChoiceEnum.DELAY
    case DefenderInfoDefenderChoiceEnum.DELEGATE:
      return DefenseChoiceEnum.DELEGATE
    default:
      // Provides a default mapping if the input doesn't match any known value.
      return DefenseChoiceEnum.DELAY
  }
}

// Maps the application's internal representation of defense choices to the judicial system's representation.
export const mapDefenseChoiceForSummonDefaultChoice = (
  choice?: SubpoenaDataDefaultDefenderChoiceEnum,
): DefenseChoiceEnum => {
  switch (choice) {
    // Each case maps a local enum value to the corresponding value in the judicial system's enum.
    case SubpoenaDataDefaultDefenderChoiceEnum.CHOOSE:
      return DefenseChoiceEnum.CHOOSE
    case SubpoenaDataDefaultDefenderChoiceEnum.WAIVE:
      return DefenseChoiceEnum.WAIVE
    case SubpoenaDataDefaultDefenderChoiceEnum.DELAY:
      return DefenseChoiceEnum.DELAY
    case SubpoenaDataDefaultDefenderChoiceEnum.DELEGATE:
      return DefenseChoiceEnum.DELEGATE
    default:
      // Provides a default mapping if the input doesn't match any known value.
      return DefenseChoiceEnum.DELAY
  }
}

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

interface Choice {
  message: {
    id: string
    defaultMessage: string
  }
}

// Get localized messages for defense choices in Subpoena
export const DefenseChoices: Record<DefenseChoiceEnum, Choice> = {
  WAIVE: {
    message: m.waiveMessage,
  },
  CHOOSE: {
    message: m.chooseMessage,
  },
  DELAY: {
    message: m.delayMessage,
  },
  DELEGATE: {
    message: {
      id: 'api.law-and-order:choose-for-me',
      defaultMessage: 'Ég fel dómara málsins að tilnefna og skipa mér verjanda',
    },
  },
}
