import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/core'
import { DataProtectionComplaintSchema } from './dataSchema'
import { application } from './messages'
import { Roles, TEMPLATE_API_ACTIONS } from '../shared'
import { States } from '../constants'

type DataProtectionComplaintEvent = { type: DefaultEvents.SUBMIT }

const DataProtectionComplaintTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<DataProtectionComplaintEvent>,
  DataProtectionComplaintEvent
> = {
  type: ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT,
  name: application.name,
  institution: application.institutionName,
  dataSchema: DataProtectionComplaintSchema,
  readyForProduction: true,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.name.defaultMessage,
          progress: 0.5,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 5 * 60000, //5 minutes
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ComplaintForm').then((module) =>
                  Promise.resolve(module.ComplaintForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.IN_REVIEW,
          },
        },
      },
      [States.IN_REVIEW]: {
        meta: {
          name: 'In Review',
          progress: 1,
          actionCard: {
            tag: { label: application.submittedTag, variant: 'blueberry' },
          },
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 5 * 60000, //5 minutes
          },
          onEntry: {
            apiModuleAction: TEMPLATE_API_ACTIONS.sendApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ComplaintFormInReview').then((module) =>
                  Promise.resolve(module.ComplaintFormInReview),
                ),
              write: 'all',
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
}

export default DataProtectionComplaintTemplate
