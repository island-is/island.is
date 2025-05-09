import {
  ApplicationTemplate,
  ApplicationConfigurations,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
} from '@island.is/application/types'

import { assign } from 'xstate'
import { legalGazetteDataSchema } from './dataSchema'
import { CodeOwners } from '@island.is/shared/constants'
import { LegalGazetteStates } from './constants'
import { m } from './messages'
import { pruneAfterDays } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'

type ReferenceTemplateEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const getApplicationName = (_application: Application) => {
  return `Lögbirting`
}

const LegalGazetteApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.LEGAL_GAZETTE,
  name: getApplicationName,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: m.general.institution,
  translationNamespaces: [ApplicationConfigurations.LegalGazette.translation],
  dataSchema: legalGazetteDataSchema,
  allowMultipleApplicationsInDraft: true,
  featureFlag: Features.legalGazette,
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
              id: Roles.APPLICANT,
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
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: LegalGazetteStates.DRAFT,
          },
        },
      },
      [LegalGazetteStates.DRAFT]: {
        meta: {
          name: 'Uppsetning',
          progress: 0.5,
          status: 'draft',
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DraftForm').then((module) =>
                  Promise.resolve(module.DraftForm),
                ),
              write: 'all',
              read: 'all',
              delete: true,
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
  mapUserToRole(id: string, application: Application) {
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    return undefined
  },
}

export default LegalGazetteApplicationTemplate
