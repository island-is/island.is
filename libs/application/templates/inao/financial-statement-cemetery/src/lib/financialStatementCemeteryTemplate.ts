import {
  DefaultStateLifeCycle,
  pruneAfterDays,
  getValueViaPath,
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
  IdentityApiProvider,
  NationalRegistryUserApi,
  UserInfoApi,
} from '../dataProviders'
import { ApiActions, Events, Roles, States } from '../types/types'
import { Features } from '@island.is/feature-flags'
import { CEMETERY_USER_TYPE } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY]

const FinancialStatementCemeteryTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FINANCIAL_STATEMENT_CEMETERY,
  name: m.applicationTitle,
  codeOwner: CodeOwners.NordaApplications,
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
          onEntry: defineTemplateApi({
            action: ApiActions.getUserType,
            shouldPersistToExternalData: true,
          }),
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
                IdentityApiProvider,
                NationalRegistryUserApi,
                UserInfoApi,
              ],
            },
            {
              id: Roles.NOTALLOWED,
              formLoader: () =>
                import('../forms/notAllowed').then((val) =>
                  Promise.resolve(val.notAllowedForm),
                ),
              read: 'all',
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
    _nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    const userType = getValueViaPath<number>(
      application.externalData,
      'getUserType.data.value',
    )

    if (userType === CEMETERY_USER_TYPE) {
      return Roles.APPLICANT
    }
    return Roles.NOTALLOWED
  },
}

export default FinancialStatementCemeteryTemplate
