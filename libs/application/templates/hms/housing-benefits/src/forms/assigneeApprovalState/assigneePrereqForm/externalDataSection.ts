import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import * as m from '../../../lib/messages'
import { PersonalTaxReturnApi, testApi } from '../../../dataProviders'
import { NationalRegistryApi } from '../../../dataProviders'
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
      subTitle: m.assigneeApproval.externalDataSubTitle,
      checkboxLabel: m.assigneeApproval.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          id: (application, user) =>
            nationalIdPreface(application, user, 'test'),
          provider: testApi,
          title: 'Test',
          subTitle: 'Test',
        }),
        // buildDataProviderItem({
        //   id: (application, user) =>
        //     nationalIdPreface(application, user, 'nationalRegistry'),
        //   provider: NationalRegistryApi,
        //   title: m.assigneeApproval.nationalRegistryTitle,
        //   subTitle: m.assigneeApproval.nationalRegistrySubTitle,
        // }),
        // buildDataProviderItem({
        //   id: (application, user) =>
        //     nationalIdPreface(application, user, 'taxExternalData'),
        //   provider: PersonalTaxReturnApi,
        //   title: m.prereqMessages.taxTitle,
        //   subTitle: m.prereqMessages.taxSubtitle,
        // }),
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
