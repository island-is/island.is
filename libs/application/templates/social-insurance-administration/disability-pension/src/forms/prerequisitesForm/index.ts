import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes, IdentityApi, NationalRegistrySpouseApi, UserProfileApi } from '@island.is/application/types'
import { disabilityPensionFormMessage } from '../../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'


export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  title: disabilityPensionFormMessage.prerequisites.title,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: disabilityPensionFormMessage.prerequisites.title,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: socialInsuranceAdministrationMessage.pre.externalDataSection,
          subTitle: socialInsuranceAdministrationMessage.pre.externalDataDescription,
          dataProviders: [
            buildDataProviderItem({
              provider: UserProfileApi,
              title: 'User profile',
              subTitle: 'User profile',
              }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: 'Spouse',
              subTitle: 'Spouse',
              }),
            buildDataProviderItem({
              provider: IdentityApi,
              title: 'ident',
              subTitle: 'ity',
              }),
            // Add more data providers as needed
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
    }),
  ],
})
