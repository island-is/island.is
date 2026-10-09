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
import { AuthDelegationType } from '@island.is/shared/types'
import { CodeOwners } from '@island.is/shared/constants'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { isCompany } from 'kennitala'
import {
  Events,
  Roles,
  States,
  SUBMIT_EXTERNAL_DATA_ID,
} from '../utils/constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import {
  IdentityApi,
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
  // TODO: Change to the Fjarskiptastofa code owner once a team is registered
  codeOwner: CodeOwners.NordaApplications,
  institution: m.application.institution,
  translationNamespaces:
    ApplicationConfigurations.FjarskiptastofaSelfAssessment.translation,
  dataSchema,
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
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
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
  mapUserToRole(
    nationalId: string,
    _application: Application,
  ): ApplicationRole | undefined {
    // Only allow companies (or delegated actors) to access the application
    if (isCompany(nationalId)) {
      return Roles.APPLICANT
    }
    return Roles.NOTALLOWED
  },
}

export default template
