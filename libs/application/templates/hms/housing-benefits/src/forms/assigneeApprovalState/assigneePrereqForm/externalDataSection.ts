import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import {
  AssigneeUserProfileApi,
  AssigneeNationalRegistryApi,
  AssigneePersonalTaxReturnApi,
  AssigneeChildrenCustodyInformationApiV3,
} from '../../../dataProviders'
import { DefaultEvents } from '@island.is/application/types'
import {
  nationalIdPreface,
  assigneeExternalDataKey,
} from '../../../utils/assigneeUtils'
import { isHouseholdMemberApproved } from '../../../utils/conditions'

export const externalDataSection = buildSection({
  condition: isHouseholdMemberApproved,
  id: 'assigneePrereqExternalData',
  title: m.assigneeApproval.title,
  children: [
    buildExternalDataProvider({
      id: (application, user) =>
        nationalIdPreface(application, user, 'approveExternalData'),
      title: m.assigneeApproval.title,
      checkboxLabel: m.assigneeApproval.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          id: (_application, user) =>
            assigneeExternalDataKey(
              user.profile.nationalId,
              'assigneeUserProfile',
            ),
          provider: AssigneeUserProfileApi,
          title: m.prereqMessages.userProfileTitle,
          subTitle: m.prereqMessages.userProfileSubtitle,
        }),
        buildDataProviderItem({
          id: (_application, user) =>
            assigneeExternalDataKey(
              user.profile.nationalId,
              'assigneeNationalRegistry',
            ),
          provider: AssigneeNationalRegistryApi,
          title: m.assigneeApproval.nationalRegistryTitle,
          subTitle: m.assigneeApproval.nationalRegistrySubTitle,
        }),
        buildDataProviderItem({
          id: (_application, user) =>
            assigneeExternalDataKey(
              user.profile.nationalId,
              'assigneeTaxReturn',
            ),
          provider: AssigneePersonalTaxReturnApi,
          title: m.assigneeApproval.taxTitle,
          subTitle: m.assigneeApproval.taxSubtitle,
        }),
        buildDataProviderItem({
          id: (_application, user) =>
            assigneeExternalDataKey(
              user.profile.nationalId,
              'assigneeChildrenCustody',
            ),
          provider: AssigneeChildrenCustodyInformationApiV3,
          title: m.prereqMessages.childrenCustodyTitle,
          subTitle: m.prereqMessages.childrenCustodySubtitle,
        }),
      ],
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.EDIT,
            name: coreMessages.buttonNext,
            type: 'primary',
          },
        ],
      }),
    }),
  ],
})
