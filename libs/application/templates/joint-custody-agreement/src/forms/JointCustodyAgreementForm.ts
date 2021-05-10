import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import { DataProviderTypes } from '..'
import * as m from '../lib/messages'

export const JointCustodyAgreementForm: Form = buildForm({
  id: 'JointCustodyAgreementForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'jointCustodyAgreementForm',
      title: m.section.backgroundInformation,
      children: [
        buildSubSection({
          id: 'externalData',
          title: m.externalData.general.sectionTitle,
          children: [
            buildExternalDataProvider({
              title: m.externalData.general.pageTitle,
              id: 'approveExternalData',
              subTitle: m.externalData.general.subTitle,
              description: m.externalData.general.description,
              checkboxLabel: m.externalData.general.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  id: 'nationalRegistry',
                  type: DataProviderTypes.NationalRegistry,
                  title: m.externalData.applicant.title,
                  subTitle: m.externalData.applicant.subTitle,
                }),
                buildDataProviderItem({
                  id: '',
                  type: '',
                  title: m.externalData.children.title,
                  subTitle: m.externalData.children.subTitle,
                }),
                buildDataProviderItem({
                  id: 'userProfile',
                  type: DataProviderTypes.UserProfile,
                  title: '',
                  subTitle: '',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'anotherSection',
          title: 'title',
          children: [
            buildTextField({
              id: 'applicant.nationalId',
              title: 'Kennitala',
              format: '######-####',
              backgroundColor: 'blue',
            }),
          ],
        }),
      ],
    }),
  ],
})
