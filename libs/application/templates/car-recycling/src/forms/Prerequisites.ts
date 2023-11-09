import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { carRecyclingMessages } from '../lib/messages'
import { CurrentVehiclesApi } from '../dataProviders'

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
            // buildDataProviderItem({
            //   provider: CurrentVehiclesApi,
            //   title: 'Samgöngustofa',
            //   subTitle: 'AThuga bíldruslurnar',
            // }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'pre-carsList',
      title: carRecyclingMessages.cars.list,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: carRecyclingMessages.review.confirmSectionTitle,
      children: [],
    }),
  ],
})
