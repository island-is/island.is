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
              id: 'assigneeWaitingDescription',
              description:
                'Umsókn um húsnæðisbætur hefur verið fyllt út af hálfu umsækjanda. Núna þurfa allir heimilismenn yfir 18 ára að samþykkja að upplýsinga um þá sé aflað til að geta unnið umsóknina áfram.',
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingDescription2',
              description:
                'Í einhverjum tilfellum þurfa heimilismenna að skila eignayfirlýsingu og tekjuupplýsingum með sínu samþykki.',
              marginBottom: 2,
            }),
            buildDescriptionField({
              id: 'assigneeWaitingDescription3',
              description:
                'Eftir að allir heimilismenn hafa samþykkt gagnaöflun þarf umsækjandi að lokum að skrá sig inn og yfirfara áður en hann sendir umsóknina inn til vinnslu.',
              marginBottom: 4,
            }),
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
