import { Button } from '@island.is/island-ui/core'
import { FormatMessage } from '@island.is/localization'
import { messages } from '../../lib/messages'
import {
  OCCUPATIONAL_THERAPY,
  PHYSIO_ACCIDENT_THERAPY,
  PHYSIO_HOME_THERAPY,
  PHYSIO_THERAPY,
  SPEECH_THERAPY,
} from '../../utils/constants'

//TODO: Get correct paths from Sjúkratryggingar
const button = (text: string[], to?: string) => (
  <a href={to ?? ''} target="_blank" rel="noreferrer">
    <Button size="small" variant="text">
      {text}
    </Button>
  </a>
)

export const getFootNoteByType = (
  type: string,
  formatMessage: FormatMessage,
) => {
  switch (type) {
    case PHYSIO_THERAPY:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) =>
            button(str, formatMessage(messages['physioDisclaimerLink'])),
        }),
      }
      break
    case PHYSIO_ACCIDENT_THERAPY:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
      }
    case PHYSIO_HOME_THERAPY:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
      }
    case SPEECH_THERAPY:
      return {
        first: formatMessage(messages['speechDisclaimer1']),
        second: formatMessage(messages['speechDisclaimer2']),
      }
    case OCCUPATIONAL_THERAPY:
      return {
        first: formatMessage(messages['occupationalDisclaimer'], {
          link: (str) =>
            button(str, formatMessage(messages['occupationalDisclaimerLink'])),
        }),
      }
    default:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
      }
  }
}
