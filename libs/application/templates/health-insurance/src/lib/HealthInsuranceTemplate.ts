import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { API_MODULE } from '../shared'
import { answerValidators } from './answerValidators'
import { m } from '../forms/messages'
import { HealthInsuranceSchema } from './dataSchema'

type Events = { type: DefaultEvents.SUBMIT }

enum Roles {
  APPLICANT = 'applicant',
}

enum ApplicationStates {
  PREREQUESITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
}

const applicationName = m.formTitle.defaultMessage

const HealthInsuranceTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.HEALTH_INSURANCE,
  name: applicationName,
  readyForProduction: true,
  dataSchema: HealthInsuranceSchema,
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUESITES,
    states: {
      [ApplicationStates.PREREQUESITES]: {
        meta: {
          name: applicationName,
          progress: 0,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // If application stays in this state for 24 hours it will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PrerequisitesForm').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
              delete: true,
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: { target: ApplicationStates.DRAFT },
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          name: applicationName,
          progress: 0.25,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/HealthInsuranceForm').then((module) =>
                  Promise.resolve(module.HealthInsuranceForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              delete: true,
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: ApplicationStates.IN_REVIEW,
          },
        },
      },
      [ApplicationStates.IN_REVIEW]: {
        meta: {
          name: applicationName,
          onEntry: defineTemplateApi({
            action: API_MODULE.sendApplyHealthInsuranceApplication,
          }),
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ConfirmationScreen').then((module) =>
                  Promise.resolve(module.HealthInsuranceConfirmation),
                ),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
  answerValidators,
}

export default HealthInsuranceTemplate
