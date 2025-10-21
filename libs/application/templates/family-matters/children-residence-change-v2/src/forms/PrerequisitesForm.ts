import {
  buildForm,
  buildSection,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../lib/messages'
import {
  ChildrenCustodyInformationApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: m.application.name,
  logo: DistrictCommissionersLogo,
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'PrerequisitesSection',
      title: m.externalData.general.sectionTitle,
      children: [
        buildExternalDataProvider({
          title: m.externalData.general.pageTitle,
          id: 'approveExternalData',
          subTitle: m.externalData.general.subTitle,
          description: m.externalData.general.description,
          checkboxLabel: m.externalData.general.checkboxLabel,
          submitField: buildSubmitField({
            id: 'toDraft',
            title: coreMessages.externalDataAgreement,
            refetchApplicationAfterSubmit: true,
            placement: 'footer',
            actions: [
              {
                event: 'SUBMIT',
                name: coreMessages.externalDataAgreement,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApi,
              title: m.externalData.children.title,
              subTitle: m.externalData.children.subTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: m.externalData.applicant.title,
              subTitle: m.externalData.applicant.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: m.externalData.userProfile.title,
              subTitle: m.externalData.userProfile.subTitle,
            }),
          ],
        }),
      ],
    }),
  ],
})
