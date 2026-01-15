import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildPaymentChargeOverviewField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../lib/messages'
import { commonOverviewFields } from './OverviewSections/commonFields'
import { overviewAssetsAndDebts } from './OverviewSections/assetsAndDebts'
import { overviewAttachments } from './OverviewSections/attachments'
import { overviewConfirmAction } from './OverviewSections/confirmAction'
import { EstateTypes, YES, NO } from '../lib/constants'
import { deceasedInfoFields } from './Sections/deceasedInfoFields'
import { representativeOverview } from './OverviewSections/representative'
import { getChargeItems } from '../utils/getChargeItems'

// Helper to check if payment is enabled for undivided estate
const isPaymentEnabled = (externalData: Record<string, unknown>): boolean => {
  const paymentData = getValueViaPath(externalData, 'payment.data')
  return Array.isArray(paymentData) && paymentData.length > 0
}

export const overview = buildSection({
  id: 'overviewEstateDivision',
  title: m.overviewTitle,
  children: [
    /* Einkaskipti WITH payment enabled */
    buildMultiField({
      id: 'overviewPrivateDivisionWithPayment',
      title: m.overviewTitle,
      description: m.overviewSubtitleDivisionOfEstateByHeirs,
      condition: (answers, externalData) =>
        getValueViaPath(answers, 'selectedEstate') ===
          EstateTypes.divisionOfEstateByHeirs && isPaymentEnabled(externalData),
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...representativeOverview,
        buildPaymentChargeOverviewField({
          id: 'paymentChargeOverview',
          forPaymentLabel: m.forPayment,
          totalLabel: m.total,
          getSelectedChargeItems: (application) =>
            getChargeItems(application).map((item) => ({
              chargeItemCode: item.code,
            })),
        }),
        buildSubmitField({
          id: 'estateDivisionSubmit.payment',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: m.proceedToPayment,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Einkaskipti WITHOUT payment (feature flag off) */
    buildMultiField({
      id: 'overviewPrivateDivisionNoPayment',
      title: m.overviewTitle,
      description: m.overviewSubtitleDivisionOfEstateByHeirs,
      condition: (answers, externalData) =>
        getValueViaPath(answers, 'selectedEstate') ===
          EstateTypes.divisionOfEstateByHeirs &&
        !isPaymentEnabled(externalData),
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...representativeOverview,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Seta í óskiptu búi WITH payment enabled */
    buildMultiField({
      id: 'overviewUndividedEstateWithPayment',
      title: m.overviewTitle,
      description: m.overviewSubtitlePermitToPostpone,
      condition: (answers, externalData) =>
        getValueViaPath(answers, 'selectedEstate') ===
          EstateTypes.permitForUndividedEstate &&
        isPaymentEnabled(externalData),
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildPaymentChargeOverviewField({
          id: 'paymentChargeOverview',
          forPaymentLabel: m.forPayment,
          totalLabel: m.total,
          getSelectedChargeItems: (application) =>
            getChargeItems(application).map((item) => ({
              chargeItemCode: item.code,
            })),
        }),
        buildSubmitField({
          id: 'estateDivisionSubmit.payment',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.PAYMENT,
              name: m.proceedToPayment,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Seta í óskiptu búi WITHOUT payment (feature flag off) */
    buildMultiField({
      id: 'overviewUndividedEstateNoPayment',
      title: m.overviewTitle,
      description: m.overviewSubtitlePermitToPostpone,
      condition: (answers, externalData) =>
        getValueViaPath(answers, 'selectedEstate') ===
          EstateTypes.permitForUndividedEstate &&
        !isPaymentEnabled(externalData),
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Eignalaust bú með eignum */
    buildMultiField({
      id: 'overviewEstateDivision',
      title: m.overviewTitle,
      description: m.overviewSubtitleWithoutAssets,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
          EstateTypes.estateWithoutAssets &&
        getValueViaPath(answers, 'estateWithoutAssets.estateAssetsExist') ===
          YES,
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Eignalaust bú án eigna */
    buildMultiField({
      id: 'overviewWithoutAssets',
      title: m.overviewTitle,
      description: m.overviewSubtitleWithoutAssets,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
          EstateTypes.estateWithoutAssets &&
        getValueViaPath(answers, 'estateWithoutAssets.estateAssetsExist') ===
          NO,
      children: [
        ...commonOverviewFields,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Opinber Skipti */
    buildMultiField({
      id: 'overviewDivisionOfEstate',
      title: m.overviewTitle,
      description: m.overviewSubtitleDivisionOfEstate,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.officialDivision,
      children: [
        ...deceasedInfoFields,
        buildCheckboxField({
          id: 'confirmAction',
          large: true,
          backgroundColor: 'blue',
          marginTop: 'containerGutter',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.divisionOfEstateConfirmActionCheckbox,
            },
          ],
        }),
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
