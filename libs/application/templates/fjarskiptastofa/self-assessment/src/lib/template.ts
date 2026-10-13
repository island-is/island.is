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
  getValueViaPath,
} from '@island.is/application/core'
import { isCompany } from 'kennitala'
import {
  Events,
  IS_REGULATED_EXTERNAL_DATA_ID,
  Roles,
  States,
  SUBMIT_EXTERNAL_DATA_ID,
} from '../utils/constants'
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
          // Check the company's access window on entry so mapUserToRole can route
          // a company whose window is closed to the "not allowed" screen.
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
    application: Application,
  ): ApplicationRole | undefined {
    // Only companies (or delegated actors) may access the application.
    if (!isCompany(nationalId)) {
      return Roles.NOTALLOWED
    }

    // A company is also blocked when Fjarskiptastofa reports its access window as
    // closed. The flag is stored by the isRegulated data provider; until it has
    // run the company is let through so the prerequisites screen can load.
    const accessWindowOpen = getValueViaPath<boolean>(
      application.externalData,
      `${IS_REGULATED_EXTERNAL_DATA_ID}.data.accessWindowOpen`,
    )
    if (accessWindowOpen === false) {
      return Roles.NOTALLOWED
    }

    return Roles.APPLICANT
  },
}

export default template
