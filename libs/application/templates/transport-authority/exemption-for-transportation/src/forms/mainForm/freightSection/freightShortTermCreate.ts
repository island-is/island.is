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
  getApplicationRules,
  isExemptionTypeShortTerm,
} from '../../../utils'
import { FreightHiddenInputs } from './freightHiddenInputs'

export const FreightShortTermCreateMultiField = buildMultiField({
  id: 'freightShortTermCreateMultiField',
  condition: (answers) => {
    return isExemptionTypeShortTerm(answers)
  },
  title: freight.create.pageTitle,
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
    buildDescriptionField({
      id: 'freightWithConvoy.subtitle',
      description: freight.labels.exemptionFor,
      titleVariant: 'h5',
    }),
    buildCheckboxField({
      id: 'freight.items[0].exemptionFor',
      large: false,
      backgroundColor: 'white',
      split: '1/4',
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
    buildAlertMessageField({
      id: 'freightShortTermPoliceEscortAlertMessage',
      alertType: 'info',
      title: freight.create.policeEscortAlertTitle,
      message: (application) => {
        const rules = getApplicationRules(application.externalData)
        return {
          ...freight.create.policeEscortAlertMessage,
          values: {
            maxLength: formatNumber(rules?.policeEscort.length),
            maxHeight: formatNumber(rules?.policeEscort.height),
            maxWidth: formatNumber(rules?.policeEscort.width),
          },
        }
      },
      condition: (answers, externalData) => {
        const rules = getApplicationRules(externalData)
        const maxHeight = rules?.policeEscort.height
        const maxWidth = rules?.policeEscort.width
        const maxLength = rules?.policeEscort.length
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
  ],
})
