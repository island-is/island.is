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
} from '../../../dataProviders'
import { DefaultEvents } from '@island.is/application/types'
import { nationalIdPreface } from '../../../utils/assigneeUtils'

export const externalDataSection = buildSection({
  condition: (answers, externalData) => {
    console.log('answers: ', answers)
    console.log('externalData: ', externalData)

    return true
  },
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
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeUserProfile'),
          provider: AssigneeUserProfileApi,
          title: m.prereqMessages.userProfileTitle,
          subTitle: m.prereqMessages.userProfileSubtitle,
        }),
        buildDataProviderItem({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeNationalRegistry'),
          provider: AssigneeNationalRegistryApi,
          title: m.assigneeApproval.nationalRegistryTitle,
          subTitle: m.assigneeApproval.nationalRegistrySubTitle,
        }),
        buildDataProviderItem({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeTaxReturn'),
          provider: AssigneePersonalTaxReturnApi,
          title: m.assigneeApproval.taxTitle,
          subTitle: m.assigneeApproval.taxSubtitle,
        }),
      ],
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: coreMessages.buttonNext,
            type: 'primary',
          },
        ],
      }),
    }),
  ],
})
