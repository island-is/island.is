import {
  PaymentScheduleConditions,
  PaymentScheduleDebts,
} from '@island.is/api/schema'
import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildTextField,
  CustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import {
  application,
  conclusion,
  employer,
  info,
  section,
} from '../lib/messages'
import { externalData } from '../lib/messages/externalData'
import { paymentPlan } from '../lib/messages/paymentPlan'
import { prerequisitesFailed } from '../lib/paymentPlanUtils'
import { NO, YES } from '../shared/constants'
import {
  PaymentPlanBuildIndex,
  PaymentPlanExternalData,
  paymentPlanIndexKeyMapper,
  PublicDebtPaymentPlan,
} from '../types'

// Builds a payment plan step that exists of two custom fields:
// The overview step detailing a list of all payment plans and their status
// The payment plan step where the user sets up this individual payment plan
const buildPaymentPlanStep = (index: PaymentPlanBuildIndex): CustomField =>
  buildCustomField({
    id: `paymentPlans.${paymentPlanIndexKeyMapper[index]}`,
    title: section.paymentPlan,
    component: 'PaymentPlan',
    defaultValue: index,
    condition: (_formValue, externalData) => {
      return (
        index <
        (((externalData as PaymentPlanExternalData).paymentPlanPrerequisites
          ?.data?.debts as PaymentScheduleDebts[])?.length || 0)
      )
    },
  })

// Compose an array 10 predefined payment plan steps
// Each step will only be rendered in if it's index corresponds to
// an entry in the payment plan list received by the API
const buildPaymentPlanSteps = (): CustomField[] =>
  [...Array(10)].map((_key, index) =>
    buildPaymentPlanStep(index as PaymentPlanBuildIndex),
  )

// TODO: Data providers are not called by default on every session start
// We need to add custom validators to ensure that the application does not
// become stale
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
            buildDataProviderItem({
              id: 'paymentPlanPrerequisites',
              title: externalData.labels.paymentPlanTitle,
              type: 'PaymentPlanPrerequisitesProvider',
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
              backgroundColor: 'white',
              required: true,
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
              backgroundColor: 'white',
              required: true,
              disabled: true,
              defaultValue: (application: any) =>
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
              defaultValue: (application: any) =>
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
              defaultValue: (application: any) =>
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
              required: true,
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
              required: true,
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
        const prerequisites = (externalData as PaymentPlanExternalData)
          .paymentPlanPrerequisites?.data?.conditions as
          | PaymentScheduleConditions
          | undefined
        return prerequisites?.taxReturns || false
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
          condition: (_formValue, externalData) => {
            const debts = (externalData as PaymentPlanExternalData)
              ?.paymentPlanPrerequisites?.data?.debts
            return (
              debts?.find((x) => x.type === 'OverpaidBenefits') !== undefined
            )
          },
        }),
      ],
    }),
    buildSection({
      id: 'paymentPlanSection',
      title: section.paymentPlan,
      children: [
        buildCustomField({
          id: `payment-plan-list`,
          title: paymentPlan.general.pageTitle,
          component: 'PaymentPlanList',
        }),
        ...buildPaymentPlanSteps(),
      ],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: 'Yfirlit og undirritun',
          description:
            'Á þessari síðu má sjá heildaryfirlit yfir umsókn vegna greiðsludreifingar skulda, gott að er að skoða þetta vel áður en farið er í rafræna undirritun. ',
          children: [
            buildCustomField({
              id: 'overviewScreen',
              title: '',
              component: 'Overview',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: section.confirmation,
      children: [
        buildCustomField({
          id: 'conclusion',
          title: conclusion.general.title,
          component: 'FormConclusion',
        }),
      ],
    }),
  ],
})
