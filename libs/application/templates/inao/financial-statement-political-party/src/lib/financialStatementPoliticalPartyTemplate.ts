import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationConfigurations,
  Application,
  ApplicationRole,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions, Events, Roles, States } from '../types/types'
import { m } from './messages'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  CurrentUserTypeProvider,
  IdentityApiProvider,
  NationalRegistryV3UserApi,
  UserInfoApi,
} from '../dataProviders'
import { AuthDelegationType } from '@island.is/shared/types'
import { Features } from '@island.is/feature-flags'
import { POLITICALPARTY_USER_TYPE } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[
    ApplicationTypes.FINANCIAL_STATEMENT_POLITICAL_PARTY
  ]

const FinancialStatementPoliticalPartyTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FINANCIAL_STATEMENT_POLITICAL_PARTY,
  name: m.applicationTitle,
  codeOwner: CodeOwners.NordaApplications,
  institution: m.institutionName,
  translationNamespaces: [configuration.translation],
  dataSchema,
  featureFlag: Features.FinancialStatementPoliticalPartyEnabled,
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
                import('../forms/prerequsites').then((val) =>
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
                NationalRegistryV3UserApi,
                UserInfoApi,
              ],
            },
            {
              id: Roles.NOTALLOWED,
              formLoader: () =>
                import('../forms/notAllowedForm').then((val) =>
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
          name: States.DRAFT,
          actionCard: {
            title: m.applicationTitle,
          },
          status: States.DRAFT,
          lifecycle: pruneAfterDays(60),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/applicationForm').then((val) =>
                  Promise.resolve(val.FinancialStatementPoliticalPartyForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
              api: [
                CurrentUserTypeProvider,
                IdentityApiProvider,
                NationalRegistryV3UserApi,
                UserInfoApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: States.DONE,
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
    if (userType === POLITICALPARTY_USER_TYPE) {
      return Roles.APPLICANT
    }
    return Roles.NOTALLOWED
  },
}

export default FinancialStatementPoliticalPartyTemplate
