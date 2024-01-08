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
  NationalRegistryUserApi,
} from '@island.is/application/types'
import { pensionSupplementFormMessage } from '../lib/messages'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../dataProviders'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import { getApplicationExternalData } from '../lib/pensionSupplementUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'HousholdSupplementPrerequisites',
  title: pensionSupplementFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: pensionSupplementFormMessage.pre.externalDataSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: pensionSupplementFormMessage.pre.externalDataSection,
          subTitle: pensionSupplementFormMessage.pre.externalDataDescription,
          checkboxLabel: pensionSupplementFormMessage.pre.checkboxProvider,
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title: pensionSupplementFormMessage.pre.startApplication,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: 'SUBMIT',
                name: pensionSupplementFormMessage.pre.startApplication,
                type: 'primary',
              },
            ],
          }),
          dataProviders: [
            buildDataProviderItem({
              provider: NationalRegistryUserApi,
              title: pensionSupplementFormMessage.pre.skraInformationTitle,
              subTitle:
                pensionSupplementFormMessage.pre.skraInformationSubTitle,
            }),
            buildDataProviderItem({
              provider: SocialInsuranceAdministrationApplicantApi,
              title:
                pensionSupplementFormMessage.pre
                  .socialInsuranceAdministrationInformationTitle,
              subTitle:
                pensionSupplementFormMessage.pre
                  .socialInsuranceAdministrationInformationDescription,
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
            const { isEligible } = getApplicationExternalData(externalData)
            // Show if applicant is not eligible
            return !isEligible
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              title: '',
              description:
                pensionSupplementFormMessage.pre.isNotEligibleDescription,
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
    buildSection({
      id: 'info',
      title: pensionSupplementFormMessage.info.section,
      children: [],
    }),
    buildSection({
      id: 'additionalInfo',
      title: pensionSupplementFormMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: pensionSupplementFormMessage.confirm.overviewTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: pensionSupplementFormMessage.conclusionScreen.section,
      children: [],
    }),
  ],
})
