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
  getFreightCreateLongTermErrorMessage,
} from '../../../utils'

export const FreightLongTermCreateSubSection = buildSubSection({
  id: 'freightLongTermCreateSubSection',
  condition: checkIfExemptionTypeLongTerm,
  title: freight.create.subSectionTitle,
  children: [
    buildMultiField({
      id: 'freightLongTermCreateMultiField',
      title: freight.create.pageTitle,
      description: freight.create.descriptionLongTerm,
      children: [
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
              freight.labels.freightNumberTableHeader,
              freight.labels.freightName,
            ],
            format: {
              index: (_, index) => {
                return {
                  ...freight.labels.freightNumber,
                  values: { number: index + 1 },
                }
              },
            },
          },
          onSubmitLoad: async ({ tableItems }) => {
            const index = tableItems.length - 1
            return {
              dictionaryOfItems: [
                {
                  path: `freight.items[${index}].freightId`,
                  value: getRandomId(),
                },
              ],
            }
          },
          fields: {
            index: {
              component: 'hiddenInput',
            },
            name: {
              component: 'input',
              label: freight.labels.freightName,
              width: 'full',
              required: true,
            },
          },
        }),
        buildAlertMessageField({
          id: 'freight.alertValidation',
          title: freight.create.errorAlertMessageTitle,
          message: (application) =>
            getFreightCreateLongTermErrorMessage(
              application.externalData,
              application.answers,
            ) || '',
          condition: (answers, externalData) =>
            !!getFreightCreateLongTermErrorMessage(externalData, answers),
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
