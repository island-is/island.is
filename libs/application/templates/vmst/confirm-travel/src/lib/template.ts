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
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { ConfirmTravelUnemploymentBenefitsSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
  pruneAfterDays,
} from '@island.is/application/core'
import { applicationMessages } from './messages'
import { Features } from '@island.is/feature-flags'
import { getEligibility } from '../dataProviders'
import format from 'date-fns/format'
import is from 'date-fns/locale/is'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.UNEMPLOYMENT_CONFIRM_TRAVEL,
  name: applicationMessages.name,
  codeOwner: CodeOwners.Origo,
  institution: applicationMessages.institutionName,
  translationNamespaces:
    ApplicationConfigurations.UnemploymentConfirmTravel.translation,
  dataSchema: ConfirmTravelUnemploymentBenefitsSchema,
  featureFlag: Features.isTravelConfirmationEnabled,
  allowMultipleApplicationsInDraft: false,

  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [getEligibility],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Main form',
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: pruneAfterDays(2),
          actionCard: {
            tag: {
              label: applicationMessages.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: (application) => {
                  const fromStr = getValueViaPath<string>(
                    application.answers,
                    'date.from',
                  )
                  const toStr = getValueViaPath<string>(
                    application.answers,
                    'date.to',
                  )
                  const formatDate = (d?: string) =>
                    d ? format(new Date(d), 'd. MMMM yyyy', { locale: is }) : ''
                  return {
                    ...applicationMessages.applicationSent,
                    values: {
                      from: formatDate(fromStr),
                      to: formatDate(toStr),
                    },
                  }
                },
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
          onExit: defineTemplateApi({
            action: 'submitApplication',
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
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
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
