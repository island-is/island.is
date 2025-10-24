import { getValueViaPath } from '@island.is/application/core'
import {
  ExternalData,
  FormValue,
  Application,
} from '@island.is/application/types'
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

export const getSelectedContractStartDate = (application: Application) => {
  const selectedContract = getSelectedContract(
    application.answers,
    application.externalData,
  )
  return new Date(selectedContract?.dateFrom ?? '')
}

export const getSelectedContractEndDate = (application: Application) => {
  const selectedContract = getSelectedContract(
    application.answers,
    application.externalData,
  )
  if (selectedContract?.dateTo) {
    return new Date(selectedContract.dateTo)
  }

  return getNMonthsFromToday(3)
}

export const getOneMonthFromToday = () => {
  const today = new Date()
  const oneMonthLater = new Date(today)
  oneMonthLater.setMonth(today.getMonth() + 1)
  return oneMonthLater
}

export const getNMonthsFromToday = (n: number) => {
  const today = new Date()
  const nMonthsLater = new Date(today)
  nMonthsLater.setMonth(today.getMonth() + n)
  return nMonthsLater
}

export const nearestDateInFuture = (date1: Date, date2: Date) => {
  const today = new Date()

  if (date1 < date2 && date1 > today) {
    return date1
  }

  if (date2 < date1 && date2 > today) {
    return date2
  }

  return today
}
