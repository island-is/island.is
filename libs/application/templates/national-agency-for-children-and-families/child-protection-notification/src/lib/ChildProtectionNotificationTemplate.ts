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
  defineTemplateApi,
} from '@island.is/application/types'
import { CodeOwners } from '@island.is/shared/constants'
import { AuthDelegationType } from '@island.is/shared/types'

import {
  CategoriesApi,
  GendersApi,
  GuardianNotAwareReasonsApi,
  IdentityApiProvider,
  PostalCodesApi,
  PronounsApi,
  ProtectiveFactorsApi,
  UrgencyAssessmentsApi,
} from '../dataProviders'
import {
  overviewMessages,
  prerequisitesMessages,
  sharedMessages,
} from '../lib/messages'
import { ApiModuleActions, Events, Roles, States } from '../utils/constants'
import { getApplicantRole } from '../utils/roleUtils'
import { dataSchema } from './dataSchema'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
  name: sharedMessages.applicationName,
  codeOwner: CodeOwners.Deloitte,
  institution: sharedMessages.institution, // TODO: Confirm correct institution name
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
          onExit: [
            defineTemplateApi({
              action: ApiModuleActions.getChildInformation,
              externalDataId: 'childInformation',
              namespace: ApplicationTypes.CHILD_PROTECTION_NOTIFICATION,
              throwOnError: true,
            }),
          ],
          roles: [
            ...[Roles.MINOR_APPLICANT, Roles.ADULT_PERSONAL_APPLICANT].map(
              (roleId) => ({
                id: roleId,
                formLoader: () =>
                  import('../forms/prerequisitesForm').then((module) =>
                    Promise.resolve(module.PersonalPrerequisites),
                  ),
                actions: [
                  {
                    event: DefaultEvents.SUBMIT,
                    name: overviewMessages.submitButton,
                    type: 'primary' as const,
                  },
                ],
                write: 'all' as const,
                read: 'all' as const,
                api: [
                  UserProfileApi,
                  IdentityApiProvider,
                  CategoriesApi,
                  ProtectiveFactorsApi,
                  GendersApi,
                  PronounsApi,
                  UrgencyAssessmentsApi,
                  PostalCodesApi,
                  GuardianNotAwareReasonsApi,
                ],
                delete: true,
              }),
            ),
            {
              id: Roles.ADULT_PROCURATION_APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: prerequisitesMessages.child.startNotification,
                  type: 'primary' as const,
                },
              ],
              write: 'all' as const,
              read: 'all' as const,
              api: [
                UserProfileApi,
                IdentityApiProvider,
                CategoriesApi,
                ProtectiveFactorsApi,
                GendersApi,
                PronounsApi,
                UrgencyAssessmentsApi,
                PostalCodesApi,
                GuardianNotAwareReasonsApi,
              ],
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
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.MINOR_APPLICANT,
              formLoader: () =>
                import('../forms/minor/draftForm').then((module) =>
                  Promise.resolve(module.MinorDraftForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overviewMessages.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: Roles.ADULT_PERSONAL_APPLICANT,
              formLoader: () =>
                import('../forms/adultPersonal/draftForm').then((module) =>
                  Promise.resolve(module.AdultPersonalDraftForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overviewMessages.submitButton,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: Roles.ADULT_PROCURATION_APPLICANT,
              formLoader: () =>
                import('../forms/adultProcuration/draftForm').then((module) =>
                  Promise.resolve(module.AdultProcurationDraftForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: overviewMessages.submitButton,
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
              id: Roles.MINOR_APPLICANT,
              formLoader: () =>
                import('../forms/minor/completedForm').then((module) =>
                  Promise.resolve(module.MinorCompletedForm),
                ),
              read: 'all',
            },
            {
              id: Roles.ADULT_PERSONAL_APPLICANT,
              formLoader: () =>
                import('../forms/adultPersonal/completedForm').then((module) =>
                  Promise.resolve(module.AdultPersonalCompletedForm),
                ),
              read: 'all',
            },
            {
              id: Roles.ADULT_PROCURATION_APPLICANT,
              formLoader: () =>
                import('../forms/adultProcuration/completedForm').then(
                  (module) =>
                    Promise.resolve(module.AdultProcurationCompletedForm),
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
    if (nationalId !== application.applicant) {
      return undefined
    }
    return getApplicantRole(nationalId)
  },
}

export default template
