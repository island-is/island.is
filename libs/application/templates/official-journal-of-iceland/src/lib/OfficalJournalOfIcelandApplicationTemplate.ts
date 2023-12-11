import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
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
  defineTemplateApi,
} from '@island.is/application/types'
import { hasApprovedExternalData } from '../utils/hasApprovedExternalData'
import { TEMPLATE_API_ACTIONS } from '../shared'
import { OfficialJournalOfIcelandTemplateApi } from '../dataProviders'

export enum ApplicationStates {
  DRAFT = 'draft',
  DATA_GATHERING = 'data_gathering',
  COMPLETE = 'complete',
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
  type: ApplicationTypes.OFFICIAL_JOURNAL_OF_ICELAND,
  name: m.applicationName,
  institution: m.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.OfficialJournalOfIceland.translation,
  ],
  dataSchema: OfficalJournalOfIcelandSchema,
  allowMultipleApplicationsInDraft: true,
  stateMachineConfig: {
    initial: ApplicationStates.DRAFT,
    states: {
      [ApplicationStates.DRAFT]: {
        meta: {
          name: 'Umsókn um stjórnartíðindi',
          status: 'draft',
          progress: 0.33,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: true,
              formLoader: () =>
                import('../forms/Prerequisites').then((val) =>
                  Promise.resolve(val.PrerequsitesForm),
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
              target: ApplicationStates.DATA_GATHERING,
              cond: hasApprovedExternalData,
            },
            {
              target: ApplicationStates.DRAFT,
            },
          ],
        },
      },
      [ApplicationStates.DATA_GATHERING]: {
        meta: {
          name: '',
          status: 'draft',
          progress: 0.66,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TEMPLATE_API_ACTIONS.getPreviousTemplates,
            shouldPersistToExternalData: true,
            externalDataId: 'previousTemplates',
            throwOnError: false,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              read: 'all',
              write: 'all',
              delete: true,
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
              read: 'all',
              formLoader: () =>
                import('../forms/Complete').then((val) =>
                  Promise.resolve(val.CompleteForm),
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
