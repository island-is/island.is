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
  ExternalData,
  buildTextField,
} from '@island.is/application/core'
import { PublicDebtPaymentPlan } from '../lib/dataSchema'
import { section, application } from '../lib/messages'
import { externalData } from '../lib/messages/externalData'
import { info } from '../lib/messages/info'
import { prerequisitesFailed } from '../lib/paymentPlanUtils'

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
              defaultValue: (application: PublicDebtPaymentPlan) => {
                console.log(application.externalData)
                return application.externalData?.nationalRegistry?.data
                  ?.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: info.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: PublicDebtPaymentPlan) =>
                application.externalData?.nationalRegistry?.data?.nationalId,
            }),
            buildTextField({
              id: 'applicant.address',
              title: info.labels.address,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: PublicDebtPaymentPlan) =>
                application.externalData?.nationalRegistry?.data?.address
                  ?.streetAddress,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: info.labels.postalCode,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: PublicDebtPaymentPlan) =>
                application.externalData?.nationalRegistry?.data?.address
                  ?.postalCode,
            }),
            buildTextField({
              id: 'applicant.city',
              title: info.labels.city,
              width: 'half',
              backgroundColor: 'blue',
              disabled: true,
              defaultValue: (application: PublicDebtPaymentPlan) =>
                application.externalData?.nationalRegistry?.data?.address?.city,
            }),
            buildTextField({
              id: 'applicant.email',
              title: info.labels.email,
              width: 'half',
              variant: 'email',
              backgroundColor: 'blue',
              defaultValue: (application: PublicDebtPaymentPlan) =>
                application.externalData?.userProfile?.data?.email,
            }),
            buildTextField({
              id: 'applicant.phoneNumber',
              title: info.labels.tel,
              format: '###-####',
              width: 'half',
              variant: 'tel',
              backgroundColor: 'blue',
              defaultValue: (application: PublicDebtPaymentPlan) =>
                application.externalData?.userProfile?.data?.mobilePhoneNumber,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'employer',
      title: section.employer,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField3',
          title: application.name,
          description: 'Umsókn',
        }),
      ],
    }),
    buildSection({
      id: 'paymentPlan',
      title: section.paymentPlan,
      children: [
        buildDescriptionField({
          id: 'mockDescriptionField4',
          title: application.name,
          description: 'Umsókn',
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
