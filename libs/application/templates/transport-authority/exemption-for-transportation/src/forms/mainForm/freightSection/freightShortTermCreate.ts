import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { ExemptionFor } from '../../../shared'
import {
  formatNumber,
  getExemptionRules,
  isExemptionTypeShortTerm,
} from '../../../utils'
import { FreightHiddenInputs } from './freightHiddenInputs'

export const FreightShortTermCreateMultiField = buildMultiField({
  id: 'freightShortTermCreateMultiField',
  condition: (answers) => {
    return isExemptionTypeShortTerm(answers)
  },
  title: freight.create.pageTitle,
  description: freight.create.description,
  children: [
    ...FreightHiddenInputs,
    buildDescriptionField({
      id: 'freight.subtitle',
      title: freight.labels.freightSubtitle,
      titleVariant: 'h5',
    }),
    buildTextField({
      id: 'freight.items[0].name',
      title: freight.labels.freightName,
      backgroundColor: 'blue',
      width: 'full',
      maxLength: 100,
      required: true,
    }),
    buildTextField({
      id: 'freight.items[0].length',
      title: freight.labels.freightLength,
      backgroundColor: 'blue',
      width: 'half',
      variant: 'number',
      required: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildTextField({
      id: 'freight.items[0].weight',
      title: freight.labels.freightWeight,
      backgroundColor: 'blue',
      width: 'half',
      variant: 'number',
      required: true,
      suffix: freight.labels.tonsSuffix,
    }),
    buildDescriptionField({
      id: 'freightWithConvoy.subtitle',
      title: freight.labels.withConvoySubtitle,
      titleVariant: 'h5',
    }),
    buildTextField({
      id: 'freight.items[0].height',
      title: freight.labels.heightWithConvoy,
      backgroundColor: 'blue',
      width: 'half',
      variant: 'number',
      required: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildTextField({
      id: 'freight.items[0].width',
      title: freight.labels.widthWithConvoy,
      backgroundColor: 'blue',
      width: 'half',
      variant: 'number',
      required: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildTextField({
      id: 'freight.items[0].totalLength',
      title: freight.labels.totalLengthWithConvoy,
      backgroundColor: 'blue',
      width: 'full',
      variant: 'number',
      required: true,
      suffix: freight.labels.metersSuffix,
    }),
    buildAlertMessageField({
      id: 'freightShortTermPoliceEscortAlertMessage',
      alertType: 'info',
      title: freight.create.policeEscortAlertTitle,
      message: (application) => {
        const rules = getExemptionRules(application.externalData)
        return {
          ...freight.create.policeEscortAlertMessage,
          values: {
            maxLength: formatNumber(rules?.policeEscort.maxLength),
            maxHeight: formatNumber(rules?.policeEscort.maxHeight),
            maxWidth: formatNumber(rules?.policeEscort.maxWidth),
          },
        }
      },
      condition: (answers, externalData) => {
        const rules = getExemptionRules(externalData)
        const maxHeight = rules?.policeEscort.maxHeight
        const maxWidth = rules?.policeEscort.maxWidth
        const maxLength = rules?.policeEscort.maxLength
        const height = getValueViaPath<string>(
          answers,
          'freight.items.0.height',
        )
        const width = getValueViaPath<string>(answers, 'freight.items.0.width')
        const length = getValueViaPath<string>(
          answers,
          'freight.items.0.length',
        )

        return (
          (height && maxHeight ? Number(height) > maxHeight : false) ||
          (width && maxWidth ? Number(width) > maxWidth : false) ||
          (length && maxLength ? Number(length) > maxLength : false)
        )
      },
    }),
    buildDescriptionField({
      id: 'freightWithConvoy.subtitle',
      title: freight.labels.exemptionFor,
      titleVariant: 'h5',
    }),
    buildCheckboxField({
      id: 'freight.items[0].exemptionFor',
      large: true,
      backgroundColor: 'blue',
      split: '1/2',
      options: [
        {
          value: ExemptionFor.WIDTH,
          label: freight.exemptionFor.widthOptionTitle,
        },
        {
          value: ExemptionFor.HEIGHT,
          label: freight.exemptionFor.heightOptionTitle,
        },
        {
          value: ExemptionFor.LENGTH,
          label: freight.exemptionFor.lengthOptionTitle,
        },
        {
          value: ExemptionFor.WEIGHT,
          label: freight.exemptionFor.weightOptionTitle,
        },
      ],
    }),
  ],
})
