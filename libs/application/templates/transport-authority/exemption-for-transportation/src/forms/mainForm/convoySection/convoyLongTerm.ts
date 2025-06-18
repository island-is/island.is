import {
  buildAlertMessageField,
  buildMultiField,
  buildTableRepeaterField,
} from '@island.is/application/core'
import { convoy } from '../../../lib/messages'
import {
  getConvoyItems,
  getRandomId,
  hasDuplicateConvoyItems,
  checkIfExemptionTypeLongTerm,
  loadValidation,
  MAX_CNT_CONVOY,
} from '../../../utils'
import { DollyType } from '../../../shared'

export const ConvoyLongTermMultiField = buildMultiField({
  id: 'convoyLongTermMultiField',
  condition: (answers) => {
    return checkIfExemptionTypeLongTerm(answers)
  },
  title: convoy.general.pageTitle,
  description: convoy.general.description,
  children: [
    buildTableRepeaterField({
      id: 'convoy.items',
      addItemButtonText: convoy.labels.addItemButtonText,
      saveItemButtonText: convoy.labels.saveItemButtonText,
      removeButtonTooltipText: convoy.labels.removeItemButtonTooltipText,
      editButtonTooltipText: convoy.labels.editItemButtonTooltipText,
      maxRows: MAX_CNT_CONVOY,
      marginTop: 0,
      editField: true,
      initActiveFieldIfEmpty: true,
      table: {
        header: [
          convoy.labels.convoyNumberTableHeader,
          convoy.labels.vehicleTableHeader,
          convoy.labels.trailerTableHeader,
        ],
        format: {
          index: (_, index) => {
            return {
              ...convoy.labels.convoyNumber,
              values: { number: index + 1 },
            }
          },
        },
      },
      fields: {
        index: {
          component: 'hiddenInput',
        },
        convoyId: {
          component: 'hiddenInput',
          defaultValue: () => getRandomId(),
          displayInTable: false,
        },
        vehicle: {
          component: 'vehiclePermnoWithInfo',
          width: 'full',
          required: true,
          loadValidation: ({ apolloClient, permno }) =>
            loadValidation(permno, false, apolloClient),
          permnoLabel: convoy.labels.vehiclePermno,
          makeAndColorLabel: convoy.labels.vehicleMakeAndColor,
          errorTitle: convoy.error.alertTitle,
          fallbackErrorMessage: convoy.error.fallbackErrorMessage,
          validationFailedErrorMessage:
            convoy.error.validationFailedErrorMessage,
        },
        trailer: {
          component: 'vehiclePermnoWithInfo',
          label: convoy.labels.trailerPermno,
          width: 'full',
          loadValidation: ({ apolloClient, permno }) =>
            loadValidation(permno, true, apolloClient),
          permnoLabel: convoy.labels.trailerPermno,
          makeAndColorLabel: convoy.labels.trailerMakeAndColor,
          errorTitle: convoy.error.alertTitle,
          fallbackErrorMessage: convoy.error.fallbackErrorMessage,
          validationFailedErrorMessage:
            convoy.error.validationFailedErrorMessage,
        },
        dollyType: {
          component: 'hiddenInput',
          defaultValue: DollyType.NONE,
          displayInTable: false,
        },
      },
    }),
    buildAlertMessageField({
      id: 'convoy.alertValidation',
      title: convoy.error.alertTitle,
      message: (application) => {
        // Empty list error
        const convoyItems = getConvoyItems(application.answers)
        const showEmptyListError = !convoyItems?.length

        // Duplicate error
        const showDuplicateError = hasDuplicateConvoyItems(application.answers)

        if (showEmptyListError) return convoy.error.emptyListErrorMessage
        else if (showDuplicateError) return convoy.error.duplicateErrorMessage
        else return ''
      },
      doesNotRequireAnswer: true,
      alertType: 'error',
      condition: (answers) => {
        // Empty list error
        const convoyItems = getConvoyItems(answers)
        const showEmptyListError = !convoyItems?.length

        // Duplicate error
        const showDuplicateError = hasDuplicateConvoyItems(answers)

        return showEmptyListError || showDuplicateError
      },
      shouldBlockInSetBeforeSubmitCallback: true,
    }),
  ],
})
