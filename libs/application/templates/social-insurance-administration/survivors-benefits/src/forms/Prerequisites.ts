import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
  buildSubSection,
} from '@island.is/application/core'
import {
  DefaultEvents,
  Form,
  FormModes,
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import { survivorsBenefitsFormMessage } from '../lib/messages'
import { SocialInsuranceAdministrationApplicantApi } from '../dataProviders'

export const PrerequisitesForm: Form = buildForm({
  id: 'SurvivorsBenefitsPrerequisites',
  title: survivorsBenefitsFormMessage.shared.formTitle,
  logo: Logo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'prerequisites',
      title: survivorsBenefitsFormMessage.pre.prerequisitesSection,
      children: [
        buildSubSection({
          id: 'externalData',
          title: survivorsBenefitsFormMessage.pre.externalDataSection,
          children: [
            buildExternalDataProvider({
              id: 'approveExternalData',
              title: survivorsBenefitsFormMessage.pre.externalDataSection,
              subTitle: survivorsBenefitsFormMessage.pre.externalDataSubTitle,
              checkboxLabel: survivorsBenefitsFormMessage.pre.checkboxProvider,
              submitField: buildSubmitField({
                id: 'submit',
                placement: 'footer',
                title: survivorsBenefitsFormMessage.pre.startApplication,
                refetchApplicationAfterSubmit: true,
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: survivorsBenefitsFormMessage.pre.startApplication,
                    type: 'primary',
                  },
                ],
              }),
              dataProviders: [
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title: survivorsBenefitsFormMessage.pre.registryIcelandTitle,
                  subTitle:
                    survivorsBenefitsFormMessage.pre.registryIcelandDescription,
                }),
                buildDataProviderItem({
                  provider: NationalRegistrySpouseApi,
                  title: '',
                }),
                buildDataProviderItem({
                  provider: SocialInsuranceAdministrationApplicantApi,
                  title:
                    survivorsBenefitsFormMessage.pre
                      .socialInsuranceAdministrationInformationTitle,
                  subTitle:
                    survivorsBenefitsFormMessage.pre
                      .socialInsuranceAdministrationInformationDescription,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: survivorsBenefitsFormMessage.info.section,
      children: [],
    }),
    buildSection({
      id: 'comment',
      title: survivorsBenefitsFormMessage.additionalInfo.section,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: survivorsBenefitsFormMessage.confirm.section,
      children: [],
    }),
  ],
})
