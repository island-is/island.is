import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildDescriptionField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildCustomField,
  buildMultiField,
  buildTextField,
  buildRadioField,
  buildRepeater,
} from '@island.is/application/core'
import { Prerequisites } from '../dataProviders/tempAPITypes'
import {
  PaymentPlanExternalData,
  PublicDebtPaymentPlan,
} from '../lib/dataSchema'
import { section, application, employer } from '../lib/messages'
import { externalData } from '../lib/messages/externalData'
import { info } from '../lib/messages/info'
import { paymentPlan } from '../lib/messages/paymentPlan'
import { prerequisitesFailed } from '../lib/paymentPlanUtils'
import { NO, YES } from '../shared/constants'

export const PaymentPlanForm: Form = buildForm({
  id: 'PaymentPlanForm',
  title: application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: section.externalData,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: externalData.general.pageTitle,
          description: '',
          subTitle: externalData.general.subTitle,
          checkboxLabel: externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: externalData.labels.nationalRegistryTitle,
              subTitle: externalData.labels.nationalRegistrySubTitle,
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: externalData.labels.userProfileTitle,
              subTitle: externalData.labels.userProfileSubTitle,
            }),
            // TODO: we might have to define several external data points here
            // since this data originates from more than one location
            buildDataProviderItem({
              id: 'paymentPlanPrerequisites',
              title: externalData.labels.paymentPlanTitle,
              type: 'PaymentPlanPrerequisites',
              subTitle: externalData.labels.paymentPlanSubtitle,
            }),
          ],
        }),
        buildMultiField({
          id: 'prerequisitesErrorWall',
          title: externalData.general.pageTitle,
          children: [
            buildDescriptionField({
              id: 'prerequisitesErrorDescriptionField',
              title: '',
              description: '',
            }),
            buildCustomField({
              id: 'prerequisitesErrorModal',
              component: 'PrerequisitesErrorModal',
              title: '',
            }),
          ],
          condition: (_formValue, externalData) => {
            return prerequisitesFailed(externalData)
          },
        }),
      ],
    }),
    buildSection({
      id: 'info',
      title: section.info,
      children: [
        buildMultiField({
          id: 'applicantSection',
          title: info.general.pageTitle,
          description: info.general.pageDescription,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: info.labels.name,
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: any) => {
                return (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: info.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: any) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.nationalId,
            }),
            buildTextField({
              id: 'applicant.address',
              title: info.labels.address,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: any) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.address?.streetAddress,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: info.labels.postalCode,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: any) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.address?.postalCode,
            }),
            buildTextField({
              id: 'applicant.city',
              title: info.labels.city,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: any) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.address?.city,
            }),
            buildTextField({
              id: 'applicant.email',
              title: info.labels.email,
              width: 'half',
              variant: 'email',
              backgroundColor: 'blue',
              defaultValue: (application: any) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.userProfile?.data?.email,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: info.labels.tel,
              format: '###-####',
              width: 'half',
              variant: 'tel',
              backgroundColor: 'blue',
              defaultValue: (application: any) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.userProfile?.data?.mobilePhoneNumber,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'employer',
      title: section.employer,
      condition: (_formValue, externalData) => {
        const prerequisites = externalData.paymentPlanPrerequisites?.data as
          | Prerequisites
          | undefined
        return prerequisites?.taxesOk || false
      },
      children: [
        buildMultiField({
          id: 'employerMultiField',
          title: employer.general.pageTitle,
          children: [
            buildCustomField({
              id: 'employerInfoDescription',
              title: '',
              component: 'EmployerInfoDescription',
            }),
            buildCustomField({
              id: 'employerInfo',
              title: '',
              component: 'EmployerInfo',
            }),
            buildRadioField({
              id: 'employer.isCorrectInfo',
              title: '',
              width: 'full',
              largeButtons: true,
              options: [
                { label: employer.labels.employerIsCorrect, value: YES },
                { label: employer.labels.employerIsNotCorrect, value: NO },
              ],
            }),
            buildCustomField({
              id: 'employerCustomId',
              title: '',
              component: 'EmployerIdField',
              condition: (data) =>
                (data as PublicDebtPaymentPlan).employer?.isCorrectInfo === NO,
            }),
          ],
        }),
        buildCustomField({
          id: 'disposableIncome',
          title: employer.general.disposableIncomePageTitle,
          description: employer.general.disposableIncomePageDescription,
          component: 'DisposableIncome',
        }),
      ],
    }),
    buildSection({
      id: 'paymentPlanSection',
      title: section.paymentPlan,
      children: [
        buildRepeater({
          id: 'paymentPlans',
          title: paymentPlan.general.pageTitle,
          component: 'PaymentPlanList',
          children: [
            buildCustomField({
              id: 'paymentPlan',
              title: 'Payment Plan',
              component: 'PaymentPlan',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField5',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: section.confirmation,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField6',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
  ],
})
