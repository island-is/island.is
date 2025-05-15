import {
  buildAlertMessageField,
  buildMultiField,
  buildRadioField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { TerminationTypes } from '../../utils/constants'
export const terminationTypeSection = buildSection({
  id: 'terminationTypeSection',
  title: m.terminationTypeMessages.title,
  children: [
    buildMultiField({
      id: 'terminationTypeMultiField',
      title: m.terminationTypeMessages.title,
      description: m.terminationTypeMessages.multiFieldDescription,
      children: [
        buildAlertMessageField({
          condition: (answers) => {
            const terminationType = getValueViaPath(answers, 'terminationType')
            return terminationType === TerminationTypes.DISMISSAL
          },
          id: 'alertMessage',
          title: m.terminationTypeMessages.terminationWithNoticeLabel,
          message:
            m.terminationTypeMessages.terminationWithNoticeAlertDescription,
          alertType: 'info',
        }),
        buildAlertMessageField({
          condition: (answers) => {
            const terminationType = getValueViaPath(answers, 'terminationType')
            return terminationType === TerminationTypes.CANCELATION
          },
          id: 'alertMessage',
          title: m.terminationTypeMessages.terminationWithoutNoticeLabel,
          message:
            m.terminationTypeMessages.terminationWithoutNoticeAlertDescription,
          alertType: 'info',
        }),
        buildRadioField({
          id: 'terminationType',
          options: [
            {
              value: TerminationTypes.DISMISSAL, // Uppsögn
              label: m.terminationTypeMessages.terminationWithNoticeLabel,
            },
            {
              value: TerminationTypes.CANCELATION, // Riftun
              label: m.terminationTypeMessages.terminationWithoutNoticeLabel,
            },
          ],
        }),
      ],
    }),
  ],
})
