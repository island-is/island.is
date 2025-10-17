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
import { deathBenefitsFormMessage } from '../lib/messages'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationChildrenApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationSpousalInfo,
} from '../dataProviders'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import { isEligible } from '../lib/deathBenefitsUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'DeathBenefitsPrerequisites',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
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
              subTitle: deathBenefitsFormMessage.pre.registryIcelandDescription,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: socialInsuranceAdministrationMessage.pre.contactInfoTitle,
              subTitle:
                socialInsuranceAdministrationMessage.pre.contactInfoDescription,
            }),
            buildDataProviderItem({
              id: 'sia.data',
              title:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationTitle,
              subTitle:
                deathBenefitsFormMessage.pre
                  .socialInsuranceAdministrationDescription,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationApplicantApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationChildrenApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationCurrenciesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationSpousalInfo,
              title: '',
            }),
          ],
        }),
        buildMultiField({
          id: 'isNotEligible',
          title: deathBenefitsFormMessage.pre.isNotEligibleTitle,
          condition: (_, externalData) => {
            // Show if applicant is not eligible
            return !isEligible(externalData)
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              description:
                deathBenefitsFormMessage.pre.isNotEligibleDescription,
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
