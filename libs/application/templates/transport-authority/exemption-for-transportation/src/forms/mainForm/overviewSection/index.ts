import {
  buildAlertMessageField,
  buildCheckboxField,
  buildMultiField,
  buildOverviewField,
  buildSection,
  buildSubmitField,
  YES,
} from '@island.is/application/core'
import {
  getExemptionPeriodOverviewItems,
  getLongTermLocationOverviewAttachments,
  getLongTermLocationOverviewItems,
  getShortTermLocationOverviewItems,
  getSupportingDocumentsOverviewAttachments,
  getSupportingDocumentsOverviewItems,
  getUserInformationOverviewItems,
  checkIfExemptionTypeLongTerm,
  checkIfExemptionTypeShortTerm,
  getConvoyOverviewItems,
  getAxleSpacingOverviewItems,
  getVehicleSpacingOverviewItems,
  MAX_CNT_FREIGHT,
  getFreightItem,
  getFreightOverviewShortTermItems,
  getFreightOverviewLongTermItems,
  getOverviewErrorMessage,
  checkHasFreightPairingItemWithExemptionForWeight,
  checkHasAnyConvoyWithTrailer,
} from '../../../utils'
import { overview } from '../../../lib/messages'
import { DefaultEvents } from '@island.is/application/types'

export const overviewSection = buildSection({
  id: 'overviewSection',
  title: overview.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'overviewMultiField',
      title: overview.general.pageTitle,
      children: [
        buildOverviewField({
          id: 'overview.userInformation',
          title: overview.userInformation.subtitle,
          backId: 'userInformationMultiField',
          items: getUserInformationOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.exemptionPeriod',
          title: overview.exemptionPeriod.subtitle,
          backId: 'exemptionPeriodMultiField',
          items: getExemptionPeriodOverviewItems,
        }),
        buildOverviewField({
          id: 'overview.shortTermlocation',
          title: overview.shortTermlocation.subtitle,
          backId: 'locationMultiField',
          items: getShortTermLocationOverviewItems,
          condition: checkIfExemptionTypeShortTerm,
        }),
        buildOverviewField({
          id: 'overview.longTermlocation',
          title: overview.longTermlocation.subtitle,
          backId: 'locationMultiField',
          items: getLongTermLocationOverviewItems,
          attachments: getLongTermLocationOverviewAttachments,
          condition: checkIfExemptionTypeLongTerm,
        }),
        buildOverviewField({
          id: 'overview.convoy',
          title: overview.convoy.subtitle,
          backId: (answers) =>
            checkIfExemptionTypeShortTerm(answers)
              ? 'convoyShortTermMultiField'
              : 'convoyLongTermMultiField',
          items: getConvoyOverviewItems,
        }),
        buildOverviewField({
          id: `overview.freightShortTerm`,
          condition: checkIfExemptionTypeShortTerm,
          title: overview.freight.subtitle,
          backId: 'freightShortTermCreateMultiField',
          items: getFreightOverviewShortTermItems,
        }),
        ...Array(MAX_CNT_FREIGHT)
          .fill(null)
          .flatMap((_, freightIndex) => {
            return [
              buildOverviewField({
                id: `overview.freightLongTerm.${freightIndex}`,
                condition: (answers) =>
                  checkIfExemptionTypeLongTerm(answers) &&
                  !!getFreightItem(answers, freightIndex),

                title: (application) => {
                  const freightItem = getFreightItem(
                    application.answers,
                    freightIndex,
                  )
                  return {
                    ...overview.freight.label,
                    values: {
                      freightNumber: freightIndex + 1,
                      freightName: freightItem?.name,
                    },
                  }
                },
                displayTitleAsAccordion: true,
                backId: `freightLongTermPairingMultiField.${freightIndex}`,
                items: (answers, externalData) =>
                  getFreightOverviewLongTermItems(
                    answers,
                    externalData,
                    freightIndex,
                  ),
              }),
            ]
          }),
        buildOverviewField({
          id: 'overview.axleSpacing',
          title: overview.axleSpacing.subtitle,
          backId: 'axleSpacingMultiField',
          items: getAxleSpacingOverviewItems,
          condition: (answers) =>
            checkIfExemptionTypeShortTerm(answers) &&
            checkHasFreightPairingItemWithExemptionForWeight(answers),
        }),
        buildOverviewField({
          id: 'overview.vehicleSpacing',
          title: overview.vehicleSpacing.subtitle,
          backId: 'vehicleSpacingMultiField',
          items: getVehicleSpacingOverviewItems,
          condition: (answers) =>
            checkIfExemptionTypeShortTerm(answers) &&
            checkHasAnyConvoyWithTrailer(answers) &&
            checkHasFreightPairingItemWithExemptionForWeight(answers),
        }),
        buildOverviewField({
          id: 'overview.supportingDocuments',
          title: overview.supportingDocuments.subtitle,
          backId: 'supportingDocumentsMultiField',
          items: getSupportingDocumentsOverviewItems,
          attachments: getSupportingDocumentsOverviewAttachments,
          hideIfEmpty: true,
        }),
        buildCheckboxField({
          id: 'agreementCheckbox',
          large: true,
          backgroundColor: 'blue',
          marginTop: 3,
          required: true,
          options: [
            {
              value: YES,
              label: overview.buttons.confirm,
            },
          ],
        }),
        buildAlertMessageField({
          id: 'overview.alertMessageValidation',
          title: overview.freight.convoyMissingErrorTitle,
          message: (application) =>
            getOverviewErrorMessage(application.answers) || '',
          condition: (answers) => !!getOverviewErrorMessage(answers),
          doesNotRequireAnswer: true,
          alertType: 'error',
          shouldBlockInSetBeforeSubmitCallback: true,
        }),
        buildSubmitField({
          id: 'submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: overview.buttons.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
