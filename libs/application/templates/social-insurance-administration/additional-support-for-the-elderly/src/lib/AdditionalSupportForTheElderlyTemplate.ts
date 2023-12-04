import { assign } from 'xstate'
import set from 'lodash/set'

import {
  ApplicationTemplate,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  ApplicationTypes,
  ApplicationConfigurations,
  ApplicationRole,
  DefaultEvents,
  NationalRegistryUserApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { EphemeralStateLifeCycle } from '@island.is/application/core'

import {
  SocialInsuranceAdministrationApplicantApi,
  SocialInsuranceAdministrationCurrenciesApi,
} from '../dataProviders'
import {
  Events,
  Roles,
  States,
} from '@island.is/application/templates/social-insurance-administration-core/constants'
import { additionalSupportForTheElderyFormMessage } from './messages'
import { dataSchema } from './dataSchema'

const AdditionalSupportForTheElderlyTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY,
  name: additionalSupportForTheElderyFormMessage.shared.applicationTitle,
  institution: additionalSupportForTheElderyFormMessage.shared.institution,
  translationNamespaces: [
    ApplicationConfigurations.AdditionalSupportForTheElderly.translation,
  ],
  dataSchema,
  allowMultipleApplicationsInDraft: false,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              api: [
                NationalRegistryUserApi,
                SocialInsuranceAdministrationApplicantApi,
                SocialInsuranceAdministrationCurrenciesApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: States.DRAFT,
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignOrganization: assign((context) => {
        const { application } = context
        const TR_ID = InstitutionNationalIds.TRYGGINGASTOFNUN ?? ''

        const assignees = application.assignees
        if (TR_ID) {
          if (Array.isArray(assignees) && !assignees.includes(TR_ID)) {
            assignees.push(TR_ID)
            set(application, 'assignees', assignees)
          } else {
            set(application, 'assignees', [TR_ID])
          }
        }

        return context
      }),
      clearAssignees: assign((context) => ({
        ...context,
        application: {
          ...context.application,
          assignees: [],
        },
      })),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }

    const TR_ID = InstitutionNationalIds.TRYGGINGASTOFNUN
    if (id === TR_ID) {
      return Roles.ORGANIZATION_REVIEWER
    }

    return undefined
  },
  //answerValidators,
}

export default AdditionalSupportForTheElderlyTemplate
