import { m } from '../messages'
import { DefenseChoiceEnum } from '../models/law-and-order/defenseChoiceEnum.model'
import { Choice } from '../types/types'

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
