import {
  buildAlertMessageField,
  buildForm,
  buildMessageWithLinkButtonField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { FjarsyslaRikisinsLogo } from '@island.is/application/assets/institution-logos'
import { conclusion as m, sections } from '../../lib/messages'
import { SUPPORT_EMAIL_LINK } from '../../utils/constants'
import {
  employmentHistoryStubSection,
  externalDataStubSection,
  personalInformationStubSection,
} from '../stubSections'
import { buildWhatNextField } from '../whatNextField'

/**
 * Closed without a certificate (202 `closed`). The API only answers this when
 * a key is replayed for a case staff have closed.
 */
export const ClosedForm = buildForm({
  id: 'closedForm',
  mode: FormModes.REJECTED,
  logo: FjarsyslaRikisinsLogo,
  children: [
    externalDataStubSection,
    personalInformationStubSection,
    employmentHistoryStubSection,
    buildSection({
      id: 'conclusion',
      title: sections.conclusion,
      children: [
        buildMultiField({
          id: 'closedMultiField',
          title: m.title,
          children: [
            buildAlertMessageField({
              id: 'closedAlert',
              alertType: 'info',
              title: m.closedTitle,
              message: m.closedMessage,
            }),
            buildWhatNextField({
              title: m.closedWhatNextHeader,
              introText: m.closedWhatNextIntro,
              description: m.closedWhatNextDescription,
            }),
            buildMessageWithLinkButtonField({
              id: 'contactLink',
              url: SUPPORT_EMAIL_LINK,
              message: m.closedActionMessage,
              buttonTitle: m.contactButton,
              marginTop: 4,
            }),
          ],
        }),
      ],
    }),
  ],
})
