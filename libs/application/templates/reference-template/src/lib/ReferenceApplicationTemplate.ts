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
  NationalRegistryUserApi,
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
} from '../dataProviders'
import { ExampleSchema } from './dataSchema'

const States = {
  prerequisites: 'prerequisites',
  draft: 'draft',
  inReview: 'inReview',
  approved: 'approved',
  rejected: 'rejected',
  waitingToAssign: 'waitingToAssign',
}

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
  const careerHistory = getValueViaPath(
    application.answers,
    'careerHistory',
    undefined,
  ) as string | undefined
  const careerIndustry = getValueViaPath(
    application.answers,
    'careerIndustry',
    undefined,
  ) as string | undefined

  if (careerHistory === 'no') {
    return m.nameApplicationNeverWorkedBefore
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
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.ExampleForm.translation],
  dataSchema: ExampleSchema,
  featureFlag: Features.exampleApplication,
  allowMultipleApplicationsInDraft: true,

  stateMachineConfig: {
    initial: States.prerequisites,
    states: {
      [States.prerequisites]: {
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
                import('../forms/Prerequisites').then((module) =>
                  Promise.resolve(module.Prerequisites),
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
                NationalRegistryUserApi.configure({
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
          SUBMIT: {
            target: States.draft,
          },
        },
      },
      [States.draft]: {
        meta: {
          name: 'Umsókn um ökunám',

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
                import('../forms/ExampleForm').then((module) =>
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
          SUBMIT: [
            {
              target: States.waitingToAssign,
            },
          ],
        },
      },
      [States.waitingToAssign]: {
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
              action: 'getAnotherReferenceData',
              order: 2,
            }),
          ],
          status: 'inprogress',
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/WaitingToAssign').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
              write: 'all',
              delete: true,
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/WaitingToAssign').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          SUBMIT: { target: States.inReview },
          ASSIGN: { target: States.inReview },
          EDIT: { target: States.draft },
        },
      },
      [States.inReview]: {
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
                import('../forms/ReviewApplication').then((val) =>
                  Promise.resolve(val.ReviewApplication),
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
                import('../forms/PendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
            },
          ],
        },
        on: {
          APPROVE: { target: States.approved },
          REJECT: { target: States.rejected },
        },
      },
      [States.approved]: {
        meta: {
          name: 'Approved',
          progress: 1,
          status: 'approved',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.rejected]: {
        meta: {
          name: 'Rejected',
          progress: 1,
          status: 'rejected',
          lifecycle: DefaultStateLifeCycle,

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
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
