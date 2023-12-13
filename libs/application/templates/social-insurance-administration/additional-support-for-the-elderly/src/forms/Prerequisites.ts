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
  DefaultEvents,
} from '@island.is/application/types'
import { additionalSupportForTheElderyFormMessage } from '../lib/messages'
import Logo from '@island.is/application/templates/social-insurance-administration-core/assets/Logo'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
} from '../dataProviders'
import { getApplicationExternalData } from '../lib/additionalSupportForTheElderlyUtils'

export const PrerequisitesForm: Form = buildForm({
  id: 'AdditionalSupportForTheElderlyPrerequisites',
  title: additionalSupportForTheElderyFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'prerequisites',
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
          submitField: buildSubmitField({
            id: 'submit',
            placement: 'footer',
            title:
              additionalSupportForTheElderyFormMessage.pre.startApplication,
            refetchApplicationAfterSubmit: true,
            actions: [
              {
                event: DefaultEvents.SUBMIT,
                name: additionalSupportForTheElderyFormMessage.pre
                  .startApplication,
                type: 'primary',
              },
            ],
          }),
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
        buildMultiField({
          id: 'isNotEligible',
          title:
            additionalSupportForTheElderyFormMessage.pre.isNotEligibleLabel,
          condition: (FormValue, externalData) => {
            const { isEligible } = getApplicationExternalData(externalData)
            // Show if applicant is not eligible
            return !isEligible
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              title: '',
              description:
                additionalSupportForTheElderyFormMessage.pre
                  .isNotEligibleDescription,
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
      id: 'infoSection',
      title: additionalSupportForTheElderyFormMessage.info.section,
      children: [],
    }),
    buildSection({
      id: 'periodSection',
      title: additionalSupportForTheElderyFormMessage.info.periodTitle,
      children: [],
    }),
    buildSection({
      id: 'additionalInformation',
      title:
        additionalSupportForTheElderyFormMessage.comment.additionalInfoTitle,
      children: [],
    }),
    buildSection({
      id: 'confirm',
      title: additionalSupportForTheElderyFormMessage.confirm.overviewTitle,
      children: [],
    }),
    buildSection({
      id: 'conclusion',
      title: additionalSupportForTheElderyFormMessage.confirm.section,
      children: [],
    }),
  ],
})
