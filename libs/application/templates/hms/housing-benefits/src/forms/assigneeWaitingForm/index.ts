import {
  buildForm,
  buildSection,
  buildMultiField,
  buildImageField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Application, FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { assigneeWaiting as assigneeWaitingMessages } from '../../lib/messages/assigneeWaitingMessages'
import { MovingSearching } from '@island.is/application/assets/graphics'
import {
  getSignedApprovalNames,
  getUnsignedApprovalNames,
} from '../../utils/assigneeUtils'

const getApprovedDescription = (application: Application) => ({
  ...assigneeWaitingMessages.approvedList,
  values: {
    names: getSignedApprovalNames(application).join(' \n\n * ') || '—',
  },
})

const getPendingDescription = (application: Application) => ({
  ...assigneeWaitingMessages.pendingList,
  values: {
    names: getUnsignedApprovalNames(application).join(' \n\n * ') || '—',
  },
})

export const AssigneeWaitingForm = buildForm({
  id: 'AssigneeWaiting',
  mode: FormModes.IN_PROGRESS,
  logo: HmsLogo,
  children: [
    buildSection({
      id: 'assigneeWaitingSection',
      tabTitle: assigneeWaitingMessages.title,
      children: [
        buildMultiField({
          id: 'assigneeWaitingMultiField',
          title: assigneeWaitingMessages.title,
          children: [
            buildDescriptionField({
              id: 'assigneeWaitingApproved',
              description: getApprovedDescription,
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingPending',
              description: getPendingDescription,
              marginBottom: 8,
            }),
            buildImageField({
              id: 'assigneeWaitingImage',
              image: MovingSearching,
            }),
          ],
        }),
      ],
    }),
  ],
})
