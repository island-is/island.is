import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { householdSupplementFormMessage } from '../lib/messages'
import {
  NationalRegistryCohabitantsApi,
  SocialInsuranceAdministrationApplicantApi,
} from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'HousholdSupplementPrerequisites',
  title: householdSupplementFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: householdSupplementFormMessage.pre.externalDataSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: householdSupplementFormMessage.pre.externalDataSection,
          subTitle: householdSupplementFormMessage.pre.externalDataDescription,
          checkboxLabel: householdSupplementFormMessage.pre.checkboxProvider,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: householdSupplementFormMessage.pre.startApplication,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: householdSupplementFormMessage.pre.startApplication,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: householdSupplementFormMessage.pre.skraInformationTitle,
              subTitle:
                householdSupplementFormMessage.pre.skraInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryCohabitantsApi,
              title: '',
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationApplicantApi,
              title:
                householdSupplementFormMessage.pre
                  .socialInsuranceAdministrationInformationTitle,
              subTitle:
                householdSupplementFormMessage.pre
                  .socialInsuranceAdministrationInformationDescription,
            }),
          ],
        }),
        // buildMultiField({
        //   id: 'isNotEligible',
        //   title: householdSupplementFormMessage.pre.isNotEligibleLabel,
        //   // condition: (_, externalData) => {
        //   //   const { isEligible } = getApplicationExternalData(externalData)
        //   //   // Show if applicant is not eligible
        //   //   return !isEligible
        //   // },
        //   children: [
        //     buildDescriptionField({
        //       id: 'isNotEligible',
        //       title: '',
        //       description:
        //         householdSupplementFormMessage.pre.isNotEligibleDescription,
        //     }),
        //     // Empty submit field to hide all buttons in the footer
        //     buildSubmitField({
        //       id: '',
        //       title: '',
        //       actions: [],
        //     }),
        //   ],
        // }),
      ],
    }),
    buildSection({
      id: 'infoSection',
      title: householdSupplementFormMessage.info.section,
      children: [],
    }),
    buildSection({
      id: 'householdSupplementSection',
      title: householdSupplementFormMessage.shared.householdSupplement,
      children: [],
    }),
    buildSection({
      id: 'periodSection',
      title: householdSupplementFormMessage.info.periodTitle,
      children: [],
    }),
    buildSection({
      id: 'fileUpload',
      title: householdSupplementFormMessage.fileUpload.title,
      children: [],
    }),
    buildSection({
      id: 'additionalInfo',
      title: householdSupplementFormMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: householdSupplementFormMessage.confirm.overviewTitle,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: householdSupplementFormMessage.confirm.section,
      children: [],
    }),
  ],
})
