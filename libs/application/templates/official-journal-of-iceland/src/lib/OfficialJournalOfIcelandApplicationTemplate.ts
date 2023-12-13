import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { OfficalJournalOfIcelandSchema } from './dataSchema'
import { m } from './messages'

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
import { OfficialJournalOfIcelandTemplateApi } from '../dataProviders'
import { TemplateApiActions } from '../shared'
import { hasApprovedExternalData } from '../utils/hasApprovedExternalData'

export enum ApplicationStates {
  PREREQUISITS = 'prerequisites',
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

const OfficalJournalOfIcelandApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND,
  name: m.applicationName,
  institution: m.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.OfficialJournalOfIceland.translation,
  ],
  dataSchema: OfficalJournalOfIcelandSchema,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUISITS,
    states: {
      [ApplicationStates.PREREQUISITS]: {
        meta: {
          name: 'Umsókn um stjórnartíðindi',
          status: 'draft',
          progress: 0.25,
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
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: ApplicationStates.DRAFT,
              cond: hasApprovedExternalData,
            },
            {
              target: ApplicationStates.PREREQUISITS,
            },
          ],
        },
      },
      [ApplicationStates.DRAFT]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.getCaseData,
            shouldPersistToExternalData: true,
            externalDataId: 'caseData',
            throwOnError: false,
          }),
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
              api: [OfficialJournalOfIcelandTemplateApi],
            },
          ],
        },
        on: {
          SUBMIT: ApplicationStates.COMPLETE,
        },
      },
      [ApplicationStates.COMPLETE]: {
        meta: {
          name: '',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          status: 'approved',
          roles: [
            {
              id: Roles.APPLICANT,
              delete: true,
              read: 'all',
              write: 'all',
              formLoader: () =>
                import('../forms/Complete').then((val) =>
                  Promise.resolve(val.Complete),
                ),
            },
          ],
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
