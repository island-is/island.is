import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import {
  EligibleVehiclesApi,
  IdentityApi,
  UserProfileApi,
} from '../../dataProviders'
import { m } from '../../lib/messages'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'about',
      tabTitle: m.about.sectionTitle,
      children: [
        buildMultiField({
          id: 'aboutMultiField',
          title: m.about.title,
          children: [
            buildDescriptionField({
              id: 'about.description',
              description: m.about.description,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'conditions',
      tabTitle: m.prerequisites.tabTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: m.prerequisites.title,
          checkboxLabel: m.prerequisites.checkbox,
          dataProviders: [
            buildDataProviderItem({
              provider: EligibleVehiclesApi,
              title: m.prerequisites.vehiclesTitle,
              subTitle: m.prerequisites.vehiclesSubTitle,
            }),
            buildDataProviderItem({
              provider: IdentityApi,
              title: m.prerequisites.nationalRegistryTitle,
              subTitle: m.prerequisites.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.prerequisites.userProfileTitle,
              subTitle: m.prerequisites.userProfileSubTitle,
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
