import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { CompanyRegistryApi, IdentityApi, UserProfileApi } from '../../dataProviders'
import { messages } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: messages.prerequisites.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: messages.prerequisites.formTitle,
          description: messages.prerequisites.formIntro,
          checkboxLabel: messages.dataProviders.checkboxLabel,
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
          dataProviders: [
            buildDataProviderItem({
              provider: CompanyRegistryApi,
              title: messages.dataProviders.companyDataTitle,
              subTitle: messages.dataProviders.companyDataIntro,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: messages.dataProviders.userProfileTitle,
              subTitle: messages.dataProviders.userProfileIntro,
            }),
            buildDataProviderItem({
              provider: IdentityApi,
              title: messages.dataProviders.nationalRegistryTitle,
              subTitle: messages.dataProviders.nationalRegistryIntro,
            }),
          ],
        }),
      ],
    }),
  ],
})
