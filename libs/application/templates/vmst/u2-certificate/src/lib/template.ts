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
  NationalRegistryV3UserApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { Events, Roles, States, U2Events } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { EESCountriesApi, EligabilityApi } from '../dataProviders'
import { applicationMessages as m } from './messages'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.U2_CERTIFICATE,
  name: m.name,
  codeOwner: CodeOwners.Origo,
  institution: m.institutionName,
  translationNamespaces: ApplicationConfigurations.U2Certificate.translation,
  dataSchema,
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
              api: [NationalRegistryV3UserApi, EESCountriesApi, EligabilityApi],
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
          progress: 0.5,
          status: FormModes.DRAFT,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 2 * 24 * 3600 * 1000, // 2 days
          },
          actionCard: {
            tag: {
              variant: 'blue',
              label: m.inDraft,
            },
          },
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
          onExit: defineTemplateApi({
            action: 'completeApplication',
          }),
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.COMPLETED, // TODO this should actually go to review
          },
        },
      },
      [States.REVIEW]: {
        meta: {
          name: 'Review',
          progress: 0.5, // TODO ?
          status: FormModes.IN_PROGRESS, // TODO Do we need to seperate status from Revoked vs Denied
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 2 * 24 * 3600 * 1000, // 2 days // TODO Probably needs changing
          },
          actionCard: {
            tag: {
              variant: 'purple',
              label: m.sentIn,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                // TODO Replace mainForm
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              read: 'all',
              delete: false, // TODO Can user delete a revoked application ? probably not
            },
          ],
        },
        on: {
          [DefaultEvents.REJECT]: {
            target: States.REJECTED,
          },
          [DefaultEvents.APPROVE]: {
            target: States.COMPLETED,
          },
          [U2Events.REVOKE]: {
            target: States.REVOKED,
          },
        },
      },
      [States.REVOKED]: {
        meta: {
          name: 'Revoked',
          progress: 0.5, // TODO ?
          status: FormModes.REJECTED, // TODO Do we need to seperate status from Revoked vs Denied
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 2 * 24 * 3600 * 1000, // 2 days // TODO Probably needs changing
          },
          actionCard: {
            tag: {
              variant: 'red',
              label: m.revoked,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                // TODO Replace mainForm
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              read: 'all',
              delete: false, // TODO Can user delete a revoked application ? probably not
            },
          ],
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Rejected',
          progress: 0.5, // TODO ?
          status: FormModes.REJECTED,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 2 * 24 * 3600 * 1000, // 2 days // TODO Probably needs changing
          },
          actionCard: {
            tag: {
              variant: 'red',
              label: m.rejected,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                // TODO Replace mainForm
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              read: 'all',
              delete: false, // TODO Can user delete a rejected application ? probably not
            },
          ],
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              variant: 'mint',
              label: m.approved,
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

export default template
