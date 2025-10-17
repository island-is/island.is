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
  buildPhoneField,
  YES,
  NO,
} from '@island.is/application/core'
import {
  Form,
  FormModes,
  IdentityApi,
  UserProfileApi,
} from '@island.is/application/types'
import { DebtCollectorLogo } from '@island.is/application/assets/institution-logos'
import { application, info, section, externalData } from '../lib/messages'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { PaymentPlanExternalData } from '../types'
import { Application } from '@island.is/api/schema'
import { isApplicantCompany, isApplicantPerson } from '../lib/paymentPlanUtils'
import { PaymentPlanPrerequisitesApi } from '../dataProviders'

const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: application.name,
  logo: DebtCollectorLogo,
  mode: FormModes.NOT_STARTED,
  children: [
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
                isApplicantPerson(formValue)
                  ? externalData.labels.paymentPlanTitle
                  : '',

              subTitle: (formValue) =>
                isApplicantPerson(formValue)
                  ? externalData.labels.paymentPlanSubtitle
                  : '',
            }),
            buildDataProviderItem({
              provider: PaymentPlanPrerequisitesApi,
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
        buildMultiField({
          id: 'applicantSection',
          title: (formValue) =>
            isApplicantCompany(formValue)
              ? info.general.companyPageTitle
              : info.general.pageTitle,
          description: (formValue) =>
            isApplicantCompany(formValue)
              ? info.general.companyPageDescription
              : info.general.pageDescription,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: (formValue) =>
                isApplicantCompany(formValue)
                  ? info.labels.companyName
                  : info.labels.name,
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (application: Application) => {
                return (
                  (application.externalData as PaymentPlanExternalData)
                    ?.identity?.data?.name ?? ''
                )
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: info.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)?.identity
                  ?.data?.nationalId ?? '',
            }),
            buildTextField({
              id: 'applicant.address',
              title: info.labels.address,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)?.identity
                  ?.data?.address?.streetAddress ?? '',
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: info.labels.postalCode,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)?.identity
                  ?.data?.address?.postalCode ?? '',
            }),
            buildTextField({
              id: 'applicant.city',
              title: info.labels.city,
              width: 'half',
              backgroundColor: 'white',
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)?.identity
                  ?.data?.address?.city ?? '',
            }),
            buildTextField({
              id: 'applicant.email',
              title: info.labels.email,
              width: 'half',
              variant: 'email',
              backgroundColor: 'blue',
              required: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.userProfile?.data?.email,
            }),
            buildPhoneField({
              id: 'applicant.phoneNumber',
              title: info.labels.tel,
              width: 'half',
              backgroundColor: 'blue',
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.userProfile?.data?.mobilePhoneNumber ?? '',
            }),
            buildSubmitField({
              id: 'toDraft',
              title: externalData.labels.externalDataSuccessSubmitFieldTitle,
              refetchApplicationAfterSubmit: true,
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: externalData.labels.externalDataSuccessSubmitFieldTitle,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'unused',
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
