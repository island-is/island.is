import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'

import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { dataSchema } from './dataSchema'
import { general } from './messages'
import { TemplateApiActions } from './types'

export enum ApplicationStates {
  REQUIREMENTS = 'requirements',
  DRAFT = 'draft',
  COMPLETE = 'complete',
}

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

const OJOITemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND,
  name: general.applicationName,
  institution: general.ministryOfJustice,
  translationNamespaces: [
    ApplicationConfigurations.OfficialJournalOfIceland.translation,
  ],
  dataSchema: dataSchema,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: ApplicationStates.REQUIREMENTS,
    states: {
      [ApplicationStates.REQUIREMENTS]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
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
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'inprogress',
          progress: 0.66,
          lifecycle: DefaultStateLifeCycle,
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
                import('../forms/Draft').then((val) =>
                  Promise.resolve(val.Draft),
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
          SUBMIT: [
            {
              target: ApplicationStates.COMPLETE,
            },
          ],
        },
      },
      [ApplicationStates.COMPLETE]: {
        meta: {
          name: general.applicationName.defaultMessage,
          status: 'completed',
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          onEntry: defineTemplateApi({
            action: TemplateApiActions.submitApplication,
            shouldPersistToExternalData: true,
            externalDataId: 'submitApplication',
            throwOnError: false,
          }),
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
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    return Roles.APPLICANT

    // if (application.assignees.includes(nationalId)) {
    //   return Roles.ASSIGNEE
    // }
    // if (application.applicant === nationalId) {
    //   if (application.state === 'inReview') {
    //     return Roles.ASSIGNEE
    //   }

    //   return Roles.APPLICANT
    // }
  },
}

export default OJOITemplate
