import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, IdentityApi } from '@island.is/application/types'
import { FormModes } from '@island.is/application/types'
import { Logo } from '../../assets/Logo'
import { externalData } from '../../lib/messages'
import {
  ActivationAllowanceApi,
  DrivingLicenseApi,
  LocaleApi,
  UserProfileApiWithValidation,
  WorkMachineLicensesApi,
} from '../../dataProviders'

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.dataProvider.pageTitle,
          subTitle: externalData.dataProvider.subTitle,
          checkboxLabel: externalData.dataProvider.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title: externalData.nationalRegistry.title,
              subTitle: externalData.nationalRegistry.subTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApiWithValidation,
              title: externalData.userProfile.title,
              subTitle: externalData.userProfile.subTitle,
            }),
            buildDataProviderItem({
              // provider: '', // TODO: add tax data provider
              title: externalData.tax.title,
              subTitle: externalData.tax.subTitle,
            }),
            buildDataProviderItem({
              // provider: '', // TODO: add national insurance data provider
              title: externalData.nationalInsuranceInstitute.title,
              subTitle: externalData.nationalInsuranceInstitute.subTitle,
            }),
            buildDataProviderItem({
              provider: ActivationAllowanceApi,
              // TODO(Balli): Add title and subtitle
            }),
            buildDataProviderItem({
              provider: LocaleApi,
            }),
          ],
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: externalData.dataProvider.buttonApprove,
                type: 'primary',
              },
            ],
          }),
        }),
      ],
    }),
  ],
})
