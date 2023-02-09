import { ChangeCoOwnerOfVehicleAnswers } from '@island.is/application/templates/transport-authority/change-co-owner-of-vehicle'
import { EmailRecipient, EmailRole } from './types'
import { join } from 'path'

export const pathToAsset = (file: string) => {
  return join(
    __dirname,
    `./transport-authority-change-co-owner-of-vehicle-assets/${file}`,
  )
}

export const getAllRoles = (): EmailRole[] => {
  return [EmailRole.owner, EmailRole.currentCoOwner, EmailRole.addedCoOwner]
}

export const getRoleNameById = (roleId: EmailRole): string | undefined => {
  switch (roleId) {
    case EmailRole.owner:
      return 'Eigandi'
    case EmailRole.currentCoOwner:
      return 'Núv. meðeigandi'
    case EmailRole.addedCoOwner:
      return 'Nýr meðeigandi'
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
  answers: ChangeCoOwnerOfVehicleAnswers,
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

  // Current co-owners
  const currentCoOwners = answers.ownerCoOwners
  if (roles.includes(EmailRole.currentCoOwner) && currentCoOwners) {
    for (let i = 0; i < currentCoOwners.length; i++) {
      if (currentCoOwners[i].wasRemoved !== 'true') {
        recipientList.push({
          ssn: currentCoOwners[i].nationalId,
          name: currentCoOwners[i].name,
          email: currentCoOwners[i].email,
          phone: currentCoOwners[i].phone,
          role: EmailRole.currentCoOwner,
          approved: currentCoOwners[i].approved,
        })
      }
    }
  }

  // Added co-owners
  const addedCoOwners = answers.coOwners
  if (roles.includes(EmailRole.addedCoOwner) && addedCoOwners) {
    for (let i = 0; i < addedCoOwners.length; i++) {
      recipientList.push({
        ssn: addedCoOwners[i].nationalId,
        name: addedCoOwners[i].name,
        email: addedCoOwners[i].email,
        phone: addedCoOwners[i].phone,
        role: EmailRole.addedCoOwner,
        approved: addedCoOwners[i].approved,
      })
    }
  }

  return recipientList
}

export const getRecipientBySsn = (
  answers: ChangeCoOwnerOfVehicleAnswers,
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

  // Current co-owners
  const currentCoOwners = answers.ownerCoOwners
  if (currentCoOwners) {
    for (let i = 0; i < currentCoOwners.length; i++) {
      if (currentCoOwners[i].nationalId === ssn) {
        return {
          ssn: currentCoOwners[i].nationalId,
          name: currentCoOwners[i].name,
          email: currentCoOwners[i].email,
          phone: currentCoOwners[i].phone,
          role: EmailRole.currentCoOwner,
          approved: currentCoOwners[i].approved,
        }
      }
    }
  }

  // Added co-owners
  const addedCoOwners = answers.coOwners
  if (addedCoOwners) {
    for (let i = 0; i < addedCoOwners.length; i++) {
      if (addedCoOwners[i].nationalId === ssn) {
        return {
          ssn: addedCoOwners[i].nationalId,
          name: addedCoOwners[i].name,
          email: addedCoOwners[i].email,
          phone: addedCoOwners[i].phone,
          role: EmailRole.addedCoOwner,
          approved: addedCoOwners[i].approved,
        }
      }
    }
  }
}
