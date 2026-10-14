import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  DefaultEvents,
  FormModes,
  ApplicationConfigurations,
  defineTemplateApi,
} from '@island.is/application/types'
import { AuthDelegationType } from '@island.is/shared/types'
import { CodeOwners } from '@island.is/shared/constants'
import { Features } from '@island.is/feature-flags'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { isCompany } from 'kennitala'
import {
  Events,
  Roles,
  States,
  SUBMIT_EXTERNAL_DATA_ID,
} from '../utils/constants'
import { canStartApplication } from '../utils/canStartApplication'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import {
  IdentityApi,
  SelfAssessmentIsRegulatedApi,
  SelfAssessmentQuestionsApi,
  UserProfileApiWithValidation,
} from '../dataProviders'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FJARSKIPTASTOFA_SELF_ASSESSMENT,
  name: m.application.name,
  codeOwner: CodeOwners.Juni,
  institution: m.application.institution,
  translationNamespaces:
    ApplicationConfigurations.FjarskiptastofaSelfAssessment.translation,
  dataSchema,
  // Gate the application's visibility behind a feature flag so it can be rolled
  // out gradually (hidden until the flag is enabled per environment).
  featureFlag: Features.fjarskiptastofaSelfAssessment,
  // Only companies (or actors acting on their behalf) may apply
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
  ],
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          // Check whether the company is a supervised entity with an open access
          // window on entry. The isRegulated provider throws when the company is
          // not eligible, so the error shows on this prerequisites screen and the
          // company cannot continue to the draft.
          onEntry: [SelfAssessmentIsRegulatedApi],
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
                  name: m.prerequisites.submit,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [SelfAssessmentIsRegulatedApi],
              delete: true,
            },
            {
              id: Roles.NOTALLOWED,
              formLoader: () =>
                import('../forms/notAllowedForm').then((module) =>
                  Promise.resolve(module.notAllowedForm),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          // Only a company that Fjarskiptastofa reports as a supervised entity
          // with an open access window may start the assessment. The flags are
          // stored by the isRegulated data provider on entry; the prerequisites
          // screen also shows the error, but this guard is the real enforcement
          // (an ineligible company stays in prerequisites and cannot continue).
          [DefaultEvents.SUBMIT]: [
            {
              target: States.DRAFT,
              cond: canStartApplication,
            },
          ],
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          progress: 0.4,
          status: FormModes.DRAFT,
          // The applicant has 7 days to complete the self-assessment once it is
          // started; after that the draft is pruned.
          lifecycle: pruneAfterDays(7),
          // Fetch the company data and the assessment categories/questions on
          // entry to the draft state so the main form can render them from
          // external data. The user profile fetch also validates that the
          // company (or actor) has a registered email and phone number.
          onEntry: [
            IdentityApi,
            UserProfileApiWithValidation,
            SelfAssessmentQuestionsApi,
          ],
          // Submit the completed self-assessment to Fjarskiptastofa on the way
          // to the completed state.
          onExit: defineTemplateApi({
            action: 'submitSelfAssessment',
            // Store the returned scoring so the completed form can render the
            // preliminary findings from it.
            externalDataId: SUBMIT_EXTERNAL_DATA_ID,
          }),
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
                  name: m.overview.submit,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [
                IdentityApi,
                UserProfileApiWithValidation,
                SelfAssessmentQuestionsApi,
              ],
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
          name: States.COMPLETED,
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
  mapUserToRole(nationalId: string): ApplicationRole | undefined {
    // Only companies (or delegated actors) may access the application; everyone
    // else gets the "not allowed" screen. Every company can open the
    // prerequisites screen regardless of whether it is a supervised entity; the
    // regulation/access-window check runs in the isRegulated data provider on
    // entry and surfaces an error on that screen when the company is not eligible.
    if (!isCompany(nationalId)) {
      return Roles.NOTALLOWED
    }

    return Roles.APPLICANT
  },
}

export default template
