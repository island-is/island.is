import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  DefaultEvents,
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { FormModes } from '@island.is/application/types'
import { HomeLodgingsApi } from '../../dataProviders'
import { applicationMessages as m } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: m.prerequisitesTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.dataCollectionTitle,
          subTitle: m.dataCollectionSubtitle,
          checkboxLabel: m.dataCollectionConsent,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryV3UserApi,
              title: m.nationalRegistryTitle,
              subTitle: m.nationalRegistrySubtitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.userProfileTitle,
              subTitle: m.userProfileSubtitle,
            }),
            buildDataProviderItem({
              provider: HomeLodgingsApi,
              title: m.homeLodgingsProviderTitle,
              subTitle: m.homeLodgingsProviderSubtitle,
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
    }),
  ],
})
