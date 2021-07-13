import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import { DataProviderTypes } from '../types'
import * as m from '../lib/messages'

export const InformationAndDataProviderForm: Form = buildForm({
  id: 'InformationAndDataProviderForm',
  title: m.application.general.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'informationAndDataProviderForm',
      title: m.externalData.general.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: m.externalData.general.pageTitle,
          id: 'approveExternalData',
          subTitle: m.externalData.general.subTitle,
          description: '',
          checkboxLabel: m.externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: DataProviderTypes.NationalRegistry,
              title: m.externalData.nationalRegistry.title,
              subTitle: m.externalData.nationalRegistry.description,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: DataProviderTypes.UserProfile,
              title: m.externalData.userProfile.title,
              subTitle: m.externalData.userProfile.description,
            }),
            buildDataProviderItem({
              id: 'revAndCustoms',
              type: '',
              title: m.externalData.revAndCustoms.title,
              subTitle: m.externalData.revAndCustoms.description,
            }),
            buildDataProviderItem({
              id: 'notifications',
              type: '',
              title: m.externalData.notifications.title,
              subTitle: m.externalData.notifications.description,
            }),
          ],
        }),
      ],
    }),
  ],
})
