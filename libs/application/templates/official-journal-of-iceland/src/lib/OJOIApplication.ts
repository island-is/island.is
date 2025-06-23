import { getValueViaPath, pruneAfterDays } from '@island.is/application/core'

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
import { InputFields, TemplateApiActions } from './types'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import { assign } from 'xstate'
import set from 'lodash/set'
import { CodeOwners } from '@island.is/shared/constants'
import { ApiScope } from '@island.is/auth/scopes'

export enum ApplicationStates {
  REQUIREMENTS = 'requirements',
  DRAFT = 'draft',
  DRAFT_RETRY = 'draft_retry',
  SUBMITTED = 'submitted',
  COMPLETE = 'complete',
  REJECTED = 'rejected',
}

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const getApplicationName = (application: Application) => {
  const title = getValueViaPath(
    application.answers,
    InputFields.advert.title,
    '',
  )

  const type = getValueViaPath(
    application.answers,
    `${InputFields.advert.type}.title`,
    '',
  )

  if (!title || !type) {
    return general.applicationName
  }

  return `${type} ${title}`
}

export type OJOIEvents =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.EDIT }

const OJOITemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<OJOIEvents>,
  OJOIEvents
> = {
  type: ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND,
  name: getApplicationName,
  codeOwner: CodeOwners.Hugsmidjan,
  institution: general.ministryOfJustice,
  featureFlag: Features.officialJournalOfIceland,
  translationNamespaces: [
    ApplicationConfigurations.OfficialJournalOfIceland.translation,
  ],
  dataSchema: partialSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [ApiScope.ojoiAdverts],
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
          actionCard: {
            tag: {
              label: general.draftStatusLabel,
              variant: 'blue',
            },
          },
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
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: ApplicationStates.SUBMITTED,
            },
          ],
          [DefaultEvents.REJECT]: {
            target: ApplicationStates.REJECTED,
          },
        },
      },
      [ApplicationStates.DRAFT_RETRY]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'inprogress',
          progress: 0.66,
          lifecycle: pruneAfterDays(90),
          actionCard: {
            tag: {
              label: general.draftStatusLabel,
              variant: 'blue',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: false,
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
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: ApplicationStates.SUBMITTED,
            },
          ],
          [DefaultEvents.REJECT]: {
            target: ApplicationStates.REJECTED,
          },
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
          actionCard: {
            tag: {
              label: general.submittedStatusLabel,
              variant: 'purple',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: false,
              formLoader: () =>
                import('../forms/Submitted').then((val) =>
                  Promise.resolve(val.Submitted),
                ),
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: ApplicationStates.COMPLETE,
          },
          [DefaultEvents.EDIT]: {
            target: ApplicationStates.DRAFT_RETRY,
          },
          [DefaultEvents.REJECT]: {
            target: ApplicationStates.REJECTED,
          },
        },
      },
      [ApplicationStates.COMPLETE]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(90),
          actionCard: {
            tag: {
              label: 'Útgefið',
              variant: 'mint',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: false,
              formLoader: () =>
                import('../forms/Complete').then((val) =>
                  Promise.resolve(val.Complete),
                ),
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
              read: 'all',
              write: 'all',
            },
          ],
        },
      },
      [ApplicationStates.REJECTED]: {
        meta: {
          name: 'Umsókn hafnað',
          status: 'rejected',
          lifecycle: pruneAfterDays(90),
          actionCard: {
            tag: {
              label: 'Hafnað',
              variant: 'red',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              delete: false,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
            },
            {
              id: Roles.ASSIGNEE,
              shouldBeListedForRole: false,
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
