import { join } from 'path'
import { EmailRecipient, EmailRole, PaymentData } from './types'
import { TransferOfMachineOwnershipAnswers } from '@island.is/application/templates/aosh/transfer-of-machine-ownership'
import { getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments } from '@island.is/application/types'
import {
  ChangeMachineOwner,
  MachineDto,
} from '@island.is/clients/work-machines'
export const getApplicationPruneDateStr = (
  applicationCreated: Date,
): string => {
  const expiresAfterDays = 7
  const date = new Date(applicationCreated)
  date.setDate(date.getDate() + expiresAfterDays)

  return (
    ('0' + date.getDate()).slice(-2) +
    '.' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '.' +
    date.getFullYear()
  )
}

export const pathToAsset = (file: string) => {
  return join(__dirname, `./aosh-transfer-of-machine-ownership-assets/${file}`)
}

export const getRecipients = (
  answers: TransferOfMachineOwnershipAnswers,
  roles: Array<EmailRole>,
): Array<EmailRecipient> => {
  const recipientList: Array<EmailRecipient> = []

  // Seller
  if (roles.includes(EmailRole.seller) && answers.seller) {
    recipientList.push({
      ssn: answers.seller.nationalId,
      name: answers.seller.name,
      email: answers.seller.email,
      phone: answers.seller.phone,
      role: EmailRole.seller,
      approved: true,
    })
  }

  // Buyer
  if (roles.includes(EmailRole.buyer) && answers.buyer) {
    recipientList.push({
      ssn: answers.buyer.nationalId,
      name: answers.buyer.name,
      email: answers.buyer.email,
      phone: answers.buyer.phone,
      role: EmailRole.buyer,
      approved: answers.buyer.approved,
    })
  }

  // Buyer's operator
  const buyerOperator =
    answers?.buyerOperator?.wasRemoved !== 'true' ? answers.buyerOperator : null
  if (roles.includes(EmailRole.buyerOperator) && buyerOperator) {
    recipientList.push({
      ssn: buyerOperator.nationalId || '',
      name: buyerOperator.name || '',
      email: buyerOperator.email,
      phone: buyerOperator.phone,
      role: EmailRole.buyerOperator,
      approved: buyerOperator.approved,
    })
  }

  return recipientList
}

export const getRecipientBySsn = (
  answers: TransferOfMachineOwnershipAnswers,
  ssn: string,
): EmailRecipient | undefined => {
  if (answers.buyer?.nationalId === ssn) {
    return {
      ssn: answers.buyer.nationalId,
      name: answers.buyer.name,
      email: answers.buyer.email,
      phone: answers.buyer.phone,
      role: EmailRole.buyer,
      approved: true,
    }
  }
}

export const getRoleNameById = (roleId: EmailRole): string | undefined => {
  switch (roleId) {
    case EmailRole.seller:
      return 'Seljandi'
    case EmailRole.buyer:
      return 'Kaupandi'
    case EmailRole.buyerOperator:
      return 'Umráðamaður kaupanda'
    default:
      undefined
  }
}

export const isPaymentRequiredForOwnerChange = (
  application: ApplicationWithAttachments,
  machineId: string,
): boolean => {
  const machines = getValueViaPath(
    application.externalData,
    'machinesList.data',
    [],
  ) as MachineDto[]

  return (
    machines.find((machine) => machine.id === machineId)
      ?.paymentRequiredForOwnerChange || true
  )
}

export const createOwnerChangeObject = (
  application: ApplicationWithAttachments,
  delegateNationalId: string,
  answers: TransferOfMachineOwnershipAnswers,
  isPaymentRequired: boolean,
  paymentData?: PaymentData,
): ChangeMachineOwner => {
  const machineId = answers.machine.id || answers.pickMachine.id
  if (!machineId) {
    throw new Error('Ekki er búið að velja vél')
  }

  return {
    applicationId: application.id,
    machineId: machineId,
    buyerNationalId: answers.buyer.nationalId,
    sellerNationalId: answers.seller.nationalId,
    delegateNationalId: delegateNationalId,
    dateOfOwnerChange: new Date(),
    paymentId: isPaymentRequired ? paymentData?.id || '' : '',
    phoneNumber: answers.buyer.phone?.replace(/\+\d{3}/, ''),
    email: answers.buyer.email,
  }
}
