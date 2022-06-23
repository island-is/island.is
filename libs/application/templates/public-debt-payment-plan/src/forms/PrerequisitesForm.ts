import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  Form,
  FormModes,
  buildSubmitField,
  buildTextField,
  buildDescriptionField,
  buildSubSection,
  buildRadioField,
} from '@island.is/application/core'
import { betaTestSection } from './BetaTestSection'
import { Logo } from '../assets'

import { application, info, section, externalData } from '../lib/messages'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { NO, YES } from '../shared/constants'
import { PaymentPlanExternalData } from '../types'
import { Application } from '@island.is/api/schema'

const shouldRenderMockDataSubSection = !isRunningOnEnvironment('production')

export const PrerequisitesForm: Form = buildForm({
  id: 'PrerequisitesForm',
  title: application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
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
            buildDataProviderItem({
              id: 'paymentPlanPrerequisites',
              title: externalData.labels.paymentPlanTitle,
              type: 'PaymentPlanPrerequisitesProvider',
              subTitle: externalData.labels.paymentPlanSubtitle,
            }),
            buildDataProviderItem({
              id: 'additionalDataProviderMessage',
              type: '',
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
          title: info.general.pageTitle,
          description: info.general.pageDescription,
          children: [
            buildTextField({
              id: 'applicant.name',
              title: info.labels.name,
              backgroundColor: 'white',
              required: true,
              disabled: true,
              defaultValue: (application: Application) => {
                return (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.fullName
              },
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: info.labels.nationalId,
              format: '######-####',
              width: 'half',
              backgroundColor: 'white',
              required: true,
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.nationalId,
            }),
            buildTextField({
              id: 'applicant.address',
              title: info.labels.address,
              width: 'half',
              backgroundColor: 'white',
              required: true,
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.address?.streetAddress,
            }),
            buildTextField({
              id: 'applicant.postalCode',
              title: info.labels.postalCode,
              width: 'half',
              backgroundColor: 'white',
              required: true,
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.address?.postalCode,
            }),
            buildTextField({
              id: 'applicant.city',
              title: info.labels.city,
              width: 'half',
              backgroundColor: 'white',
              required: true,
              disabled: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.nationalRegistry?.data?.address?.city,
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
            buildTextField({
              id: 'applicant.phoneNumber',
              title: info.labels.tel,
              format: '###-####',
              width: 'half',
              variant: 'tel',
              backgroundColor: 'blue',
              required: true,
              defaultValue: (application: Application) =>
                (application.externalData as PaymentPlanExternalData)
                  ?.userProfile?.data?.mobilePhoneNumber,
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
          title: '',
          description: '',
        }),
      ],
    }),
    buildSection({
      id: 'employer',
      title: section.employer,
      children: [],
    }),
    buildSection({
      id: 'disposableIncome',
      title: section.disposableIncome,
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
