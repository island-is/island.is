import { DefaultStateLifeCycle } from '@island.is/application/core'
import { OfficalJournalOfIcelandSchema } from './dataSchema'
import { m } from './messages'

import {
  Application,
  ApplicationRole,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/types'

const ApplicationStates = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  // inReview: 'inReview',
  approved: 'approved',
}

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

type OfficalJournalOfIcelandEvents =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

const OfficalJournalOfIcelandApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<OfficalJournalOfIcelandEvents>,
  OfficalJournalOfIcelandEvents
> = {
  type: ApplicationTypes.OFFICAL_JOURNAL_OF_ICELAND,
  name: m.applicationName,
  institution: m.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.OfficalJournalOfIceland.translation,
  ],
  dataSchema: OfficalJournalOfIcelandSchema,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: ApplicationStates.prerequisites,
    states: {
      [ApplicationStates.prerequisites]: {
        meta: {
          name: 'Application name test',
          status: 'draft',
          progress: 0.33,
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: 24 * 3600 * 1000,
            shouldDeleteChargeIfPaymentFulfilled: null,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequsitesForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda umsókn',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          SUBMIT: ApplicationStates.draft,
        },
      },
      [ApplicationStates.draft]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.66,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              formLoader: () =>
                import('../forms/BasicInformation').then((val) =>
                  Promise.resolve(val.BasicInformation),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Senda umsókn',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          SUBMIT: ApplicationStates.approved,
        },
      },
      [ApplicationStates.approved]: {
        meta: {
          name: '',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          status: 'approved',
        },
        type: 'final',
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (application.assignees.includes(nationalId)) {
      return Roles.ASSIGNEE
    }
    if (application.applicant === nationalId) {
      if (application.state === 'inReview') {
        return Roles.ASSIGNEE
      }

      return Roles.APPLICANT
    }
  },
}

export default OfficalJournalOfIcelandApplicationTemplate
