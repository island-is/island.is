import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import {
  CurrentVehiclesApi,
  NationalRegistryIndividualApi,
  UserProfileApi,
} from '../../dataProviders'
import { confirmation } from '../../lib/messages/confirmation'
import { information } from '../../lib/messages/information'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  title: '',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      condition: (_, application) => {
        console.log('application', application)
        return true
      },
      children: [
        buildExternalDataProvider({
          title: externalData.dataProvider.pageTitle,
          id: 'approveExternalData',
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: '',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.submitButton,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryIndividualApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              provider: CurrentVehiclesApi,
              title: 'TODO',
              subTitle: 'TODO',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'selectVehicle',
      title: information.labels.pickVehicle.title,
      children: [],
    }),
    buildSection({
      id: 'vehicleInformation',
      title: 'TODO',
      children: [],
    }),
    buildSection({
      id: 'grantInformation',
      title: 'TODO',
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [],
    }),
  ],
})
