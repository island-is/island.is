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
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { pensionSupplementFormMessage } from '../lib/messages'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../dataProviders'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { isEligible } from '../lib/pensionSupplementUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'PensionSupplementPrerequisites',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
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
                event: DefaultEvents.SUBMIT,
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
                pensionSupplementFormMessage.pre.skraInformationSubTitle,
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
              id: 'sia.privacy',
              title:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationPrivacyTitle,
              subTitle:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationPrivacyWithoutIncomeDescription,
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
          title: pensionSupplementFormMessage.pre.isNotEligibleLabel,
          condition: (_, externalData) => {
            // Show if applicant is not eligible
            return !isEligible(externalData)
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              description:
                pensionSupplementFormMessage.pre.isNotEligibleDescription,
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
