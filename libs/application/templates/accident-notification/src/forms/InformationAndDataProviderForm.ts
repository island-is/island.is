import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildMultiField,
  buildCustomField,
  buildRadioField,
  buildSubSection,
} from '@island.is/application/core'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import { DataProviderTypes } from '../types'
import { externalData, application, hindrances } from '../lib/messages'
import { NO, YES } from '../constants'

export const InformationAndDataProviderForm: Form = buildForm({
  id: 'InformationAndDataProviderForm',
  title: application.general.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'informationAndDataProviderForm',
      title: externalData.agreementDescription.sectionTitle,
      children: [
        buildMultiField({
          title: externalData.agreementDescription.sectionTitle,
          id: 'agreementDescriptionMultiField',
          children: [
            buildCustomField({
              id: 'agreementDescriptionCustomField',
              title: '',
              component: 'AgreementDescription',
            }),
          ],
        }),
        buildSubSection({
          id: 'informationAndDataProviderForm',
          title: externalData.dataProvider.sectionTitle,
          children: [
            buildExternalDataProvider({
              title: externalData.dataProvider.pageTitle,
              id: 'approveExternalData',
              subTitle: externalData.dataProvider.subTitle,
              description: '',
              checkboxLabel: externalData.dataProvider.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: DataProviderTypes.NationalRegistry,
                  title: externalData.nationalRegistry.title,
                  subTitle: externalData.nationalRegistry.description,
                }),
                buildDataProviderItem({
                  id: 'userProfile',
                  type: DataProviderTypes.UserProfile,
                  title: externalData.userProfile.title,
                  subTitle: externalData.userProfile.description,
                }),
                buildDataProviderItem({
                  id: 'revAndCustoms',
                  type: '',
                  title: externalData.revAndCustoms.title,
                  subTitle: externalData.revAndCustoms.description,
                }),
                buildDataProviderItem({
                  id: 'notifications',
                  type: '',
                  title: externalData.notifications.title,
                  subTitle: externalData.notifications.description,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'hindrances',
      title: hindrances.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'timePassedHindrancesMultiField',
          title: '',
          children: [
            buildRadioField({
              id: 'timePassedHindrance',
              defaultValue: YES,
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
              title: hindrances.timePassedHindrance.radioFieldTitle,
              width: 'half',
              largeButtons: true,
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'timePassedHindranceFielAlertMessage',
              title: hindrances.timePassedHindrance.errorTitle,
              description: hindrances.timePassedHindrance.errorDescription,
              condition: (formValue) => formValue.timePassedHindrance === NO,
            }),
          ],
        }),
        buildMultiField({
          id: 'carHindrancesMultiField',
          title: '',
          children: [
            buildRadioField({
              id: 'carAccidentHindrance',
              defaultValue: NO,
              options: [
                { value: YES, label: application.general.yesOptionLabel },
                { value: NO, label: application.general.noOptionLabel },
              ],
              title: hindrances.carAccident.radioFieldTitle,
              width: 'half',
              largeButtons: true,
            }),
            buildCustomField({
              component: 'FieldAlertMessage',
              id: 'carAccidentHindranceFielAlertMessage',
              title: hindrances.carAccident.errorTitle,
              description: hindrances.carAccident.errorDescription,
              condition: (formValue) => formValue.carAccidentHindrance === YES,
            }),
          ],
        }),
      ],
    }),
  ],
})
