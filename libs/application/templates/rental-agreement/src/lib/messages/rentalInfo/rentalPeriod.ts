import { defineMessages } from 'react-intl'

export const rentalPeriod = defineMessages({
  subSectionName: {
    id: 'ra.application:rentalPeriodDetails.subSectionName',
    defaultMessage: 'Tímabil',
    description: 'Rental period sub section name',
  },
  pageTitle: {
    id: 'ra.application:rentalPeriodDetails.pageTitle',
    defaultMessage: 'Tímabil',
    description: 'Rental period page title',
  },
  pageDescription: {
    id: 'ra.application:rentalPeriodDetails.pageDescription',
    defaultMessage:
      'Veldu upphafsdag leigusamnings og fyrirkomulag. Hægt er gera ótímabundinn samning með 6 mánaða uppsagnarfresti, eða tímabundinn samning með lokadagsetningu.',
    description: 'Rental period page description',
  },
  startDateTitle: {
    id: 'ra.application:rentalPeriodDetails.startDateTitle',
    defaultMessage: 'Upphafsdagur samnings',
    description: 'Start date title',
  },
  startDatePlaceholder: {
    id: 'ra.application:rentalPeriodDetails.startDatePlaceholder',
    defaultMessage: 'Veldu dagsetningu',
    description: 'Start date placeholder',
  },
  endDateTitle: {
    id: 'ra.application:rentalPeriodDetails.endDateTitle',
    defaultMessage: 'Lokadagur samnings',
    description: 'End date title',
  },
  endDatePlaceholder: {
    id: 'ra.application:rentalPeriodDetails.endDatePlaceholder',
    defaultMessage: 'Veldu dagsetningu',
    description: 'End date placeholder',
  },

  rentalPeriodDefiniteLabel: {
    id: 'ra.application:rentalPeriodDetails.rentalPeriodDefinite',
    defaultMessage: 'Tímabundinn leigusamningur',
    description: 'Rental period definite',
  },

  terminationLabel: {
    id: 'ra.application:rentalPeriodDetails.terminationLabel',
    defaultMessage: 'Uppsagnarfrestur',
    description: 'Rental period termination label',
  },

  terminationDescription: {
    id: 'ra.application:rentalPeriodDetails.terminationDescription#markdown',
    defaultMessage:
      'Lögbundinn uppsagnarfrestur ótímabundinna samninga eru **6 mánuðir**. Sé leigusamningur tímabundinn lýkur honum án sérstakrar uppsagnar nema um annað sé samið. \n\n Tilgreina þarf þær ástæður sem geta leitt til uppsagnar tímabundins húsaleigusamnings í sérákvæðum, en uppsagnarfrestur tímabundins húsaleigusamnings skal þó vera a.m.k. **3 mánuðir**.',
    description: 'Rental period termination description',
  },

  // Error messages
  errorAgreementStartDateNotFilled: {
    id: 'ra.application:dataSchema.errorStartDateNotFilled',
    defaultMessage: 'Veldu upphafsdag samnings',
    description: 'Error message when start date is not filled',
  },
  errorStartDateTooFarInFuture: {
    id: 'ra.application:dataSchema.errorStartDateTooFarInFuture',
    defaultMessage:
      'Upphafsdagur samnings má ekki vera lengra en 1 ár fram í tímann',
    description: 'Error message when start date is too far in the future',
  },
  errorAgreementEndDateNotFilled: {
    id: 'ra.application:dataSchema.errorEndDateNotFilled',
    defaultMessage: 'Veldu síðasta dag samnings',
    description: 'Error message when end date is not filled',
  },
  errorEndDateBeforeStart: {
    id: 'ra.application:dataSchema.errorEndDateBeforeStart',
    defaultMessage:
      'Loka dagur samnings má ekki vera sami eða fyrir upphafsdag samnings',
    description: 'Error message when end date is before start date',
  },
  alertMessageTitle: {
    id: 'ra.application:rentalPeriodDetails.alertMessageTitle',
    defaultMessage: 'Valin dagsetning er meira en ár fram í tímann',
    description: 'Alert message title',
  },
  alertMessage: {
    id: 'ra.application:rentalPeriodDetails.alertMessage',
    defaultMessage: 'Vinsamlegast athugið hvort að þetta sé rétt dagsetning.',
    description: 'Alert message',
  },
})
