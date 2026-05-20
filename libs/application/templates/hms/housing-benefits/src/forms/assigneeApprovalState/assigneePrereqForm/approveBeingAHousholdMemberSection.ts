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

export const approveBeingAHousholdMemberSection = buildSection({
  id: 'approveBeingAHousholdMemberSection',
  title: 'Staðfesting á heimili',
  children: [
    buildMultiField({
      id: 'approveBeingAHousholdMember',
      title: 'Staðfesting á heimili',
      children: [
        buildRadioField({
          id: (application, user) =>
            nationalIdPreface(
              application,
              user,
              'approveBeingAHousholdMemberRadio',
            ),
          title: 'Ert þú heimilismaður í Funafold 10?',
          options: [
            { label: 'Yes', value: YES },
            { label: 'No', value: NO },
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
          title: 'Halda áfram',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.REJECT,
              name: 'Hafna umsókn',
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
