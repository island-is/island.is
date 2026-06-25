import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  FormModes,
  UserProfileApi,
} from '@island.is/application/types'
import { CodeOwners } from '@island.is/shared/constants'
import { AuthDelegationType } from '@island.is/shared/types'

import { Events, Roles, States } from '../utils/constants'
import { getApplicantRole } from '../utils/roleUtils'
import { dataSchema } from './dataSchema'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
  name: 'Tilkynning til barnaverndar',
  codeOwner: CodeOwners.Deloitte,
  institution: 'Barna- og fjölskyldustofa', // TODO: Confirm correct institution name
  translationNamespaces: [
    ApplicationConfigurations.ChildProtectionNotification.translation,
  ],
  allowedDelegations: [{ type: AuthDelegationType.ProcurationHolder }],
  dataSchema,
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
            Roles.MINOR_APPLICANT,
            Roles.ADULT_PERSONAL_APPLICANT,
            Roles.ADULT_PROCURATION_APPLICANT,
          ].map((roleId) => ({
            id: roleId,
            formLoader: () =>
              import('../forms/prerequisitesForm').then((module) =>
                Promise.resolve(module.Prerequisites),
              ),
            actions: [
              { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' as const },
            ],
            write: 'all' as const,
            read: 'all' as const,
            api: [UserProfileApi],
            delete: true,
          })),
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
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.MINOR_APPLICANT,
              formLoader: () =>
                import('../forms/minorForm').then((module) =>
                  Promise.resolve(module.MinorForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: Roles.ADULT_PERSONAL_APPLICANT,
              formLoader: () =>
                import('../forms/adultPersonalForm').then((module) =>
                  Promise.resolve(module.AdultPersonalForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: Roles.ADULT_PROCURATION_APPLICANT,
              formLoader: () =>
                import('../forms/adultProcurationForm').then((module) =>
                  Promise.resolve(module.AdultProcurationForm),
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
            Roles.MINOR_APPLICANT,
            Roles.ADULT_PERSONAL_APPLICANT,
            Roles.ADULT_PROCURATION_APPLICANT,
          ].map((roleId) => ({
            id: roleId,
            formLoader: () =>
              import('../forms/completedForm').then((module) =>
                Promise.resolve(module.completedForm),
              ),
            read: 'all' as const,
            delete: true,
          })),
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId !== application.applicant) {
      return undefined
    }
    return getApplicantRole(nationalId)
  },
}

export default template
