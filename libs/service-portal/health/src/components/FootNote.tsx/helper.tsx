import { Button } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'
import { messages } from '../../lib/messages'
import {
  LIGHT_THERAPY,
  OCCUPATIONAL_THERAPY,
  PHYSIO_ACCIDENT_THERAPY,
  PHYSIO_HOME_THERAPY,
  PHYSIO_THERAPY,
  SPEECH_THERAPY,
} from '../../utils/constants'

const button = (str: any) => (
  <a href="" target="_blank" rel="noreferrer">
    <Button size="small" variant="text">
      {str}
    </Button>
  </a>
)
const defaultText = (formatMessage: FormatMessage) => {
  return {
    first: formatMessage(messages.therapyDisclaimer1),
    second: formatMessage(messages.therapyDisclaimer2, {
      link: (str) => button(str),
    }),
    third: formatMessage(messages.therapyDisclaimer3),
    fourth: formatMessage(messages.therapyDisclaimer4, {
      link: (str) => button(str),
    }),
  }
}
export const getFootNoteByType = (
  type: string,
  formatMessage: FormatMessage,
) => {
  switch (type) {
    case PHYSIO_THERAPY:
      return defaultText(formatMessage)
      break
    case PHYSIO_ACCIDENT_THERAPY:
      return defaultText(formatMessage)
      break
    case PHYSIO_HOME_THERAPY:
      return defaultText(formatMessage)
      break
    case SPEECH_THERAPY:
      return defaultText(formatMessage)
      break
    case LIGHT_THERAPY:
      return defaultText(formatMessage)
      break
    case OCCUPATIONAL_THERAPY:
      return defaultText(formatMessage)
      break
    default:
      return defaultText(formatMessage)
      break
  }
}
