import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryV3UserApi,
  UserProfileApi,
  ApplicationConfigurations,
} from '@island.is/application/types'
import { DataProtectionComplaintSchema } from './dataSchema'
import { application } from './messages'
import { Roles, TEMPLATE_API_ACTIONS } from '../shared'
import { States } from '../constants'
import { CodeOwners } from '@island.is/shared/constants'

type DataProtectionComplaintEvent = { type: DefaultEvents.SUBMIT }

export const DefaultSubmitHistoryLog = {
  onEvent: DefaultEvents.SUBMIT,
  logMessage: application.applicationSubmitted,
}

const DataProtectionComplaintTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<DataProtectionComplaintEvent>,
  DataProtectionComplaintEvent
> = {
  type: ApplicationTypes.DATA_PROTECTION_AUTHORITY_COMPLAINT,
  name: application.name,
  codeOwner: CodeOwners.NordaApplications,
  institution: application.institutionName,
  dataSchema: DataProtectionComplaintSchema,
  translationNamespaces:
    ApplicationConfigurations.DataProtectionAuthorityComplaint.translation,
  stateMachineConfig: {
    initial: 'draft',
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.name.defaultMessage,
          progress: 0.5,
          status: 'draft',
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 5 * 60000, //5 minutes
          },
          actionCard: {
            historyLogs: [DefaultSubmitHistoryLog],
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
              api: [NationalRegistryV3UserApi, UserProfileApi],
            },
          ],
        },
        on: {
          SUBMIT: {
            target: States.Completed,
          },
        },
      },
      [States.Completed]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 5 * 60000, //5 minutes
          },
          onEntry: defineTemplateApi({
            action: TEMPLATE_API_ACTIONS.sendApplication,
          }),
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
