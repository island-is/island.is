import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { householdSupplementFormMessage } from '../lib/messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  NationalRegistryCohabitantsApi,
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../dataProviders'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { isEligible } from '../lib/householdSupplementUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'HousholdSupplementPrerequisites',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'externalData',
      title: socialInsuranceAdministrationMessage.pre.externalDataSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: socialInsuranceAdministrationMessage.pre.externalDataSection,
          subTitle:
            socialInsuranceAdministrationMessage.pre.externalDataDescription,
          checkboxLabel:
            socialInsuranceAdministrationMessage.pre.checkboxProvider,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: socialInsuranceAdministrationMessage.pre.startApplication,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: socialInsuranceAdministrationMessage.pre.startApplication,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title:
                socialInsuranceAdministrationMessage.pre.skraInformationTitle,
              subTitle:
                householdSupplementFormMessage.pre.skraInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: NationalRegistryCohabitantsApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: socialInsuranceAdministrationMessage.pre.contactInfoTitle,
              subTitle:
                socialInsuranceAdministrationMessage.pre.contactInfoDescription,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationApplicantApi,
              title:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationTitle,
              subTitle:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationDescription,
            }),
            buildDataProviderItem({
              id: 'sia.data',
              title:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationInformationTitle,
              subTitle:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationDataDescription,
            }),
            buildDataProviderItem({
              id: 'sia.privacy',
              title:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationPrivacyTitle,
              subTitle:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationPrivacyDescription,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationCurrenciesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
              title: '',
            }),
          ],
        }),
        buildMultiField({
          id: 'isNotEligible',
          title: householdSupplementFormMessage.pre.isNotEligibleLabel,
          condition: (_, externalData) => {
            // Show if applicant is not eligible
            return !isEligible(externalData)
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              description:
                householdSupplementFormMessage.pre.isNotEligibleDescription,
            }),
            // Empty submit field to hide all buttons in the footer
            buildSubmitField({
              id: '',
              actions: [],
            }),
          ],
        }),
      ],
    }),
  ],
})
