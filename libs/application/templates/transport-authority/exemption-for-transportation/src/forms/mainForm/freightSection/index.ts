import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTableRepeaterField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { ExemptionFor } from '../../../shared'
import { Application } from '@island.is/application/types'
import {
  formatNumber,
  getApplicationRules,
  getApplicationRulesLimitations,
  getExemptionType,
  isExemptionTypeLongTerm,
  isExemptionTypeShortTerm,
} from '../../../utils'

export const freightSection = buildSection({
  id: 'freightSection',
  title: freight.general.sectionTitle,
  children: [
    // Short-term application (single freight)
    buildMultiField({
      id: 'freightShortTermCreateMultiField',
      condition: (answers) => {
        return isExemptionTypeShortTerm(answers)
      },
      title: freight.create.pageTitle,
      children: [
        // Hidden fields
        buildHiddenInput({
          id: 'location.exemptionPeriodType',
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

        // Fields
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
            const width = getValueViaPath<string>(
              answers,
              'freight.items.0.width',
            )
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
    }),

    // Long-term application (multiple freight)
    buildSubSection({
      id: 'freightLongTermCreateSubSection',
      condition: (answers) => {
        return isExemptionTypeLongTerm(answers)
      },
      title: freight.create.subSectionTitle,
      children: [
        buildMultiField({
          id: 'freightLongTermCreateMultiField',
          title: freight.create.pageTitle,
          children: [
            buildTableRepeaterField({
              id: 'freight.items',
              formTitle: freight.labels.freightSubtitle,
              addItemButtonText: freight.labels.addItemButtonText,
              saveItemButtonText: freight.labels.saveItemButtonText,
              removeButtonTooltipText:
                freight.labels.removeItemButtonTooltipText,
              editButtonTooltipText: freight.labels.editItemButtonTooltipText,
              maxRows: 10, //TODOx er limit?
              marginTop: 0,
              editField: true,
              table: {
                header: [
                  freight.labels.freightName,
                  freight.labels.freightLength,
                  freight.labels.freightWeight,
                ],
              },
              fields: {
                name: {
                  component: 'input',
                  label: freight.labels.freightName,
                  width: 'full',
                  required: true,
                },
                length: {
                  component: 'input',
                  type: 'number',
                  label: freight.labels.freightLength,
                  width: 'half',
                  suffix: freight.labels.metersSuffix,
                  required: true,
                },
                weight: {
                  component: 'input',
                  type: 'number',
                  label: freight.labels.freightWeight,
                  width: 'half',
                  suffix: freight.labels.tonsSuffix,
                  required: true,
                },
              },
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'freightLongTermPairingSubSection',
      condition: (answers) => {
        return isExemptionTypeLongTerm(answers)
      },
      title: freight.pairing.pageTitle,
      children: [
        buildMultiField({
          id: 'freightLongTermPairingMultiField',
          title: freight.pairing.pageTitle,
          children: [
            buildDescriptionField({
              id: 'description',
              title: 'lorem ipsum',
            }),
          ],
        }),
      ],
    }),
  ],
})
