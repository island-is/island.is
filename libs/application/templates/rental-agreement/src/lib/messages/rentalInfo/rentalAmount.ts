import { defineMessages } from 'react-intl'

export const rentalAmount = defineMessages({
  subSectionName: {
    id: 'ra.application:rentalAmount.subSectionName',
    defaultMessage: 'Verð',
    description: 'Rental amount sub section name',
  },
  pageTitle: {
    id: 'ra.application:rentalAmount.pageTitle',
    defaultMessage: 'Upphæð leigu',
    description: 'Rental amount page title',
  },
  pageDescription: {
    id: 'ra.application:rentalAmount.pageDescription',
    defaultMessage:
      'Hér er einungis átt við verð fyrir bein leiguafnot. Gjöld fyrir hússjóð, rafmagns- og hitakostnað sem og tryggingar eru skráð í næstu skrefum.',
    description: 'Rental amount page description',
  },

  // Rental amount
  infoTitle: {
    id: 'ra.application:rentalAmount.infoTitle',
    defaultMessage: 'Mánaðarleg leiguupphæð fyrir afnot á húsnæðinu',
    description: 'Rental amount title',
  },
  inputLabel: {
    id: 'ra.application:rentalAmount.inputLabel',
    defaultMessage: 'Leiguverð',
    description: 'Rental amount input label',
  },
  inputPlaceholder: {
    id: 'ra.application:rentalAmount.inputPlaceholder',
    defaultMessage: 'Upphæð í tölustöfum',
    description: 'Rental amount input placeholder',
  },

  // Indexation
  priceIndexLabel: {
    id: 'ra.application:rentalAmount.priceIndexLabel',
    defaultMessage: 'Leiguverð fylgir vísitölu neysluverðs til verðtryggingar',
    description: 'Rental amount price index checkbox label',
  },
  indexDateLabel: {
    id: 'ra.application:rentalAmount.indexDateLabel',
    defaultMessage: 'Viðmið',
    description: 'Rental amount index type date label',
  },
  indexRateLabel: {
    id: 'ra.application:rentalAmount.indexRateLabel',
    defaultMessage: 'Vísitölugildi við upphaf samnings',
    description: 'Rental amount index type rate label',
  },

  // Payment date
  paymentDateTitle: {
    id: 'ra.application:rentalAmount.paymentDateTitle',
    defaultMessage: 'Mánaðardagur greiðslu',
    description: 'Rental amount payment date title',
  },
  paymentDateDescription: {
    id: 'ra.application:rentalAmount.paymentDateDescription',
    defaultMessage:
      'Algengast er að leiga sé greidd fyrirfram í upphafi mánaðar, eða eftir á síðasta dag mánaðar.',
    description: 'Rental amount payment date description',
  },
  paymentDateOptionsLabel: {
    id: 'ra.application:rentalAmount.paymentDateOptionsLabel',
    defaultMessage: 'Greiðsludagur',
    description: 'Rental amount payment date options label',
  },
  paymentDateOptionFirstDay: {
    id: 'ra.application:rentalAmount.paymentDateOptionFirstDay',
    defaultMessage: 'Fyrsti dagur mánaðar',
    description: 'Rental amount payment date first day of month option',
  },
  paymentDateOptionLastDay: {
    id: 'ra.application:rentalAmount.paymentDateOptionLastDay',
    defaultMessage: 'Síðasti dagur mánaðar',
    description: 'Rental amount payment date last day of month option',
  },
  paymentDateOptionOther: {
    id: 'ra.application:rentalAmount.paymentDateOptionOther',
    defaultMessage: 'Annar mánaðardagur',
    description: 'Rental amount payment date other option',
  },
  paymentDateOtherOptionLabel: {
    id: 'ra.application:rentalAmount.paymentDateOtherOptionLabel',
    defaultMessage: 'Annar greiðsludagur',
    description: 'Rental amount payment other option date label',
  },
  paymentDateOtherOptionPlaceholder: {
    id: 'ra.application:rentalAmount.paymentDateOtherOptionPlaceholder',
    defaultMessage: 'Dæmi: 5. hvers mánaðar',
    description: 'Rental amount payment other option date placeholder',
  },

  // Payment method
  paymentMethodTitle: {
    id: 'ra.application:rentalAmount.paymentMethodTitle',
    defaultMessage: 'Greiðsla',
    description: 'Rental amount payment method title',
  },
  paymentMethodOptionsLabel: {
    id: 'ra.application:rentalAmount.paymentMethodOptionsLabel',
    defaultMessage: 'Greiðslufyrirkomulag',
    description: 'Rental amount payment method options label',
  },
  paymentMethodBankTransferLabel: {
    id: 'ra.application:rentalAmount.paymentMethodBankTransferLabel',
    defaultMessage: 'Greitt inn á reikning',
    description: 'Rental amount payment method bank transfer label',
  },
  paymentMethodNationalIdLabel: {
    id: 'ra.application:rentalAmount.paymentMethodNationalIdLabel',
    defaultMessage: 'Kennitala viðtakanda',
    description: 'Rental amount payment method national id label',
  },
  paymentMethodBankAccountNumberLabel: {
    id: 'ra.application:rentalAmount.paymentMethodBankAccountNumberLabel',
    defaultMessage: 'Bankareikningur',
    description: 'Rental amount payment method bank account number label',
  },
  paymentMethodPaymentSlipLabel: {
    id: 'ra.application:rentalAmount.paymentMethodPaymentSlipLabel',
    defaultMessage: 'Greitt með greiðsluseðli',
    description: 'Rental amount payment method payment slip label',
  },
  paymentMethodOtherLabel: {
    id: 'ra.application:rentalAmount.paymentMethodOtherLabel',
    defaultMessage: 'Annað',
    description: 'Rental amount payment method other label',
  },
  paymentMethodOtherTextFieldLabel: {
    id: 'ra.application:rentalAmount.paymentMethodOtherTextFieldLabel',
    defaultMessage: 'Lýsing',
    description: 'Rental amount payment method other text field label',
  },

  // Payment insurance
  securityDepositRequiredLabel: {
    id: 'ra.application:rentalAmount.securityDepositRequiredLabel',
    defaultMessage: 'Tryggingar er krafist við upphaf leigutíma',
    description: 'Rental amount payment insurance option label',
  },

  // Error messages
  indexNotAllowedForShortTermRentalError: {
    id: 'ra.application:rentalAmount.indexNotAllowedForShortTermRentalError',
    defaultMessage:
      'Einungis má vísitölutengja tímabundinn leigusamning ef hann er bundinn lengur en til 12 mánaða',
    description: 'Rental amount index not allowed for short term rental error',
  },
  tooHighNumberError: {
    id: 'ra.application:rentalAmount.tooHighNumberError',
    defaultMessage: 'Leiguverð má ekki vera hærra en 1.500.000 kr.',
    description: 'Rental amount too high number error',
  },
  tooLowNumberError: {
    id: 'ra.application:rentalAmount.tooLowNumberError',
    defaultMessage: 'Leiguverð má ekki vera lægra en 15.000 kr.',
    description: 'Rental amount too low number error',
  },

  paymentDateOtherOptionRequiredError: {
    id: 'ra.application:rentalAmount.paymentDateOtherOptionRequiredError',
    defaultMessage: 'Sláðu inn mánaðardag greiðslu',
    description: 'Rental amount payment date other option required error',
  },

  paymentMethodNationalIdRequiredError: {
    id: 'ra.application:rentalAmount.paymentMethodNationalIdRequiredError',
    defaultMessage: 'Kennitala viðtakanda þarf að vera til staðar',
    description: 'Rental amount payment method national id required error',
  },
  paymentMethodNationalIdInvalidError: {
    id: 'ra.application:rentalAmount.paymentMethodNationalIdInvalidError',
    defaultMessage: 'Kennitala viðtakanda er ekki á réttu formi',
    description: 'Rental amount payment method national id invalid error',
  },
  bankNumberError: {
    id: 'ra.application:rentalAmount.bankNumberError',
    defaultMessage: 'Bankanúmer þarf að vera til staðar',
    description: 'Message for bank number error',
  },
  ledgerError: {
    id: 'ra.application:rentalAmount.ledgerError',
    defaultMessage: 'Höfuðbók þarf að vera til staðar',
    description: 'Message for ledger error',
  },
  accountNumberError: {
    id: 'ra.application:rentalAmount.accountNumberError',
    defaultMessage: 'Reikningsnúmer þarf að vera til staðar',
    description: 'Message for account number error',
  },
  paymentMethodBankAccountNumberInvalidError: {
    id: 'ra.application:rentalAmount.paymentMethodBankAccountNumberInvalidError',
    defaultMessage: 'Upplýsingar um bankareikning eru ekki fullnægjandi',
    description:
      'Rental amount payment method bank account number invalid error',
  },
  paymentMethodOtherTextFieldRequiredError: {
    id: 'ra.application:rentalAmount.paymentMethodOtherTextFieldRequiredError',
    defaultMessage: 'Lýsing á greiðslufyrirkomulagi þarf að vera til staðar',
    description: 'Rental amount payment method other text field required error',
  },
})
