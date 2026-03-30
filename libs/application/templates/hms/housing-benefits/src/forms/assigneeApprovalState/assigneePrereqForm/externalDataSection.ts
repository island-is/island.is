import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { PersonalTaxReturnApi } from '../../../dataProviders'
import { NationalRegistryApi } from '../../../dataProviders'
import { DefaultEvents } from '@island.is/application/types'

export const externalDataSection = buildSection({
  id: 'assigneePrereqExternalData',
  title: m.assigneeApproval.title,
  children: [
    buildExternalDataProvider({
      id: 'assigneePrereqExternalData',
      title: m.assigneeApproval.title,
      subTitle: m.assigneeApproval.externalDataSubTitle,
      checkboxLabel: m.assigneeApproval.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryApi,
          title: m.assigneeApproval.nationalRegistryTitle,
          subTitle: m.assigneeApproval.nationalRegistrySubTitle,
        }),
        buildDataProviderItem({
          provider: PersonalTaxReturnApi,
          title: m.prereqMessages.taxTitle,
          subTitle: m.prereqMessages.taxSubtitle,
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
