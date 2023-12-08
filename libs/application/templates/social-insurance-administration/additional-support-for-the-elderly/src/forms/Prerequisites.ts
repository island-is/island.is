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
  DefaultEvents,
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
  renderLastScreenButton: true,
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
      ],
    }),
    buildSection({
      id: 'infoSection',
      title: additionalSupportForTheElderyFormMessage.info.section,
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
  ],
})
