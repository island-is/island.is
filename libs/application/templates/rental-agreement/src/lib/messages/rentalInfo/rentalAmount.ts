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
  infoTitle: {
    id: 'ra.application:rentalAmount.infoTitle',
    defaultMessage: 'Mánaðarlegt leiguverð fyrir afnot á húsnæðinu',
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
  priceIndexLabel: {
    id: 'ra.application:rentalAmount.priceIndexLabel',
    defaultMessage: 'Leiguverð fylgir vísitölu',
    description: 'Rental amount price index checkbox label',
  },
  indexOptionsLabel: {
    id: 'ra.application:rentalAmount.indexOptionsLabel',
    defaultMessage: 'Vísitala',
    description: 'Rental amount index options label',
  },
  indexOptionConsumerPriceIndex: {
    id: 'ra.application:rentalAmount.indexOptionConsumerPriceIndex',
    defaultMessage: 'Vísitala neysluverðs',
    description: 'Rental amount consumer price index option',
  },
  indexOptionConstructionCostIndex: {
    id: 'ra.application:rentalAmount.indexOptionConstructionCostIndex',
    defaultMessage: 'Byggingarvísitala',
    description: 'Rental amount construction cost index option',
  },
  indexOptionWageIndex: {
    id: 'ra.application:rentalAmount.indexOptionWageIndex',
    defaultMessage: 'Launavísitala',
    description: 'Rental amount wage index option',
  },
  indexDateLabel: {
    id: 'ra.application:rentalAmount.indexDateLabel',
    defaultMessage: 'Útgáfudagur vísitölu',
    description: 'Rental amount index type date label',
  },
  indexValueLabel: {
    id: 'ra.application:rentalAmount.indexValueLabel',
    defaultMessage: 'Vísitala við upphaf samnings',
    description: 'Rental amount index type value label',
  },
  indexValuePlaceholder: {
    id: 'ra.application:rentalAmount.indexValuePlaceholder',
    defaultMessage: 'Sláðu inn gildi',
    description: 'Rental amount index type value placeholder',
  },
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
    defaultMessage: 'Sláðu inn mánaðardag (t.d. 3. hvers mánaðar)',
    description: 'Rental amount payment other option date placeholder',
  },
  paymentInsuranceTitle: {
    id: 'ra.application:rentalAmount.paymentInsuranceTitle',
    defaultMessage: 'Trygging',
    description: 'Rental amount payment insurance title',
  },
  paymentInsuranceRequiredLabel: {
    id: 'ra.application:rentalAmount.paymentInsuranceRequiredLabel',
    defaultMessage: 'Tryggingar er krafist við upphaf leigutíma',
    description: 'Rental amount payment insurance option label',
  },

  // Error messages
  indexValueRequiredError: {
    id: 'ra.application:rentalAmount.indexValueRequiredError',
    defaultMessage: 'Sláðu inn vísitölu',
    description: 'Rental amount index value required error',
  },
  indexValueValidationError: {
    id: 'ra.application:rentalAmount.indexValueRequiredError',
    defaultMessage: 'vísitala má aðeins innihalda tölustafi með einum aukastaf',
    description: 'Rental amount index value required error',
  },
  paymentDateOtherOptionRequiredError: {
    id: 'ra.application:rentalAmount.paymentDateOtherOptionRequiredError',
    defaultMessage: 'Sláðu inn mánaðardag greiðslu',
    description: 'Rental amount payment date other option required error',
  },
})
