import { pruneAfterDays } from '@island.is/application/core'

import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  InstitutionNationalIds,
  defineTemplateApi,
} from '@island.is/application/types'
import { partialSchema } from './dataSchema'
import { general } from './messages'
import { TemplateApiActions } from './types'
import { Features } from '@island.is/feature-flags'
import { assign } from 'xstate'
import set from 'lodash/set'

export enum ApplicationStates {
  REQUIREMENTS = 'requirements',
  DRAFT = 'draft',
  DRAFT_RETRY = 'draft_retry',
  SUBMITTED = 'submitted',
  COMPLETE = 'complete',
}

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}
type OJOIEvents =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }

const OJOITemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<OJOIEvents>,
  OJOIEvents
> = {
  type: ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND,
  name: general.applicationName,
  institution: general.ministryOfJustice,
  featureFlag: Features.officialJournalOfIceland,
  translationNamespaces: [
    ApplicationConfigurations.OfficialJournalOfIceland.translation,
  ],
  dataSchema: partialSchema,
  allowMultipleApplicationsInDraft: true,
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
    initial: ApplicationStates.REQUIREMENTS,
    states: {
      [ApplicationStates.REQUIREMENTS]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'draft',
          lifecycle: pruneAfterDays(90),
          progress: 0.33,
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: true,
              formLoader: () =>
                import('../forms/Requirements').then((val) =>
                  Promise.resolve(val.Requirements),
                ),
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: ApplicationStates.DRAFT,
            },
          ],
        },
      },
      [ApplicationStates.DRAFT]: {
        entry: 'assignToInstitution',
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'inprogress',
          progress: 0.66,
          lifecycle: pruneAfterDays(90),
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: true,
              formLoader: () =>
                import('../forms/Draft').then((val) =>
                  Promise.resolve(val.Draft),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: general.sendApplication,
                  type: 'primary',
                },
              ],
            },
            {
              id: Roles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: ApplicationStates.SUBMITTED,
            },
          ],
        },
      },
      [ApplicationStates.DRAFT_RETRY]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'inprogress',
          progress: 0.66,
          lifecycle: pruneAfterDays(90),
          onEntry: [
            defineTemplateApi({
              action: TemplateApiActions.departments,
              externalDataId: 'departments',
              order: 1,
            }),
            defineTemplateApi({
              action: TemplateApiActions.types,
              externalDataId: 'types',
              order: 2,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: true,
              formLoader: () =>
                import('../forms/DraftRetry').then((val) =>
                  Promise.resolve(val.DraftRetry),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: general.sendApplication,
                  type: 'primary',
                },
              ],
            },
            {
              id: Roles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: [
            {
              target: ApplicationStates.SUBMITTED,
            },
          ],
        },
      },
      [ApplicationStates.SUBMITTED]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(90),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.postApplication,
            shouldPersistToExternalData: true,
            externalDataId: 'successfullyPosted',
            throwOnError: false,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              formLoader: () =>
                import('../forms/Submitted').then((val) =>
                  Promise.resolve(val.Submitted),
                ),
            },
            {
              id: Roles.ASSIGNEE,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: ApplicationStates.COMPLETE,
          },
          [DefaultEvents.REJECT]: {
            target: ApplicationStates.DRAFT_RETRY,
          },
        },
      },
      [ApplicationStates.COMPLETE]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(90),
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: true,
              formLoader: () =>
                import('../forms/Complete').then((val) =>
                  Promise.resolve(val.Complete),
                ),
            },
            {
              id: Roles.ASSIGNEE,
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
      return Roles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    return undefined
  },
}

export default OJOITemplate
