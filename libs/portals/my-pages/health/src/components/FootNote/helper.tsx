import { FormatMessage } from '@island.is/localization'
import { LinkButton } from '@island.is/portals/my-pages/core'
import { messages } from '../../lib/messages'
import {
  OCCUPATIONAL_THERAPY,
  PHYSIO_ACCIDENT_THERAPY,
  PHYSIO_HOME_THERAPY,
  PHYSIO_THERAPY,
  SPEECH_THERAPY,
} from '../../utils/constants'

export const getFootNoteByType = (
  type: string,
  formatMessage: FormatMessage,
) => {
  switch (type) {
    case PHYSIO_THERAPY:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str: React.ReactNode) => (
            <LinkButton
              to={formatMessage(messages['physioDisclaimerLink'])}
              text={String(str ?? '')}
            />
          ),
        }),
      }
      break
    case PHYSIO_ACCIDENT_THERAPY:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str: React.ReactNode) => (
            <LinkButton
              to={formatMessage(messages['physioDisclaimerLink'])}
              text={String(str ?? '')}
            />
          ),
        }),
      }
    case PHYSIO_HOME_THERAPY:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str: React.ReactNode) => (
            <LinkButton
              to={formatMessage(messages['physioDisclaimerLink'])}
              text={String(str ?? '')}
            />
          ),
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
          link: (str: React.ReactNode) => (
            <LinkButton
              to={formatMessage(messages['occupationalDisclaimerLink'])}
              text={String(str ?? '')}
            />
          ),
        }),
      }
    default:
      return {
        first: formatMessage(messages['physioDisclaimer1']),
        second: formatMessage(messages['physioDisclaimer2'], {
          link: (str: React.ReactNode) => (
            <LinkButton to="" text={String(str ?? '')} />
          ),
        }),
      }
  }
}
