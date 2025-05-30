import {
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { contractOptions } from '../../utils/options'

export const chooseContractSection = buildSection({
  condition: (answers, externalData) => {
    console.log(answers, externalData)
    return true
  },
  id: 'chooseContractSection',
  title: m.chooseContractMessages.title,
  children: [
    buildMultiField({
      id: 'chooseContract',
      title: m.chooseContractMessages.multiFieldTitle,
      description: m.chooseContractMessages.multiFieldDescription,
      children: [
        buildRadioField({
          id: 'rentalAgreement',
          options: contractOptions,
        }),
      ],
    }),
  ],
})
