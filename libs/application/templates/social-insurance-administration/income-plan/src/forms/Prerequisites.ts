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
  UserProfileApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { incomePlanFormMessage } from '../lib/messages'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import {
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
  SocialInsuranceAdministrationLatestIncomePlan,
  SocialInsuranceAdministrationWithholdingTaxApi,
} from '../dataProviders'
import { isEligible } from '../lib/incomePlanUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'IncomePlanPrerequisites',
  title: incomePlanFormMessage.pre.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
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
              subTitle: incomePlanFormMessage.pre.registryIcelandDescription,
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
                  .socialInsuranceAdministrationInformationTitle,
              subTitle:
                socialInsuranceAdministrationMessage.pre
                  .socialInsuranceAdministrationDataDescription,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationCategorizedIncomeTypesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationCurrenciesApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationWithholdingTaxApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationLatestIncomePlan,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
              title: '',
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
          ],
        }),
        buildMultiField({
          id: 'isNotEligible',
          title: incomePlanFormMessage.pre.isNotEligibleTitle,
          condition: (_, externalData) => {
            // Show if applicant is not eligible
            return !isEligible(externalData)
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible10Days',
              title: '',
              description: incomePlanFormMessage.pre.isNotEligibleDescription,
            }),
            // Empty submit field to hide all buttons in the footer
            buildSubmitField({
              id: '',
              title: '',
              actions: [],
            }),
          ],
        }),
      ],
    }),
  ],
})
