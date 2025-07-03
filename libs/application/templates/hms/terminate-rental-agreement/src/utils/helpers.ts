import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { ContractTypes } from '../types'

export const getSelectedContract = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const selectedContractId = getValueViaPath<string>(
    answers,
    'rentalAgreement.answer',
  )

  const contracts = getValueViaPath<Array<Contract>>(
    externalData,
    'getRentalAgreements.data',
  )

  const contract = contracts?.find(
    (contract) => contract.contractId === parseInt(selectedContractId ?? ''),
  )

  return contract
}

export const isTerminationBound = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const contract = getSelectedContract(answers, externalData)

  return contract?.contractType === ContractTypes.BOUND
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  const phone = parsePhoneNumberFromString(phoneNumber, 'IS')
  return phone?.formatNational() || phoneNumber
}
