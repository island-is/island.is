import {
  buildAlertMessageField,
  buildCustomField,
  buildMultiField,
  buildSubSection,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import {
  getRandomId,
  checkIfExemptionTypeLongTerm,
  MAX_CNT_FREIGHT,
  getFreightLongTermErrorMessage,
} from '../../../utils'
import { FreightCommonHiddenInputs } from './freightCommonHiddenInputs'

export const FreightLongTermCreateSubSection = buildSubSection({
  id: 'freightLongTermCreateSubSection',
  condition: checkIfExemptionTypeLongTerm,
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
          message: (application) =>
            getFreightLongTermErrorMessage(
              application.externalData,
              application.answers,
            ) || '',
          condition: (answers, externalData) =>
            !!getFreightLongTermErrorMessage(externalData, answers),
          doesNotRequireAnswer: true,
          alertType: 'error',
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
