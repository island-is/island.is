import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { externalData } from '../../lib/messages'
import { preInformation } from './preInformation'
import { CurrentVehiclesApi } from '../../dataProviders'
import { TransportAuthorityLogo } from '@island.is/application/assets/institution-logos'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesForm',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: TransportAuthorityLogo,
  children: [
    preInformation,
    buildSection({
      id: 'externalData',
      title: externalData.dataProvider.sectionTitle,
      tabTitle: externalData.dataProvider.sectionTitle,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
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
              provider: CurrentVehiclesApi,
              title: externalData.transportAuthority.title,
              subTitle: externalData.transportAuthority.subTitle,
            }),
          ],
        }),
      ],
    }),
  ],
})
