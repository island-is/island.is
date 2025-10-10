import {
  coreHistoryMessages,
  pruneAfterDays,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  defineTemplateApi,
  NationalRegistryUserApi,
  UserProfileApi,
  DefaultEvents,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { m } from './messages'
import { inheritanceReportSchema } from './dataSchema'
import {
  ApiActions,
  ESTATE_INHERITANCE,
  InheritanceReportEvent,
  PREPAID_INHERITANCE,
  Roles,
  States,
} from './constants'
import { EstateOnEntryApi, MaritalStatusApi } from '../dataProviders'
import { FeatureFlagClient } from '@island.is/feature-flags'
import {
  getApplicationFeatureFlags,
  InheritanceReportFeatureFlags,
} from './getApplicationFeatureFlags'
import { CodeOwners } from '@island.is/shared/constants'

const configuration =
  ApplicationConfigurations[ApplicationTypes.INHERITANCE_REPORT]

const InheritanceReportTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<InheritanceReportEvent>,
  InheritanceReportEvent
> = {
  type: ApplicationTypes.INHERITANCE_REPORT,
  name: ({ answers }) =>
    answers.applicationFor === PREPAID_INHERITANCE
      ? m.prerequisitesTitle.defaultMessage +
        ' - ' +
        m.applicationNamePrepaid.defaultMessage
      : answers.applicationFor === ESTATE_INHERITANCE
      ? m.prerequisitesTitle.defaultMessage +
        ' - ' +
        m.applicationNameEstate.defaultMessage
      : m.prerequisitesTitle.defaultMessage,
  codeOwner: CodeOwners.Juni,
  institution: m.institution,
  dataSchema: inheritanceReportSchema,
  translationNamespaces: configuration.translation,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0,
          lifecycle: pruneAfterDays(14),
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: async ({ featureFlagClient }) => {
                const featureFlags = await getApplicationFeatureFlags(
                  featureFlagClient as FeatureFlagClient,
                )

                const getForm = await import('../forms/prerequisites').then(
                  (val) => val.getForm,
                )

                return getForm({
                  allowEstateApplication:
                    featureFlags[
                      InheritanceReportFeatureFlags.AllowEstateApplication
                    ],
                  allowPrepaidApplication:
                    featureFlags[
                      InheritanceReportFeatureFlags.AllowPrepaidApplication
                    ],
                })
              },
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
            },
          ],
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
        },
        on: {
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.15,
          lifecycle: pruneAfterDays(14),
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.estateInheritanceForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [NationalRegistryUserApi, UserProfileApi, EstateOnEntryApi],
            },
            {
              id: Roles.PREPAID_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.prepaidInheritanceForm),
                ),
              actions: [{ event: 'SUBMIT', name: '', type: 'primary' }],
              write: 'all',
              delete: true,
              api: [
                NationalRegistryUserApi,
                UserProfileApi,
                EstateOnEntryApi,
                MaritalStatusApi,
              ],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.done,
          },
        },
      },
      [States.done]: {
        meta: {
          name: 'Done',
          status: 'approved',
          progress: 1,
          lifecycle: pruneAfterDays(30),
          onEntry: defineTemplateApi({
            action: ApiActions.completeApplication,
            throwOnError: true,
          }),
          roles: [
            {
              id: Roles.ESTATE_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
                ),
              read: 'all',
            },
            {
              id: Roles.PREPAID_INHERITANCE_APPLICANT,
              formLoader: () =>
                import('../forms/done').then((val) =>
                  Promise.resolve(val.done),
                ),
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
      if (application.answers.applicationFor === PREPAID_INHERITANCE) {
        return Roles.PREPAID_INHERITANCE_APPLICANT
      }
      return Roles.ESTATE_INHERITANCE_APPLICANT
    }
  },
}

export default InheritanceReportTemplate
