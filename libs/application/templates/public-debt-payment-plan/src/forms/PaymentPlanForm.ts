import { PaymentScheduleDebts } from '@island.is/api/schema'
import {
  buildCompanySearchField,
  buildCustomField,
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  CustomField,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import {
  applicantInformationMultiField,
  buildFormConclusionSection,
} from '@island.is/application/ui-forms'
import { Logo } from '../assets'
import {
  application,
  conclusion,
  employer,
  overview,
  section,
  paymentPlan,
} from '../lib/messages'
import { isApplicantPerson } from '../lib/paymentPlanUtils'
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
        ((
          (externalData as PaymentPlanExternalData).paymentPlanPrerequisites
            ?.data?.debts as PaymentScheduleDebts[]
        )?.length || 0)
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
  mode: FormModes.DRAFT,
  logo: Logo,
  children: [
    buildSection({
      id: 'externalData',
      title: section.externalData,
      children: [],
    }),
    // The info section is repeated in order to let the user change his info in the later state
    // Its basically a hack to make the flow seem more seamless from the dataprovider.
    buildSection({
      id: 'info',
      title: section.info,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'employer',
      title: section.employer,
      children: [
        buildMultiField({
          id: 'employerMultiField',
          title: employer.general.pageTitle,
          condition: (_formValue, externalData) => {
            const debts = (externalData as PaymentPlanExternalData)
              ?.paymentPlanPrerequisites?.data?.debts

            return debts?.find((x) => x.type === 'Wagedection') !== undefined
          },
          children: [
            buildCustomField({
              id: 'employerInfoDescription',
              title: '',
              doesNotRequireAnswer: true,
              component: 'EmployerInfoDescription',
            }),
            buildCustomField({
              id: 'employerInfo',
              title: '',
              doesNotRequireAnswer: true,
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
          ],
        }),
        buildMultiField({
          id: 'newEmployerMultiField',
          title: employer.general.pageTitle,
          condition: (_formValue, externalData) => {
            const debts = (externalData as PaymentPlanExternalData)
              ?.paymentPlanPrerequisites?.data?.debts

            return (
              debts?.find((x) => x.type === 'Wagedection') !== undefined &&
              (_formValue as PublicDebtPaymentPlan).employer?.isCorrectInfo ===
                NO
            )
          },
          children: [
            buildCustomField({
              id: 'employerInfoDescription',
              title: '',
              doesNotRequireAnswer: true,
              component: 'EmployerInfoDescription',
            }),
            buildCompanySearchField({
              id: 'correctedEmployer',
              title: employer.labels.searchCompany,
              placeholder: employer.labels.searchCompanyPlaceholer,
              checkIfEmployerIsOnForbiddenList: true,
            }),
          ],
        }),
      ],
      condition: (formValue, externalData) => {
        const debts = (externalData as PaymentPlanExternalData)
          ?.paymentPlanPrerequisites?.data?.debts

        return (
          isApplicantPerson(formValue) &&
          debts?.find((x) => x.type === 'Wagedection') !== undefined
        )
      },
    }),
    buildSection({
      id: 'disposableIncomeSection',
      title: section.disposableIncome,
      condition: isApplicantPerson,
      children: [
        buildCustomField({
          id: 'disposableIncome',
          title: employer.general.disposableIncomePageTitle,
          description: employer.general.disposableIncomePageDescription,
          doesNotRequireAnswer: true,
          component: 'DisposableIncome',
        }),
      ],
    }),
    buildSection({
      id: 'deptOverview',
      title: section.deptOverview,
      children: [
        buildCustomField({
          id: `payment-plan-list`,
          title: paymentPlan.general.pageTitle,
          doesNotRequireAnswer: true,
          component: 'PaymentPlanList',
        }),
      ],
    }),
    buildSection({
      id: 'paymentPlanSection',
      title: section.paymentPlan,
      children: [...buildPaymentPlanSteps()],
    }),
    buildSection({
      id: 'overview',
      title: section.overview,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: overview.title,
          description: overview.description,
          children: [
            buildCustomField({
              id: 'overviewScreen',
              title: '',
              doesNotRequireAnswer: true,
              component: 'Overview',
            }),
            buildSubmitField({
              id: 'overview.submit',
              title: '',
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.submitButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildFormConclusionSection({
      alertMessage: conclusion.general.alertMessage,
      alertTitle: conclusion.general.alertTitle,
      expandableHeader: conclusion.information.title,
      expandableIntro: conclusion.information.intro,
      expandableDescription: conclusion.information.bulletList,
    }),
  ],
})
