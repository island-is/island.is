import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { NotificationType } from '../../../../../notification/notificationsTemplates'
import { CreateNotificationResponse } from 'aws-sdk/clients/budgets'

export const sendHnipp = async (
  application: Application,
  sendNotification: (data: {
    type: NotificationType
    messageParties: { recipient: string }
    applicationId?: string
  }) => Promise<CreateNotificationResponse>,
) => {
  const assigneeNationalId = getValueViaPath<string>(
    application.answers,
    'assigneeNationalIdWithName.nationalId',
  )

  if (!assigneeNationalId) {
    throw new Error('Assignee nationalId is required')
  }

  // This sends a hnipp to the assignee
  try {
    await sendNotification({
      type: NotificationType.ReferenceTemplate,
      messageParties: {
        recipient: assigneeNationalId,
      },
      applicationId: application.id,
    })
  } catch (error) {
    // Here we just swallow the error in order for this to work locally
    // For production we need to handle the error better
  }
}
