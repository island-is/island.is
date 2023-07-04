import { ChangeOperatorOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-operator-of-vehicle'
import { EmailRecipient, EmailRole } from './types'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  return join(
    __dirname,
    `./transport-authority-change-operator-of-vehicle-assets/${file}`,
  )
}

export const getAllRoles = (): EmailRole[] => {
  return [EmailRole.owner, EmailRole.ownerCoOwner, EmailRole.operator]
}

export const getRoleNameById = (roleId: EmailRole): string | undefined => {
  switch (roleId) {
    case EmailRole.owner:
      return 'Eigandi'
    case EmailRole.ownerCoOwner:
      return 'Meðeigandi'
    case EmailRole.operator:
      return 'Umráðamaður'
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

  return (
    ('0' + date.getDate()).slice(-2) +
    '.' +
    ('0' + (date.getMonth() + 1)).slice(-2) +
    '.' +
    date.getFullYear()
  )
}

export const getRecipients = (
  answers: ChangeOperatorOfVehicleAnswers,
  roles: Array<EmailRole>,
): Array<EmailRecipient> => {
  const recipientList: Array<EmailRecipient> = []

  // Owner
  if (roles.includes(EmailRole.owner) && answers.owner) {
    recipientList.push({
      ssn: answers.owner.nationalId,
      name: answers.owner.name,
      email: answers.owner.email,
      phone: answers.owner.phone,
      role: EmailRole.owner,
      approved: true,
    })
  }

  // Owner's co-owners
  const ownerCoOwners = answers.ownerCoOwner
  if (roles.includes(EmailRole.ownerCoOwner) && ownerCoOwners) {
    for (let i = 0; i < ownerCoOwners.length; i++) {
      recipientList.push({
        ssn: ownerCoOwners[i].nationalId,
        name: ownerCoOwners[i].name,
        email: ownerCoOwners[i].email,
        phone: ownerCoOwners[i].phone,
        role: EmailRole.ownerCoOwner,
        approved: ownerCoOwners[i].approved,
      })
    }
  }

  // Operator
  // Note: Since old operators that were removed have no role, it is okay
  // to just filter them out
  // (this also means they will not get any emails about this change)
  const operators = answers.operators?.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  if (roles.includes(EmailRole.operator) && operators) {
    for (let i = 0; i < operators.length; i++) {
      recipientList.push({
        ssn: operators[i].nationalId!,
        name: operators[i].name!,
        email: operators[i].email,
        phone: operators[i].phone,
        role: EmailRole.operator,
        approved: operators[i].approved,
      })
    }
  }

  return recipientList
}

export const getRecipientBySsn = (
  answers: ChangeOperatorOfVehicleAnswers,
  ssn: string,
): EmailRecipient | undefined => {
  // Owner
  if (answers.owner?.nationalId === ssn) {
    return {
      ssn: answers.owner.nationalId,
      name: answers.owner.name,
      email: answers.owner.email,
      phone: answers.owner.phone,
      role: EmailRole.owner,
      approved: true,
    }
  }

  // Owner's co-owners
  const ownerCoOwners = answers.ownerCoOwner
  if (ownerCoOwners) {
    for (let i = 0; i < ownerCoOwners.length; i++) {
      if (ownerCoOwners[i].nationalId === ssn) {
        return {
          ssn: ownerCoOwners[i].nationalId,
          name: ownerCoOwners[i].name,
          email: ownerCoOwners[i].email,
          phone: ownerCoOwners[i].phone,
          role: EmailRole.ownerCoOwner,
          approved: ownerCoOwners[i].approved,
        }
      }
    }
  }

  // Operator
  // Note: Since old operators that were removed have no role, it is okay
  // to just filter them out
  const operators = answers.operators?.filter(
    ({ wasRemoved }) => wasRemoved !== 'true',
  )
  if (operators) {
    for (let i = 0; i < operators.length; i++) {
      if (operators[i].nationalId === ssn) {
        return {
          ssn: operators[i].nationalId!,
          name: operators[i].name!,
          email: operators[i].email,
          phone: operators[i].phone,
          role: EmailRole.operator,
          approved: operators[i].approved,
        }
      }
    }
  }
}
