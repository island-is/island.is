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
import { SocialInsuranceAdministrationApplicantApi } from '../../dataProviders'

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
          // TODO: Update text!
          provider: NationalRegistryUserApi,
          title: socialInsuranceAdministrationMessage.pre.skraInformationTitle,
          subTitle: '',
        }),
        buildDataProviderItem({
          // TODO: Update text?
          provider: NationalRegistrySpouseApi,
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
        // // TODO: Put this back in when isEligible is ready
        // buildDataProviderItem({
        //   provider: SocialInsuranceAdministrationIsApplicantEligibleApi,
        //   title: '',
        // }),
      ],
    }),
    buildMultiField({
      id: 'isNotEligible',
      title: '',
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
