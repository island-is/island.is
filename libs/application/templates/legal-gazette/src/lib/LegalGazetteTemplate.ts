import {
  ApplicationTemplate,
  ApplicationConfigurations,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  InstitutionNationalIds,
  defineTemplateApi,
} from '@island.is/application/types'

import { assign } from 'xstate'
import { legalGazetteDataSchema } from './dataSchema'
import { CodeOwners } from '@island.is/shared/constants'
import {
  LegalGazetteAPIActions,
  LegalGazetteEvents,
  LegalGazetteRoles,
  LegalGazetteStates,
} from '../utils/constants'
import { m } from './messages'
import { pruneAfterDays } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import set from 'lodash/set'
import { didSubmitSuccessfully, getApplicationName } from '../utils/utils'

const LegalGazetteApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<LegalGazetteEvents>,
  LegalGazetteEvents
> = {
  type: ApplicationTypes.LEGAL_GAZETTE,
  name: getApplicationName,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: m.general.institution,
  translationNamespaces: [ApplicationConfigurations.LegalGazette.translation],
  dataSchema: legalGazetteDataSchema,
  allowMultipleApplicationsInDraft: true,
  featureFlag: Features.legalGazette,
  stateMachineOptions: {
    actions: {
      assignToInstitution: assign((context) => {
        const { application } = context

        set(application, 'assignees', [
          InstitutionNationalIds.DOMSMALA_RADUNEYTID,
        ])

        return context
      }),
    },
  },
  stateMachineConfig: {
    initial: LegalGazetteStates.PREREQUISITES,
    states: {
      [LegalGazetteStates.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: 'draft',
          lifecycle: pruneAfterDays(7),
          roles: [
            {
              id: LegalGazetteRoles.APPLICANT,
              formLoader: () =>
                import('../forms/RequirementsForm').then((module) =>
                  Promise.resolve(module.RequirementsForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: LegalGazetteRoles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: LegalGazetteStates.DRAFT,
          },
        },
      },
      [LegalGazetteStates.DRAFT]: {
        entry: 'assignToInstitution',
        meta: {
          name: 'Uppsetning',
          progress: 0.5,
          status: 'draft',
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          actionCard: {
            tag: {
              label: 'Í vinnslu hjá innsendanda',
              variant: 'blue',
            },
          },
          roles: [
            {
              id: LegalGazetteRoles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftForm').then((module) =>
                  Promise.resolve(module.DraftForm),
                ),
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: LegalGazetteRoles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
          onEntry: defineTemplateApi({
            action: LegalGazetteAPIActions.getCategories,
            shouldPersistToExternalData: true,
            externalDataId: 'categories',
          }),
          onExit: defineTemplateApi({
            action: LegalGazetteAPIActions.submitApplication,
            triggerEvent: DefaultEvents.SUBMIT,
            shouldPersistToExternalData: true,
            externalDataId: 'successfullyPosted',
            throwOnError: false,
          }),
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: LegalGazetteStates.SUBMITTED,
              cond: didSubmitSuccessfully,
            },
          ],
        },
      },
      [LegalGazetteStates.SUBMITTED]: {
        meta: {
          name: 'Staðfesting',
          progress: 1,
          status: 'inprogress',
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          actionCard: {
            tag: {
              label: 'Í vinnslu hjá ritstjórn',
              variant: 'blueberry',
            },
          },
          roles: [
            {
              id: LegalGazetteRoles.APPLICANT,
              formLoader: () =>
                import('../forms/SubmittedForm').then((module) =>
                  Promise.resolve(module.SubmittedForm),
                ),
              write: 'all',
              read: 'all',
              delete: false,
            },
            {
              id: LegalGazetteRoles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: LegalGazetteStates.APPROVED,
          },
          [DefaultEvents.REJECT]: {
            target: LegalGazetteStates.REJECTED,
          },
        },
      },
      [LegalGazetteStates.APPROVED]: {
        meta: {
          name: 'Staðfest',
          progress: 1,
          status: 'approved',
          lifecycle: pruneAfterDays(7),
          actionCard: {
            tag: {
              label: 'Samþykkt',
              variant: 'mint',
            },
          },
          roles: [
            {
              id: LegalGazetteRoles.APPLICANT,
              formLoader: () =>
                import('../forms/ApprovedForm').then((module) =>
                  Promise.resolve(module.ApprovedForm),
                ),
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: LegalGazetteRoles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
        },
      },
      [LegalGazetteStates.REJECTED]: {
        meta: {
          name: 'Hafnað',
          progress: 1,
          status: 'rejected',
          lifecycle: pruneAfterDays(7),
          actionCard: {
            tag: {
              label: 'Hafnað',
              variant: 'red',
            },
          },
          roles: [
            {
              id: LegalGazetteRoles.APPLICANT,
              formLoader: () =>
                import('../forms/RejectedForm').then((module) =>
                  Promise.resolve(module.RejectedForm),
                ),
              write: 'all',
              read: 'all',
              delete: true,
            },
            {
              id: LegalGazetteRoles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(id: string, application: Application) {
    if (id === application.applicant) {
      return LegalGazetteRoles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return LegalGazetteRoles.ASSIGNEE
    }
    return undefined
  },
}

export default LegalGazetteApplicationTemplate
