import {
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { AssigneeNationalRegistryApi } from '../../../dataProviders'
import { nationalIdPreface } from '../../../utils/assigneeUtils'
import { buildDataProviderItem } from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { shouldShowRefetchNationalRegistrySection } from '../../../utils/conditions'

export const refetchNationalRegistrySection = buildSection({
  id: 'refetchNationalRegistrySection',
  title: m.assigneeDraft.refetchTitle,
  condition: shouldShowRefetchNationalRegistrySection,
  children: [
    buildExternalDataProvider({
      id: (application, user) =>
        nationalIdPreface(application, user, 'refetchNationalRegistry'),
      title: m.assigneeDraft.refetchTitle,
      subTitle: m.assigneeDraft.refetchSubTitle,
      dataProviders: [
        buildDataProviderItem({
          id: (application, user) =>
            nationalIdPreface(application, user, 'assigneeNationalRegistry'),
          provider: AssigneeNationalRegistryApi,
          title: m.assigneeApproval.nationalRegistryTitle,
          subTitle: m.assigneeApproval.nationalRegistrySubTitle,
        }),
      ],
      submitField: buildSubmitField({
        id: 'wrongHome.submit',
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
