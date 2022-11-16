import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'
import { EmailRecipient, EmailRole } from './types'

// Returns date object with the timestamp 12:00 (UTC timezone)
export const getDateAtNoonFromString = (dateStr: string): Date => {
  const dateObj = new Date(dateStr)
  const date =
    dateObj instanceof Date && !isNaN(dateObj.getDate()) ? dateObj : new Date()
  return new Date(date.toISOString().substring(0, 10) + 'T12:00:00Z')
}

export const getAllRoles = (): EmailRole[] => {
  return [
    EmailRole.seller,
    EmailRole.sellerCoOwner,
    EmailRole.buyer,
    EmailRole.buyerCoOwner,
    EmailRole.buyerOperator,
  ]
}

export const getRoleNameById = (roleId: EmailRole): string | undefined => {
  switch (roleId) {
    case EmailRole.seller:
      return 'Seljandi'
    case EmailRole.sellerCoOwner:
      return 'Meðeigandi seljanda'
    case EmailRole.buyer:
      return 'Kaupandi'
    case EmailRole.buyerCoOwner:
      return 'Meðeigandi kaupanda'
    case EmailRole.buyerOperator:
      return 'Umráðamaður kaupanda'
    default:
      undefined
  }
}

export const getApplicationPruneDateStr = (
  applicationCreated: Date,
): string => {
  const expiresAfterDays = 7
  const date = new Date(applicationCreated)
  date.setDate(date.getDate() + expiresAfterDays)

  return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear()
}

export const getRecipients = (
  answers: TransferOfVehicleOwnershipAnswers,
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

  // Seller's co-owners
  const sellerCoOwners = answers.sellerCoOwner
  if (roles.includes(EmailRole.sellerCoOwner) && sellerCoOwners) {
    for (let i = 0; i < sellerCoOwners.length; i++) {
      recipientList.push({
        ssn: sellerCoOwners[i].nationalId,
        name: sellerCoOwners[i].name,
        email: sellerCoOwners[i].email,
        phone: sellerCoOwners[i].phone,
        role: EmailRole.sellerCoOwner,
        approved: sellerCoOwners[i].approved,
      })
    }
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

  // Buyer's co-owners
  const buyerCoOwners = answers.buyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'coOwner',
  )
  if (roles.includes(EmailRole.buyerCoOwner) && buyerCoOwners) {
    for (let i = 0; i < buyerCoOwners.length; i++) {
      recipientList.push({
        ssn: buyerCoOwners[i].nationalId,
        name: buyerCoOwners[i].name,
        email: buyerCoOwners[i].email,
        phone: buyerCoOwners[i].phone,
        role: EmailRole.buyerCoOwner,
        approved: buyerCoOwners[i].approved,
      })
    }
  }

  // Buyer's operators
  const buyerOperators = answers.buyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'operator',
  )
  if (roles.includes(EmailRole.buyerOperator) && buyerOperators) {
    for (let i = 0; i < buyerOperators.length; i++) {
      recipientList.push({
        ssn: buyerOperators[i].nationalId,
        name: buyerOperators[i].name,
        email: buyerOperators[i].email,
        phone: buyerOperators[i].phone,
        role: EmailRole.buyerOperator,
        approved: buyerOperators[i].approved,
      })
    }
  }

  return recipientList
}

export const getRecipientBySsn = (
  answers: TransferOfVehicleOwnershipAnswers,
  ssn: string,
): EmailRecipient | undefined => {
  // Seller
  if (answers.seller?.nationalId === ssn) {
    return {
      ssn: answers.seller.nationalId,
      name: answers.seller.name,
      email: answers.seller.email,
      phone: answers.seller.phone,
      role: EmailRole.seller,
      approved: true,
    }
  }

  // Seller's co-owners
  const sellerCoOwners = answers.sellerCoOwner
  if (sellerCoOwners) {
    for (let i = 0; i < sellerCoOwners.length; i++) {
      if (sellerCoOwners[i].nationalId === ssn) {
        return {
          ssn: sellerCoOwners[i].nationalId,
          name: sellerCoOwners[i].name,
          email: sellerCoOwners[i].email,
          phone: sellerCoOwners[i].phone,
          role: EmailRole.sellerCoOwner,
          approved: sellerCoOwners[i].approved,
        }
      }
    }
  }

  // Buyer
  if (answers.buyer?.nationalId === ssn) {
    return {
      ssn: answers.buyer.nationalId,
      name: answers.buyer.name,
      email: answers.buyer.email,
      phone: answers.buyer.phone,
      role: EmailRole.buyer,
      approved: answers.buyer.approved,
    }
  }

  // Buyer's co-owners
  const buyerCoOwners = answers.buyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'coOwner',
  )
  if (buyerCoOwners) {
    for (let i = 0; i < buyerCoOwners.length; i++) {
      if (buyerCoOwners[i].nationalId === ssn) {
        return {
          ssn: buyerCoOwners[i].nationalId,
          name: buyerCoOwners[i].name,
          email: buyerCoOwners[i].email,
          phone: buyerCoOwners[i].phone,
          role: EmailRole.buyerCoOwner,
          approved: buyerCoOwners[i].approved,
        }
      }
    }
  }

  // Buyer's operators
  const buyerOperators = answers.buyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'operator',
  )
  if (buyerOperators) {
    for (let i = 0; i < buyerOperators.length; i++) {
      if (buyerOperators[i].nationalId === ssn) {
        return {
          ssn: buyerOperators[i].nationalId,
          name: buyerOperators[i].name,
          email: buyerOperators[i].email,
          phone: buyerOperators[i].phone,
          role: EmailRole.buyerOperator,
          approved: buyerOperators[i].approved,
        }
      }
    }
  }
}
