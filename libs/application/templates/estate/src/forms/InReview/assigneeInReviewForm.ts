import {
  buildForm,
  buildSection,
  buildMultiField,
  buildDescriptionField,
  buildSubmitField,
  buildAlertMessageField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes, DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { EstateMember } from '../../types'
import { nationalIdsMatch } from '../../lib/utils/helpers'
import { commonOverviewFields } from '../OverviewSections/commonFields'
import { overviewAssetsAndDebts } from '../OverviewSections/assetsAndDebts'
import { overviewAttachments } from '../OverviewSections/attachments'
import { representativeOverview } from '../OverviewSections/representative'
import { EstateTypes } from '../../lib/constants'

export const assigneeInReviewForm: Form = buildForm({
  id: 'assigneeInReviewForm',
  title: m.inReviewGeneralTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'assigneeReview',
      title: m.inReviewGeneralTitle,
      children: [
        buildMultiField({
          id: 'assigneeReview.overview',
          title: m.inReviewGeneralTitle,
          description: m.assigneeInReviewDescription,
          children: [
            // Include all the same overview fields that the applicant sees
            ...commonOverviewFields,
            ...overviewAssetsAndDebts,
            ...overviewAttachments,
            ...representativeOverview,
            buildAlertMessageField({
              id: 'assigneeReview.approved',
              title: m.assigneeApprovedTitle,
              message: m.assigneeApprovedDescription,
              alertType: 'success',
              marginTop: 7,
              marginBottom: 0,
              condition: (formValue, externalData, user) => {
                if (!user?.profile?.nationalId) return false
                const actorNationalId = user.profile.nationalId
                const estateMembers = getValueViaPath<EstateMember[]>(
                  formValue,
                  'estate.estateMembers',
                  [],
                )
                const currentMember = estateMembers?.find((member) =>
                  nationalIdsMatch(member.nationalId, actorNationalId),
                )
                return currentMember?.approved === true
              },
            }),
            buildDescriptionField({
              id: 'assigneeReview.info',
              title: m.assigneeInReviewInfoTitle,
              description: m.assigneeInReviewDescription,
              titleVariant: 'h3',
              space: 6,
              marginTop: 7,
              condition: (formValue, externalData, user) => {
                if (!user?.profile?.nationalId) return true
                const actorNationalId = user.profile.nationalId
                const estateMembers = getValueViaPath<EstateMember[]>(
                  formValue,
                  'estate.estateMembers',
                  [],
                )
                const currentMember = estateMembers?.find((member) =>
                  nationalIdsMatch(member.nationalId, actorNationalId),
                )
                return currentMember?.approved !== true
              },
            }),
            buildSubmitField({
              id: 'assigneeReview.actions',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.REJECT,
                  name: m.assigneeReviewReject.defaultMessage,
                  type: 'reject',
                },
                {
                  event: DefaultEvents.APPROVE,
                  name: m.assigneeReviewApprove.defaultMessage,
                  type: 'primary',
                },
              ],
              condition: (formValue, externalData, user) => {
                if (!user?.profile?.nationalId) return true
                const actorNationalId = user.profile.nationalId
                const estateMembers = getValueViaPath<EstateMember[]>(
                  formValue,
                  'estate.estateMembers',
                  [],
                )
                const currentMember = estateMembers?.find((member) =>
                  nationalIdsMatch(member.nationalId, actorNationalId),
                )
                return currentMember?.approved !== true
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
