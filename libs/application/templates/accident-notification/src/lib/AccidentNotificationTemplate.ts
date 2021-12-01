import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  getValueViaPath,
} from '@island.is/application/core'
import set from 'lodash/set'
import { assign } from 'xstate'
import { AccidentTypeEnum, ReviewApprovalEnum } from '..'
// import * as z from 'zod'
import { States } from '../constants'
import { ApiActions } from '../shared'
import { WhoIsTheNotificationForEnum } from '../types'
import { AccidentNotificationSchema } from './dataSchema'
import { application } from './messages'

// Uncomment for empty data schema
// const AccidentNotificationSchema = z.object({})

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

type AccidentNotificationEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ASSIGN }

const AccidentNotificationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<AccidentNotificationEvent>,
  AccidentNotificationEvent
> = {
  type: ApplicationTypes.ACCIDENT_NOTIFICATION,
  name: application.general.name,
  institution: application.general.institutionName,
  readyForProduction: true,
  translationNamespaces: [
    ApplicationConfigurations.AccidentNotification.translation,
  ],
  dataSchema: AccidentNotificationSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 0.2,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/AccidentNotificationForm/index').then((val) =>
                  Promise.resolve(val.AccidentNotificationForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW,
          },
        },
      },
      [States.REVIEW]: {
        entry: 'assignUser',
        meta: {
          name: States.REVIEW,
          progress: 0.6,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.ApplicantReview),
                ),
              read: 'all',
              write: 'all',
              actions: [
                { event: 'APPROVE', name: 'Samþykki', type: 'primary' },
              ],
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.AssigneeReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },

        on: {
          [DefaultEvents.ASSIGN]: {
            target: States.REVIEW,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW_ADD_ATTACHMENT,
          },
          [DefaultEvents.REJECT]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'rejectApplication',
          },
          [DefaultEvents.APPROVE]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'approveApplication',
          },
        },
      },
      [States.REVIEW_ADD_ATTACHMENT]: {
        meta: {
          name: States.REVIEW_ADD_ATTACHMENT,
          progress: 0.6,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          onEntry: {
            apiModuleAction: ApiActions.addAttachment,
          },

          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.ApplicantReview),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.AssigneeReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },

        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW_ADD_ATTACHMENT,
            actions: 'attachments',
          },
          [DefaultEvents.REJECT]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'rejectApplication',
          },
          [DefaultEvents.APPROVE]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'approveApplication',
          },
        },
      },
      // State when assignee has approved or reject the appliction
      [States.IN_FINAL_REVIEW]: {
        meta: {
          name: States.IN_FINAL_REVIEW,
          progress: 1,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          onEntry: {
            apiModuleAction: ApiActions.reviewApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.ApplicantReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.AssigneeReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW_ADD_ATTACHMENT,
          },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      attachments: assign((context) => {
        return context
      }),
      approveApplication: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'reviewApproval', ReviewApprovalEnum.APPROVED)

        return context
      }),
      rejectApplication: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'reviewApproval', ReviewApprovalEnum.REJECTED)

        return context
      }),
      assignUser: assign((context) => {
        const { application } = context

        const assigneeId = getNationalIdOfReviewer(application)
        if (assigneeId) {
          set(application, 'assignees', [assigneeId])
        }

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (id === application.applicant && application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    if (id === application.applicant) {
      return Roles.APPLICANT
    }

    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    return undefined
  },
}

export default AccidentNotificationTemplate

const getNationalIdOfReviewer = (application: Application) => {
  try {
    const accidentType = getValueViaPath(
      application.answers,
      'accidentType',
    ) as AccidentTypeEnum
    const whoIsTheNotificationFor = getValueViaPath(
      application.answers,
      'whoIsTheNotificationFor.answer',
    )
    if (accidentType === AccidentTypeEnum.HOMEACTIVITIES) {
      return null
    }
    // In this case the Assignee in the review process is the injured Person
    if (
      whoIsTheNotificationFor === WhoIsTheNotificationForEnum.JURIDICALPERSON
    ) {
      return getValueViaPath(
        application.answers,
        'injuredPersonInformation.nationalId',
      )
    }

    // In Every other case the Representative is the Assignee in the review Process
    return getValueViaPath(application.answers, 'representative.nationalId')
  } catch (error) {
    console.log(error)
    return 0
  }
}
