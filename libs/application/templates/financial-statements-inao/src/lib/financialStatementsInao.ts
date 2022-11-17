import { DefaultStateLifeCycle } from '@island.is/application/core'
import type { User } from '@island.is/api/domains/national-registry'

import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'
import { m } from './messages'
import { Events, States, Roles, ApiActions } from './constants'
import { dataSchema } from './utils/dataSchema'
import { Features } from '@island.is/feature-flags'

import { getCurrentUserType } from './utils/helpers'

import { AuthDelegationType } from '../types/schema'
import { FSIUSERTYPE } from '../types'

const FinancialStatementInaoApplication: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FINANCIAL_STATEMENTS_INAO,
  name: (application) => {
    const { answers, externalData } = application
    const userType = getCurrentUserType(answers, externalData)
    const hasApprovedExternalData = application.answers?.approveExternalData
    const currentUser = hasApprovedExternalData
      ? (externalData?.nationalRegistry?.data as User)
      : undefined

    if (userType === FSIUSERTYPE.INDIVIDUAL) {
      return currentUser
        ? `${m.applicationTitleAlt.defaultMessage} - ${currentUser.name}`
        : m.applicationTitleAlt
    }

    return currentUser
      ? `${m.applicationTitle.defaultMessage} - ${currentUser.name}`
      : m.applicationTitle
  },
  institution: m.institutionName,
  dataSchema,
  featureFlag: Features.financialStatementInao,
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          actionCard: {
            title: m.applicationTitle,
          },
          onEntry: {
            apiModuleAction: ApiActions.getUserType,
            shouldPersistToExternalData: true,
          },

          progress: 0.4,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/application').then((module) =>
                  Promise.resolve(module.getApplication()),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
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
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
            throwOnError: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
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

export default FinancialStatementInaoApplication
