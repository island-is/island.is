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
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { m } from './messages'
import { Events, States, Roles, ApiActions } from './constants'
import { dataSchema } from './utils/dataSchema'
import { Features } from '@island.is/feature-flags'

import { getCurrentUserType } from './utils/helpers'

import { AuthDelegationType } from '../types/schema'
import { FSIUSERTYPE } from '../types'
import {
  CurrentUserTypeProvider,
  IndentityApiProvider,
  NationalRegistryUserApi,
  UserInfoApi,
} from '../dataProviders'

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
      ? (externalData?.nationalRegistry?.data as NationalRegistryIndividual)
      : undefined

    if (userType === FSIUSERTYPE.INDIVIDUAL) {
      return currentUser
        ? `${m.applicationTitleAlt.defaultMessage} - ${currentUser.fullName}`
        : m.applicationTitleAlt
    }

    return currentUser?.fullName
      ? `${m.applicationTitle.defaultMessage} - ${currentUser.fullName}`
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
          status: 'draft',
          onEntry: defineTemplateApi({
            action: ApiActions.getUserType,
            shouldPersistToExternalData: true,
          }),

          progress: 0.4,
          lifecycle: pruneAfterDays(60),
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

export default FinancialStatementInaoApplication
