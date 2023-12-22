import {
  buildSection,
  buildSubSection,
  buildSubmitField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { sellerSubSection } from './sellerSubSection'
import { buyerSubSection } from './buyerSubSection'
import { machineSubSection } from './machineSubSection'
import { pickMachineSubSection } from './pickMachineSubSection'
import { isPaymentRequiredSubSection } from '../../../utils/isPaymentRequired'
import { DefaultEvents } from '@island.is/application/types'

export const informationSection = buildSection({
  id: 'informationSection',
  title: information.general.sectionTitle,
  children: [
    pickMachineSubSection,
    machineSubSection,
    sellerSubSection,
    buyerSubSection,
    buildSubSection({
      id: 'confirmation',
      condition: (_, externalData) =>
        !isPaymentRequiredSubSection(_, externalData),
      title: 'confirmation',
      children: [
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: 'confirmation',
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: 'confirmation',
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
