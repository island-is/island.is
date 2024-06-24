import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

import {
  EphemeralStateLifeCycle,
  DefaultStateLifeCycle,
} from '@island.is/application/core'
import { Events, Roles, States } from './constants'
import { dataSchema } from './dataSchema'
import { incomePlanFormMessage } from './messages'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import {
  SocialInsuranceAdministrationCategorizedIncomeTypesApi,
  SocialInsuranceAdministrationCurrenciesApi,
  SocialInsuranceAdministrationLatestIncomePlan,
  SocialInsuranceAdministrationWithholdingTaxApi,
} from '../dataProviders'
import { assign } from 'xstate'
import { getApplicationExternalData } from './incomePlanUtils'
import { set } from 'lodash'

const IncomePlanTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.INCOME_PLAN,
  name: incomePlanFormMessage.shared.applicationTitle,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces: [ApplicationConfigurations.IncomePlan.translation],
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUESITES,
    states: {
      [States.PREREQUESITES]: {
        exit: ['setWithholdingTaxInTable'],
        meta: {
          name: States.PREREQUESITES,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                UserProfileApi.configure({
                  params: {
                    validateEmail: true,
                  },
                }),
                SocialInsuranceAdministrationCategorizedIncomeTypesApi,
                SocialInsuranceAdministrationCurrenciesApi,
                SocialInsuranceAdministrationWithholdingTaxApi,
                //SocialInsuranceAdministrationLatestIncomePlan,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/IncomePlanForm').then((val) =>
                  Promise.resolve(val.IncomePlanForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        // on: {
        //   SUBMIT: [],
        // },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      setWithholdingTaxInTable: assign((context) => {
        const { application } = context
        const { answers } = application
        const { withholdingTax } = getApplicationExternalData(
          application.externalData,
        )

        withholdingTax &&
          withholdingTax.incomeTypes?.map((income, i) => {
            set(answers, `incomePlanTable[${i}].incomeTypes`, income.incomeType)
            set(
              answers,
              `incomePlanTable[${i}].incomePerYear`,
              String(income.total),
            )
            set(answers, `incomePlanTable[${i}].currency`, 'IKR')
            set(answers, `incomePlanTable[${i}].income`, 'yearly')
            set(
              answers,
              `incomePlanTable[${i}].incomeCategories`,
              'Atvinnutekjur',
            )

            set(answers, `incomePlanTable[${i}].january`, income.january)
            set(answers, `incomePlanTable[${i}].february`, income.february)
            set(answers, `incomePlanTable[${i}].march`, income.march)
            set(answers, `incomePlanTable[${i}].april`, income.april)
            set(answers, `incomePlanTable[${i}].may`, income.may)
            set(answers, `incomePlanTable[${i}].june`, income.june)
            set(answers, `incomePlanTable[${i}].july`, income.july)
            set(answers, `incomePlanTable[${i}].august`, income.august)
            set(answers, `incomePlanTable[${i}].september`, income.september)
            set(answers, `incomePlanTable[${i}].october`, income.october)
            set(answers, `incomePlanTable[${i}].november`, income.november)
            set(answers, `incomePlanTable[${i}].december`, income.december)
          })

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default IncomePlanTemplate
