import { join } from 'path'
import { EmailRecipient, EmailRole } from './types'
import { TransferOfMachineOwnerShipAnswers } from '@island.is/application/templates/administration-of-occupational-safety-and-health/transfer-of-machine-ownership'

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
  answers: TransferOfMachineOwnerShipAnswers,
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

  const filteredBuyerCoOwnerAndOperator =
    answers?.buyerCoOwnerAndOperator?.filter(
      ({ wasRemoved }) => wasRemoved !== 'true',
    )

  // Buyer's operators
  const buyerOperators = filteredBuyerCoOwnerAndOperator?.filter(
    (x) => x.type === 'operator',
  )
  if (roles.includes(EmailRole.buyerOperator) && buyerOperators) {
    for (let i = 0; i < buyerOperators.length; i++) {
      recipientList.push({
        ssn: buyerOperators[i].nationalId || '',
        name: buyerOperators[i].name || '',
        email: buyerOperators[i].email,
        phone: buyerOperators[i].phone,
        role: EmailRole.buyerOperator,
        approved: buyerOperators[i].approved,
      })
    }
  }

  return recipientList
}
