import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import {
  NationalRegistryUserApi,
  UserProfileApi,
  checkResidence,
  grindaVikHousing,
} from '../dataProviders'
import { prerequisites, application } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'HomeSupportPrerequisites',
  title: application.general.name,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: prerequisites.general.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: prerequisites.general.sectionTitle,
          subTitle: coreMessages.externalDataTitle,
          checkboxLabel: prerequisites.general.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: coreMessages.buttonNext,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: checkResidence,
              title: prerequisites.dataProviders.nationalRegistryTitle,
              subTitle: prerequisites.dataProviders.nationalRegistryDescription,
            }),
            buildDataProviderItem({
              provider: grindaVikHousing,
              title: 'Grindavík Housing',
              subTitle: 'Get grindavik housing',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: prerequisites.dataProviders.userProfileTitle,
              subTitle: prerequisites.dataProviders.userProfileDescription,
            }),
          ],
        }),
      ],
    }),
  ],
})
