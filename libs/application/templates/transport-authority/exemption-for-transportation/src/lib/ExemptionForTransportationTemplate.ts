import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  ApplicationConfigurations,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions, Events, Roles, States } from '../utils/enums'
import { CodeOwners } from '@island.is/shared/constants'
import { ExemptionForTransportationSchema } from './dataSchema'
import {
  coreHistoryMessages,
  coreMessages,
  corePendingActionMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { application as applicationMessage, overview } from './messages'
import { Features } from '@island.is/feature-flags'
import {
  ExemptionRulesApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '../dataProviders'
import { ExemptionType } from '../shared'

const determineMessageFromApplicationAnswers = (application: Application) => {
  const exemptionType = getValueViaPath<ExemptionType>(
    application.answers,
    'exemptionPeriod.type',
  )
  if (exemptionType === ExemptionType.SHORT_TERM)
    return applicationMessage.nameShortTerm
  else if (exemptionType === ExemptionType.LONG_TERM)
    return applicationMessage.nameLongTerm
  return applicationMessage.name
}

const ExemptionForTransportationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EXEMPTION_FOR_TRANSPORTATION,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessage.institutionName,
  translationNamespaces:
    ApplicationConfigurations.ExemptionForTransportation.translation,
  dataSchema: ExemptionForTransportationSchema,
  featureFlag: Features.ExemptionForTransportation,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Prerequisites',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPrerequisites,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationStarted,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: coreMessages.buttonNext,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [NationalRegistryUserApi, UserProfileApi, ExemptionRulesApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Draft',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: pruneAfterDays(7),
          onExit: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationSent,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overview.buttons.submit,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: applicationMessage.actionCardCompleted,
              variant: 'blueberry',
            },
            pendingAction: {
              title: corePendingActionMessages.applicationReceivedTitle,
              displayStatus: 'success',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
              delete: true,
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
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default ExemptionForTransportationTemplate
