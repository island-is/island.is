import {
  buildForm,
  buildSection,
  buildMultiField,
  buildImageField,
  buildDescriptionField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import { MovingSearching } from '@island.is/application/assets/graphics'
import {
  assigneeWaitingApprovedDescription,
  assigneeWaitingPendingDescription,
  assigneeWaitingRejectedDescription,
  assigneeWaitingIntroDescription,
} from '../../../utils/assigneeWaitingUtils'
import { hasRejectedAssigneesInAnswers } from '../../../utils/assigneeRejectionUtils'
import * as m from '../../../lib/messages'
import { hasUnsignedApprovalNames } from '../../../utils/assigneeUtils'

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
              id: 'assigneeWaitingDescription',
              description: assigneeWaitingIntroDescription,
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingDescription2',
              description: m.assigneeWaiting.introDescription2,
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingDescription3',
              description: m.assigneeWaiting.introDescription3,
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingApproved',
              description: assigneeWaitingApprovedDescription,
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingPending',
              description: assigneeWaitingPendingDescription,
              condition: hasUnsignedApprovalNames,
              marginBottom: 4,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingRejected',
              description: assigneeWaitingRejectedDescription,
              condition: (answers) => hasRejectedAssigneesInAnswers(answers),
              marginBottom: 8,
            }),
            buildImageField({
              id: 'assigneeWaitingImage',
              image: MovingSearching,
              marginTop: 4,
            }),
          ],
        }),
      ],
    }),
  ],
})
