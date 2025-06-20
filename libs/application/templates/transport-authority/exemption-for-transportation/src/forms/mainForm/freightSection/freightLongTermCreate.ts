import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import {
  getExemptionRules,
  getFreightItems,
  getRandomId,
  checkIfExemptionTypeLongTerm,
  MAX_CNT_FREIGHT,
} from '../../../utils'
import { FreightCommonHiddenInputs } from './freightCommonHiddenInputs'

export const FreightLongTermCreateSubSection = buildSubSection({
  id: 'freightLongTermCreateSubSection',
  condition: (answers) => {
    return checkIfExemptionTypeLongTerm(answers)
  },
  title: freight.create.subSectionTitle,
  children: [
    buildMultiField({
      id: 'freightLongTermCreateMultiField',
      title: freight.create.pageTitle,
      description: freight.create.description,
      children: [
        ...FreightCommonHiddenInputs('freight'),
        buildTableRepeaterField({
          id: 'freight.items',
          addItemButtonText: freight.labels.addItemButtonText,
          saveItemButtonText: freight.labels.saveItemButtonText,
          removeButtonTooltipText: freight.labels.removeItemButtonTooltipText,
          editButtonTooltipText: freight.labels.editItemButtonTooltipText,
          maxRows: MAX_CNT_FREIGHT,
          marginTop: 0,
          editField: true,
          initActiveFieldIfEmpty: true,
          table: {
            format: {
              length: (value) => {
                return {
                  ...freight.labels.valueAndMetersSuffix,
                  values: { value },
                }
              },
              weight: (value) => {
                return {
                  ...freight.labels.valueAndTonsSuffix,
                  values: { value },
                }
              },
            },
          },
          fields: {
            freightId: {
              component: 'hiddenInput',
              defaultValue: () => getRandomId(),
              displayInTable: false,
            },
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
        buildAlertMessageField({
          id: 'freight.alertValidation',
          title: freight.create.errorAlertMessageTitle,
          message: (application) => {
            // Empty list error
            const freightItems = getFreightItems(application.answers)
            const showEmptyListError = !freightItems?.length

            // Police escort error
            const maxLength = getExemptionRules(application.externalData)
              ?.policeEscort.maxLength
            const invalidFreightIndex = freightItems.findIndex(
              (x) => x.length && maxLength && Number(x.length) > maxLength,
            )
            const showPoliceEscortError = invalidFreightIndex !== -1

            if (showEmptyListError)
              return freight.create.errorEmptyListAlertMessage
            else if (showPoliceEscortError)
              return {
                ...freight.create.errorPoliceEscortAlertMessage,
                values: {
                  maxLength,
                  freightNumber: invalidFreightIndex + 1,
                  freightName: freightItems[invalidFreightIndex]?.name,
                },
              }
            else return ''
          },
          doesNotRequireAnswer: true,
          alertType: 'error',
          condition: (answers, externalData) => {
            // Empty list error
            const freightItems = getFreightItems(answers)
            const showEmptyListError = !freightItems?.length

            // Police escort error
            const maxLength =
              getExemptionRules(externalData)?.policeEscort.maxLength
            const invalidFreightIndex = freightItems.findIndex(
              (x) => x.length && maxLength && Number(x.length) > maxLength,
            )
            const showPoliceEscortError = invalidFreightIndex !== -1

            return showEmptyListError || showPoliceEscortError
          },
          shouldBlockInSetBeforeSubmitCallback: true,
        }),
        buildCustomField({
          component: 'HandleBeforeSubmitFreight',
          id: 'handleBeforeSubmitFreight',
          description: '',
        }),
      ],
    }),
  ],
})
