import {
  buildAlertMessageField,
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import {
  getApplicationRules,
  getFreightItems,
  isExemptionTypeLongTerm,
  MAX_CNT_FREIGHT,
} from '../../../utils'
import { FreightHiddenInputs } from './freightHiddenInputs'

export const FreightLongTermCreateSubSection = buildSubSection({
  id: 'freightLongTermCreateSubSection',
  condition: (answers) => {
    return isExemptionTypeLongTerm(answers)
  },
  title: freight.create.subSectionTitle,
  children: [
    buildMultiField({
      id: 'freightLongTermCreateMultiField',
      title: freight.create.pageTitle,
      description: freight.create.description,
      children: [
        ...FreightHiddenInputs,
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
        buildAlertMessageField({
          id: 'freight.alertValidation',
          title: freight.create.errorAlertMessageTitle,
          message: (application) => {
            // Empty list error
            const freightItems = getFreightItems(application.answers)
            const showEmptyListError = !freightItems?.length

            // Police escort error
            const maxLength = getApplicationRules(application.externalData)
              ?.policeEscort.length
            const invalidFreightIndex = freightItems.findIndex(
              (x) => x.length && maxLength && Number(x.length) > maxLength,
            )
            const showPoliceEscorError = invalidFreightIndex !== -1

            if (showEmptyListError)
              return freight.create.errorEmptyListAlertMessageMessage
            else if (showPoliceEscorError)
              return {
                ...freight.create.errorPoliceEscortAlertMessageMessage,
                values: {
                  maxLength,
                  freightNumber: invalidFreightIndex + 1,
                  freightName: freightItems[invalidFreightIndex]?.name,
                },
              }
          },
          doesNotRequireAnswer: true,
          alertType: 'error',
          condition: (answers, externalData) => {
            // Empty list error
            const freightItems = getFreightItems(answers)
            const showEmptyListError = !freightItems?.length

            // Police escort error
            const maxLength =
              getApplicationRules(externalData)?.policeEscort.length
            const invalidFreightIndex = freightItems.findIndex(
              (x) => x.length && maxLength && Number(x.length) > maxLength,
            )
            const showPoliceEscorError = invalidFreightIndex !== -1

            return showEmptyListError || showPoliceEscorError
          },
          shouldBlockInSetBeforeSubmitCallback: true,
        }),
      ],
    }),
  ],
})
