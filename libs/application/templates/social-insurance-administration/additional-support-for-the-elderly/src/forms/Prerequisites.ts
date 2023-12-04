import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
} from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'AdditionalSupportForTheElderlyPrerequisites',
  title: additionalSupportForTheElderyFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: additionalSupportForTheElderyFormMessage.pre.externalDataSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title:
            additionalSupportForTheElderyFormMessage.pre.externalDataSection,
          subTitle:
            additionalSupportForTheElderyFormMessage.pre
              .externalDataDescription,
          checkboxLabel:
            additionalSupportForTheElderyFormMessage.pre.checkboxProvider,
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title:
                additionalSupportForTheElderyFormMessage.pre
                  .skraInformationTitle,
              subTitle:
                additionalSupportForTheElderyFormMessage.pre
                  .skraInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationApplicantApi,
              title:
                additionalSupportForTheElderyFormMessage.pre
                  .socialInsuranceAdministrationInformationTitle,
              subTitle:
                additionalSupportForTheElderyFormMessage.pre
                  .socialInsuranceAdministrationInformationDescription,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationCurrenciesApi,
              title: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
