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
const button = (str: any) => (
  <a href="" target="_blank" rel="noreferrer">
    <Button size="small" variant="text">
      {str}
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
          link: (str) => button(str),
        }),
        third: formatMessage(messages['physioDisclaimer3']),
      }
      break
    case PHYSIO_ACCIDENT_THERAPY:
      //TODO: Get correct disclaimer for different therapies
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
        third: formatMessage(messages['physioDisclaimer3']),
      }
      break
    case PHYSIO_HOME_THERAPY:
      //TODO: Get correct disclaimer for different therapies

      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
        third: formatMessage(messages['physioDisclaimer3']),
      }
      break
    case SPEECH_THERAPY:
      //TODO: Get correct disclaimer for different therapies

      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
        third: formatMessage(messages['physioDisclaimer3']),
      }
      break
    case OCCUPATIONAL_THERAPY:
      //TODO: Get correct disclaimer for different therapies
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
        third: formatMessage(messages['physioDisclaimer3']),
      }
      break
    default:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str) => button(str),
        }),
        third: formatMessage(messages['physioDisclaimer3']),
      }
      break
  }
}
