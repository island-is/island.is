import {
  DefaultStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'

import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  ApplicationConfigurations,
  defineTemplateApi,
} from '@island.is/application/types'
import { m } from './messages'
import { AuthDelegationType } from '@island.is/shared/types'
import { dataSchema } from './dataSchema'

import {
  CurrentUserTypeProvider,
  IndentityApiProvider,
  NationalRegistryUserApi,
  UserInfoApi,
} from '../dataProviders'
import { ApiActions, Events, Roles, States } from '../types/types'
import { Features } from '@island.is/feature-flags'

const configuration =
  ApplicationConfigurations[ApplicationTypes.FINANCIAL_STATEMENTS_INAO]

const FinancialStatementCemeteryTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY,
  name: m.applicationTitle,
  institution: m.institutionName,
  translationNamespaces: [configuration.translation],
  featureFlag: Features.FinancialStatementCemetery,
  dataSchema,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          progress: 0,
          status: 'draft',
          actionCard: {
            pendingAction: {
              title: '',
              displayStatus: 'success',
            },
          },
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
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
              api: [
                CurrentUserTypeProvider,
                IndentityApiProvider,
                NationalRegistryUserApi,
                UserInfoApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [{ target: States.DRAFT }],
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            title: m.applicationTitle,
          },
          status: 'draft',
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/applicationForm').then((val) =>
                  Promise.resolve(val.FinancialStatementCemeteryForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserInfoApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.applicant === nationalId) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default FinancialStatementCemeteryTemplate
