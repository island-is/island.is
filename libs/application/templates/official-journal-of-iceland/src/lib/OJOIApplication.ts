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
import { isApplicationValid } from './utils'

export enum ApplicationStates {
  PREREQUISITS = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
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
    initial: ApplicationStates.PREREQUISITS,
    states: {
      [ApplicationStates.PREREQUISITS]: {
        meta: {
          name: 'Umsókn um stjórnartíðindi',
          status: 'draft',
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: true,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.Prerequsites),
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
          name: '',
          status: 'draft',
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
          // onExit -> validate
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
              cond: isApplicationValid,
            },
            {
              target: ApplicationStates.DRAFT,
            },
          ],
        },
      },
      [ApplicationStates.COMPLETE]: {
        meta: {
          name: '',
          status: 'completed',
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          onEntry: defineTemplateApi({
            action: TemplateApiActions.submitApplication,
            shouldPersistToExternalData: true,
            externalDataId: 'submitApplication',
            throwOnError: true,
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
