import {
  buildForm,
  buildSection,
  buildMultiField,
  buildImageField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Application, FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { MovingSearching } from '@island.is/application/assets/graphics'
import {
  getSignedApprovalNames,
  getUnsignedApprovalNames,
} from '../../../utils/assigneeUtils'
import * as m from '../../../lib/messages'

const getApprovedDescription = (application: Application) => ({
  ...m.assigneeWaiting.approvedList,
  values: {
    names: getSignedApprovalNames(application).join(' \n\n * ') || '—',
  },
})

const getPendingDescription = (application: Application) => ({
  ...m.assigneeWaiting.pendingList,
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
      tabTitle: m.assigneeWaiting.title,
      children: [
        buildMultiField({
          id: 'assigneeWaitingMultiField',
          title: m.assigneeWaiting.title,
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
