import {
  buildDescriptionField,
  buildMultiField,
  buildSubSection,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { SubSection } from '@island.is/application/types'
import {
  getFreightItem,
  isExemptionTypeLongTerm,
  MAX_CNT_FREIGHT,
} from '../../../utils'

const FreightPairingSubSection = (index: number) =>
  buildSubSection({
    id: `freightLongTermPairingSubSection${index}`,
    condition: (answers) => {
      return (
        isExemptionTypeLongTerm(answers) && !!getFreightItem(answers, index)
      )
    },
    title: (application) => {
      const freightItem = getFreightItem(application.answers, index)
      return {
        ...freight.pairing.subSectionTitle,
        values: {
          freightNumber: index + 1,
          freightName: freightItem?.name,
        },
      }
    },
    children: [
      buildMultiField({
        id: `freightLongTermPairingMultiField${index}`,
        title: (application) => {
          const freightItem = getFreightItem(application.answers, index)
          return {
            ...freight.pairing.pageTitle,
            values: {
              freightNumber: index + 1,
              freightName: freightItem?.name,
            },
          }
        },
        children: [
          buildDescriptionField({
            id: `description${index}`,
            title: `lorem ipsum ${index}`,
          }),
        ],
      }),
    ],
  })

export const FreightLongTermPairingSubSections: SubSection[] = [
  ...Array(MAX_CNT_FREIGHT),
].map((_key, index) => {
  return FreightPairingSubSection(index)
})
