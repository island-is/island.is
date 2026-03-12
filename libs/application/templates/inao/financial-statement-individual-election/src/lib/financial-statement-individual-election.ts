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
  defineTemplateApi,
  ApplicationConfigurations,
} from '@island.is/application/types'

import {
  CurrentUserTypeProvider,
  IdentityApiProvider,
  NationalRegistryV3UserApi,
  UserInfoApi,
} from '../dataProviders'

import { m } from './messages'
import { ApiActions, Events, Roles, States } from '../types/types'
import { dataSchema } from './dataSchema'
import { Features } from '@island.is/feature-flags'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[
    ApplicationTypes.FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION
  ]

const FinancialStatementIndividualElectionTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FINANCIAL_STATEMENT_INDIVIDUAL_ELECTION,
  name: m.applicationTitleAlt,
  codeOwner: CodeOwners.NordaApplications,
  institution: m.institutionName,
  dataSchema,
  translationNamespaces: [configuration.translation],
  featureFlag: Features.FinancialStatementIndividualElectionEnabled,
  // allowedDelegations: ...,
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
                IdentityApiProvider,
                NationalRegistryV3UserApi,
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
          onEntry: [
            defineTemplateApi({
              action: ApiActions.fetchElections,
              order: 1,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/applicationForm').then((val) =>
                  Promise.resolve(val.FinancialStatementIndividualElectionForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
              api: [NationalRegistryV3UserApi, UserInfoApi],
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

export default FinancialStatementIndividualElectionTemplate
