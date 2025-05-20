import {
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildMultiField,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  DefaultEvents,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationQuestionnairesApi,
} from '../../dataProviders'
import { medicalAndRehabilitationPaymentsFormMessage } from '../../lib/messages'

export const externalDataSubSection = buildSubSection({
  id: 'externalDataSubSection',
  title: socialInsuranceAdministrationMessage.pre.externalDataSection,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: socialInsuranceAdministrationMessage.pre.externalDataSection,
      subTitle:
        socialInsuranceAdministrationMessage.pre.externalDataDescription,
      checkboxLabel: socialInsuranceAdministrationMessage.pre.checkboxProvider,
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
            medicalAndRehabilitationPaymentsFormMessage.pre
              .skraInformationTitle,
          subTitle:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .skraInformationDescription,
        }),
        buildDataProviderItem({
          provider: NationalRegistrySpouseApi,
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
          title:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .healthInstitutionTitle,
          subTitle:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .healthInstitutionDescription,
        }),
        buildDataProviderItem({
          title:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .unionHealthFundTitle,
          subTitle:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .unionHealthFundDescription,
        }),
        buildDataProviderItem({
          title:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .serviceRehabilitationTreatmentProviderTitle,
          subTitle:
            medicalAndRehabilitationPaymentsFormMessage.pre
              .serviceRehabilitationTreatmentProviderDescription,
        }),
        buildDataProviderItem({
          title:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationInformationTitle,
          subTitle:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationDataDescription,
        }),
        buildDataProviderItem({
          title:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationPrivacyTitle,
          subTitle:
            socialInsuranceAdministrationMessage.pre
              .socialInsuranceAdministrationPrivacyDescription,
        }),
        buildDataProviderItem({
          provider: SocialInsuranceAdministrationQuestionnairesApi,
        }),
        // // TODO: Put this back in when isEligible is ready
        // buildDataProviderItem({
        //   provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
        //   title: '',
        // }),
      ],
    }),
    buildMultiField({
      id: 'isNotEligible',
      // condition: (_, externalData) => {
      //   // Show if applicant is not eligible
      //   return !isEligible(externalData)
      // },
      children: [
        buildDescriptionField({
          id: 'isNotEligible',
          description: '',
        }),
        // Empty submit field to hide all buttons in the footer
        buildSubmitField({
          id: '',
          actions: [],
        }),
      ],
    }),
  ],
})
