import { isHouseholdMemberApproved } from '../../../utils/conditions'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import {
  buildSection,
  buildMultiField,
  buildRadioField,
  YES,
  NO,
  buildSubmitField,
  getValueViaPath,
  buildHiddenInput,
} from '@island.is/application/core'
import { Application, DefaultEvents } from '@island.is/application/types'
import * as m from '../../../lib/messages'
import { getApplicationCardRentalSummary } from '../../../utils/applicationCardSummary'

export const approveBeingAHousholdMemberSection = buildSection({
  id: 'approveBeingAHousholdMemberSection',
  title: m.assigneeApproval.householdMemberSectionTitle,
  children: [
    buildMultiField({
      id: 'approveBeingAHousholdMember',
      title: m.assigneeApproval.householdMemberSectionTitle,
      children: [
        buildRadioField({
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'approveBeingAHousholdMemberRadio',
            ),
          title: (application: Application) => ({
            ...m.assigneeApproval.householdMemberRadioTitle,
            values: {
              address:
                getApplicationCardRentalSummary(application).rentalAddress ||
                '—',
            },
          }),
          options: [
            { label: m.miscMessages.yes, value: YES },
            { label: m.miscMessages.no, value: NO },
          ],
        }),
        buildSubmitField({
          condition: (answers, externalData, user) => {
            if (!user) return false
            const application = { answers, externalData } as Application
            return (
              getValueViaPath(
                answers,
                nationalIdPreface(
                  application,
                  user,
                  'approveBeingAHousholdMemberRadio',
                ),
              ) === NO
            )
          },
          id: 'approveBeingAHousholdMemberSubmit',
          title: m.assigneeApproval.prereqContinueButton,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.REJECT,
              name: m.assigneeApproval.householdMemberRejectButton,
              type: 'reject',
            },
          ],
        }),
        buildHiddenInput({
          condition: isHouseholdMemberApproved,
          id: 'approveBeingAHousholdMemberHidden',
        }),
      ],
    }),
  ],
})
