import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
  buildDescriptionField,
  buildSubSection,
  buildRadioField,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  IdentityApi,
  UserProfileApi,
} from '@island.is/application/types'
import { betaTestSection } from './BetaTestSection'
import { Logo } from '../assets'

import { application, info, section, externalData } from '../lib/messages'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { NO, YES } from '../shared/constants'
import { isApplicantCompany, isApplicantPerson } from '../lib/paymentPlanUtils'
import { PaymentPlanPrerequisitesApi } from '../dataProviders'
import { applicantInformationMultiField } from '@island.is/application/ui-forms'

const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.DRAFT,
  children: [
    betaTestSection,
    buildSection({
      id: 'externalData',
      title: section.externalData,
      children: [
        ...(shouldRenderMockDataSubSection
          ? [
              buildSubSection({
                id: 'mockData',
                title: 'Gervigögn',
                children: [
                  buildRadioField({
                    id: 'mock.useMockData',
                    title: 'Viltu nota gervigögn?',
                    width: 'half',
                    options: [
                      {
                        value: YES,
                        label: 'Já',
                      },
                      {
                        value: NO,
                        label: 'Nei',
                      },
                    ],
                  }),
                ],
              }),
            ]
          : []),
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.general.pageTitle,
          description: externalData.general.description,
          subTitle: externalData.general.subTitle,
          checkboxLabel: externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              provider: IdentityApi,
              title: (formValue) =>
                isApplicantCompany(formValue)
                  ? externalData.companyLabels.companyRegistryTitle
                  : externalData.labels.nationalRegistryTitle,
              subTitle: (formValue) =>
                isApplicantCompany(formValue)
                  ? externalData.companyLabels.companyRegistrySubTitle
                  : externalData.labels.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              provider: UserProfileApi,
              title: (formValue) =>
                isApplicantCompany(formValue)
                  ? externalData.companyLabels.companyTaxTitle
                  : externalData.labels.userProfileTitle,
              subTitle: (formValue) =>
                isApplicantCompany(formValue)
                  ? externalData.companyLabels.companyTaxSubTitle
                  : externalData.labels.userProfileSubTitle,
            }),
            buildDataProviderItem({
              provider: PaymentPlanPrerequisitesApi,
              title: (formValue) =>
                isApplicantPerson(formValue)
                  ? externalData.labels.paymentPlanTitle
                  : '',

              subTitle: (formValue) =>
                isApplicantPerson(formValue)
                  ? externalData.labels.paymentPlanSubtitle
                  : '',
            }),
            buildDataProviderItem({
              title: externalData.labels.paymentEmployerTitle,
              subTitle: externalData.labels.paymentEmployerSubtitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: section.info,
      children: [
        applicantInformationMultiField({
          title: (formValue) =>
            isApplicantCompany(formValue)
              ? info.general.companyPageTitle
              : info.general.pageTitle,
          description: (formValue) =>
            isApplicantCompany(formValue)
              ? info.general.companyPageDescription
              : info.general.pageDescription,
        }),
        buildDescriptionField({
          id: 'unused',
          title: '',
          description: '',
        }),
      ],
    }),
    buildSection({
      id: 'employer',
      title: section.employer,
      condition: isApplicantPerson,
      children: [],
    }),
    buildSection({
      id: 'disposableIncome',
      title: section.disposableIncome,
      condition: isApplicantPerson,
      children: [],
    }),
    buildSection({
      id: 'deptOverview',
      title: section.deptOverview,
      children: [],
    }),
    buildSection({
      id: 'paymentPlan',
      title: section.paymentPlan,
      children: [],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: section.confirmation,
      children: [],
    }),
  ],
})
