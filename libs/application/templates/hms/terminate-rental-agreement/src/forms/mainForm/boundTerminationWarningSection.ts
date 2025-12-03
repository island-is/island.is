import {
  buildSection,
  getValueViaPath,
  buildAlertMessageField,
  buildMultiField,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import { ContractTypes, TerminationTypes } from '../../types'
import { Contract } from '@island.is/clients/hms-rental-agreement'

export const boundTerminationWarningSection = buildSection({
  condition: (answers, externalData) => {
    const terminationType = getValueViaPath<string>(
      answers,
      'terminationType.answer',
    )
    const contractId = getValueViaPath<string>(
      answers,
      'rentalAgreement.answer',
    )
    const rentalAgreements = getValueViaPath<Array<Contract>>(
      externalData,
      'getRentalAgreements.data',
    )
    const contract = rentalAgreements?.find(
      (contract) => contract.contractId === parseInt(contractId ?? ''),
    )
    return (
      terminationType === TerminationTypes.TERMINATION &&
      contract?.contractType === ContractTypes.BOUND
    )
  },
  id: 'boundTerminationWarningSection',
  title: m.boundTerminationMessages.warningSectionTitle,
  children: [
    buildMultiField({
      id: 'boundTerminationWarningMultiField',
      title: m.boundTerminationMessages.title,
      children: [
        buildAlertMessageField({
          id: 'boundTermination.boundTerminationWarning',
          title: m.boundTerminationMessages.warningTitle,
          message: m.boundTerminationMessages.warningPlaceholder,
          alertType: 'warning',
          marginTop: 'p1',
        }),
      ],
    }),
  ],
})
