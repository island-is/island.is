import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  defaultErrorTitle: {
    id: 'ra.application:errorMessages.defaultErrorMessage',
    defaultMessage: 'Villa kom upp',
    description: 'Default error message',
  },
  defaultErrorSummary: {
    id: 'ra.application:errorMessages.defaultErrorSummary',
    defaultMessage: 'Villa kom upp við að senda samninginn til undirritunar',
    description: 'Default error summary',
  },
  mobileSignatureRequired: {
    id: 'ra.application:errorMessages.mobileSignatureRequired',
    defaultMessage:
      'Þessi samningur krefst rafrænnar auðkenningar til undirritunar.',
    description: 'Mobile signature required',
  },
  mobileSignatureRequiredSummary: {
    id: 'ra.application:errorMessages.mobileSignatureRequiredSummary',
    defaultMessage:
      'Allir aðilar samningsins verða að hafa rafræna auðkenningu til að geta undirritað samninginn rafrænt.',
    description: 'Mobile signature required summary',
  },
  rentalAgreementAlreadyExists: {
    id: 'ra.application:errorMessages.rentalAgreementAlreadyExists',
    defaultMessage: 'Samningurinn er þegar til',
    description: 'Rental agreement already exists',
  },
  rentalAgreementAlreadyExistsSummary: {
    id: 'ra.application:errorMessages.rentalAgreementAlreadyExistsSummary',
    defaultMessage: 'Leigusamningur með þetta númer er þegar til í kerfinu',
    description: 'Rental agreement already exists summary',
  },
})
