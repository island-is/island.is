import { buildHiddenInput } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import {
  getApplicationRulesLimitations,
  getExemptionType,
} from '../../../utils'

export const FreightHiddenInputs = [
  buildHiddenInput({
    id: 'freight.exemptionPeriodType',
    defaultValue: (application: Application) => {
      return getExemptionType(application.answers)
    },
  }),
  buildHiddenInput({
    id: 'freight.limit.maxLength',
    defaultValue: (application: Application) => {
      return getApplicationRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxLength
    },
  }),
  buildHiddenInput({
    id: 'freight.limit.maxWeight',
    defaultValue: (application: Application) => {
      return getApplicationRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxWeight
    },
  }),
  buildHiddenInput({
    id: 'freight.limit.maxHeight',
    defaultValue: (application: Application) => {
      return getApplicationRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxHeight
    },
  }),
  buildHiddenInput({
    id: 'freight.limit.maxWidth',
    defaultValue: (application: Application) => {
      return getApplicationRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxWidth
    },
  }),
  buildHiddenInput({
    id: 'freight.limit.maxTotalLength',
    defaultValue: (application: Application) => {
      return getApplicationRulesLimitations(
        application.externalData,
        application.answers,
      )?.maxTotalLength
    },
  }),
]
