import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import {
  Events,
  Roles,
  States,
} from '@island.is/application/templates/social-insurance-administration-core/lib/constants'
import {
  statesMessages as coreSIAStatesMessages,
  socialInsuranceAdministrationMessage,
} from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
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
  NationalRegistrySpouseApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { CodeOwners } from '@island.is/shared/constants'
import { assign } from 'xstate'
import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationIsApplicantEligibleApi,
} from '../dataProviders'
import { dataSchema } from './dataSchema'
import {
  medicalAndRehabilitationPaymentsFormMessage,
  statesMessages,
} from './messages'
import { Features } from '@island.is/feature-flags'

const MedicalAndRehabilitationPaymentsTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS,
  name: medicalAndRehabilitationPaymentsFormMessage.shared.applicationTitle,
  codeOwner: CodeOwners.Deloitte,
  institution: socialInsuranceAdministrationMessage.shared.institution,
  translationNamespaces:
    ApplicationConfigurations.MedicalAndRehabilitationPayments.translation,
  dataSchema,
  // allowMultipleApplicationsInDraft: false,
  featureFlag: Features.medicalAndRehabilitationPayments,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites/index').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                UserProfileApi.configure({
                  params: {
                    validateEmail: true,
                  },
                }),
                SocialInsuranceAdministrationApplicantApi,
                SocialInsuranceAdministrationIsApplicantEligibleApi,
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
          name: States.DRAFT,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            description: coreSIAStatesMessages.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/MedicalAndRehabilitationPaymentsForm/index'
                ).then((module) =>
                  Promise.resolve(module.MedicalAndRehabilitationPaymentsForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
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
            target: States.APPROVED,
          },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: States.APPROVED,
          status: 'approved',
          actionCard: {
            pendingAction: {
              title: coreSIAStatesMessages.applicationApproved,
              content: statesMessages.applicationApprovedDescription,
              displayStatus: 'success',
            },
          },
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReview').then((module) =>
                  Promise.resolve(module.InReview),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole: (
    _nationalId: string,
    _application: Application,
  ): ApplicationRole | undefined => {
    return Roles.APPLICANT
  },
}

export default MedicalAndRehabilitationPaymentsTemplate
