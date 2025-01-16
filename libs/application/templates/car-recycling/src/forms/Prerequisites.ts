import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes, IdentityApi } from '@island.is/application/types'
import Logo from '../assets/Logo'

import { carRecyclingMessages } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'CarRecyclingPrerequisites',
  title: carRecyclingMessages.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: carRecyclingMessages.pre.prerequisitesSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: carRecyclingMessages.pre.externalDataSubSection,
          subTitle: carRecyclingMessages.pre.externalDataDescription,
          checkboxLabel: carRecyclingMessages.pre.checkboxProvider,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
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
              provider: IdentityApi,
              title: carRecyclingMessages.pre.nationalRegistryInformationTitle,
              subTitle:
                carRecyclingMessages.pre.nationalRegistryInformationSubTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'vehiclesOverviewSection',
      title: carRecyclingMessages.cars.list,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: carRecyclingMessages.review.confirmSectionTitle,
      children: [],
    }),
  ],
})
