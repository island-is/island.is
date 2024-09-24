import { DefenseChoiceEnum } from '../../models/defenseChoiceEnum.model'
import { UpdateSubpoenaDtoDefenderChoiceEnum } from '@island.is/clients/judicial-system-sp'

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

interface Choice {
  message: {
    id: string
    defaultMessage: string
  }
}

// Get localized messages for defense choices in Subpoena
export const DefenseChoices: Record<DefenseChoiceEnum, Choice> = {
  WAIVE: {
    message: {
      id: 'api.law-and-order:no-defender',
      defaultMessage: 'Ég óska ekki eftir verjanda',
    },
  },
  CHOOSE: {
    message: {
      id: 'api.law-and-order:choosing-lawyer',
      defaultMessage:
        'Ég óska þess að valinn lögmaður verði skipaður verjandi minn',
    },
  },
  DELAY: {
    message: {
      id: 'api.law-and-order:delay-choice',
      defaultMessage:
        'Ég óska eftir fresti fram að þingfestingu til þess að tilnefna verjanda',
    },
  },
  DELEGATE: {
    message: {
      id: 'api.law-and-order:choose-for-me',
      defaultMessage: 'Ég fel dómara málsins að tilnefna og skipa mér verjanda',
    },
  },
}
