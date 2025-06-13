import { buildHiddenInput } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { getExemptionRulesLimitations } from '../../../utils'

export const FreightCommonHiddenInputs = (id: string) => [
  buildHiddenInput({
    id: `${id}.limit.maxLength`,
    defaultValue: (application: Application) => {
      return getExemptionRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxLength
    },
  }),
  buildHiddenInput({
    id: `${id}.limit.maxWeight`,
    defaultValue: (application: Application) => {
      return getExemptionRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxWeight
    },
  }),
  buildHiddenInput({
    id: `${id}.limit.maxHeight`,
    defaultValue: (application: Application) => {
      return getExemptionRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxHeight
    },
  }),
  buildHiddenInput({
    id: `${id}.limit.maxWidth`,
    defaultValue: (application: Application) => {
      return getExemptionRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxWidth
    },
  }),
  buildHiddenInput({
    id: `${id}.limit.maxTotalLength`,
    defaultValue: (application: Application) => {
      return getExemptionRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxTotalLength
    },
  }),
]
