import { ApplicationWithAttachments } from '@island.is/application/types'
import { SharedTemplateApiService } from '../../../shared'
import { generateApplicationSubmittedEmail } from './emailGenerators/applicationSubmittedEmail'
import { generateApplicationSubmittedSms } from './smsGenerators/applicationSubmittedSms'
import { EmailRecipient, EmailRole, UserProfile } from './types'
import { ChangeMachineSupervisorAnswers } from '@island.is/application/templates/aosh/change-machine-supervisor'
import { EmailTemplateGeneratorProps } from '../../../../types'
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
  answers: ChangeMachineSupervisorAnswers,
  roles: Array<EmailRole>,
  userProfile: UserProfile,
): Array<EmailRecipient> => {
  const recipientList: Array<EmailRecipient> = []

  // Owner
  if (roles.includes(EmailRole.owner) && userProfile && answers.supervisor) {
    recipientList.push({
      ssn: userProfile.nationalId,
      name: userProfile.name,
      email: userProfile.email,
      phone: userProfile.mobilePhoneNumber,
      role: EmailRole.owner,
    })
  }

  // Supervisor
  if (roles.includes(EmailRole.supervisor) && answers.supervisor) {
    recipientList.push({
      ssn: answers.supervisor?.nationalId || '',
      name: answers.supervisor?.name || '',
      email: answers.supervisor.email,
      phone: answers.supervisor.phone,
      role: EmailRole.supervisor,
    })
  }

  return recipientList
}

export const sendNotificationsToRecipients = async (
  recipientList: EmailRecipient[],
  supervisorName: string,
  sharedTemplateAPIService: SharedTemplateApiService,
  application: ApplicationWithAttachments,
) => {
  const errors: string[] = []
  for (let i = 0; i < recipientList.length; i++) {
    if (recipientList[i].email) {
      await sharedTemplateAPIService
        .sendEmail(
          (props: EmailTemplateGeneratorProps) =>
            generateApplicationSubmittedEmail(
              props,
              recipientList[i],
              supervisorName,
            ),
          application,
        )
        .catch(() => {
          errors.push(
            `Error sending email about submit application to ${recipientList[i].email}`,
          )
        })
    }

    if (recipientList[i].phone) {
      await sharedTemplateAPIService
        .sendSms(
          () =>
            generateApplicationSubmittedSms(
              application,
              recipientList[i],
              supervisorName,
            ),
          application,
        )
        .catch(() => {
          errors.push(
            `Error sending sms about submit application to ${recipientList[i].phone}`,
          )
        })
    }
  }
  return errors
}

export const cleanPhoneNumber = (phoneNumber: string) => {
  return phoneNumber.replace(/[-+]/g, '')
}
