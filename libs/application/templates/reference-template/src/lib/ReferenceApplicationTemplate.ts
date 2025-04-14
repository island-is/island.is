/*
 ***
 *** The state machine is for this template is as follows:
 ***
 ***                                                               /--> Approved
 *** Prerequisites --> Draft --> Waiting to assign --> In review --
 ***                    Λ             |                            \--> Rejected
 ***                    |_____________|
 ***
 */

import {
  DefaultStateLifeCycle,
  getValueViaPath,
  coreHistoryMessages,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationConfigurations,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  UserProfileApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'

import { m } from './messages'
import { assign } from 'xstate'
import { ApiActions } from '../shared'
import {
  ReferenceDataApi,
  EphemeralApi,
  MyMockProvider,
  NationalRegistryApi,
} from '../dataProviders'
import { dataSchema } from './dataSchema'
import { States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'

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

const determineMessageFromApplicationAnswers = (application: Application) => {
  const careerHistory = getValueViaPath<string>(
    application.answers,
    'careerHistory',
    undefined,
  )
  const careerIndustry = getValueViaPath<string>(
    application.answers,
    'careerIndustry',
    undefined,
  )

  if (careerHistory === 'no') {
    return 'abcdef'
  }
  if (careerIndustry) {
    return {
      name: m.nameApplicationWithValue,
      value: `- ${careerIndustry}`,
    }
  }
  return m.name
}

const ReferenceApplicationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<ReferenceTemplateEvent>,
  ReferenceTemplateEvent
> = {
  type: ApplicationTypes.EXAMPLE,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.NordaApplications,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: dataSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,

  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: 'draft',
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            // Applications that stay in this state for 24 hours will be pruned automatically
            whenToPrune: 24 * 3600 * 1000,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm/prerequisitesForm').then(
                  (module) => Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [
                ReferenceDataApi.configure({
                  params: {
                    id: 1986,
                  },
                }),
                NationalRegistryApi.configure({
                  params: {
                    ageToValidate: 18,
                  },
                }),
                UserProfileApi,
                MyMockProvider,
                EphemeralApi,
              ],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: 'Dæmi um umsókn',
          actionCard: {
            description: m.draftDescription,
            historyLogs: {
              onEvent: DefaultEvents.SUBMIT,
              logMessage: coreHistoryMessages.applicationSent,
            },
          },
          progress: 0.25,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/exampleForm').then((module) =>
                  Promise.resolve(module.ExampleForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: [
            {
              target: States.WAITINGTOASSIGN,
            },
          ],
        },
      },
      [States.WAITINGTOASSIGN]: {
        meta: {
          name: 'Waiting to assign',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: 'Skráning yfirferðaraðila',
              content:
                'Umsóknin bíður nú þess að yfirferðaraðili sé skráður á umsóknina. Þú getur líka skráð þig sjálfur inn og farið yfir umsóknina.',
              displayStatus: 'warning',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationAssigned,
              },
            ],
          },
          onEntry: [
            defineTemplateApi({
              action: ApiActions.createApplication,
              order: 1,
            }),
            defineTemplateApi({
              action: ApiActions.getAnotherReferenceData,
              order: 2,
            }),
          ],
          status: 'inprogress',
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/waitingToAssignForm/waitingToAssignForm').then(
                  (val) => Promise.resolve(val.PendingReview),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/waitingToAssignForm/waitingToAssignForm').then(
                  (val) => Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.INREVIEW },
          [DefaultEvents.ASSIGN]: { target: States.INREVIEW },
          [DefaultEvents.EDIT]: { target: States.DRAFT },
        },
      },
      [States.INREVIEW]: {
        meta: {
          name: 'In Review',
          progress: 0.75,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            pendingAction: {
              title: 'Verið er að fara yfir umsóknina',
              content:
                'Example stofnun fer núna yfir umsóknina og því getur þetta tekið nokkra daga',
              displayStatus: 'info',
            },
            historyLogs: [
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: coreHistoryMessages.applicationApproved,
              },
            ],
          },
          onExit: [
            defineTemplateApi({
              action: ApiActions.completeApplication,
            }),
          ],
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/reviewApplicationForm/reviewApplication').then(
                  (val) => Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                { event: 'APPROVE', name: 'Samþykkja', type: 'primary' },
                { event: 'REJECT', name: 'Hafna', type: 'reject' },
              ],
              write: {
                answers: ['careerHistoryDetails', 'approvedByReviewer'],
              },
              read: 'all',
              shouldBeListedForRole: true,
            },
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/pendingReviewForm/pendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: { target: States.APPROVED },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.APPROVED]: {
        meta: {
          name: 'Approved',
          progress: 1,
          status: 'approved',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/approvedForm/approvedForm').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Rejected',
          progress: 1,
          status: 'rejected',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/rejectedForm/rejectedForm').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
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

export default ReferenceApplicationTemplate
