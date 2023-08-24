import { assign } from 'xstate'
import { z } from 'zod'
import * as kennitala from 'kennitala'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { DefaultStateLifeCycle } from '@island.is/application/core'
import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
  DefaultEvents,
  defineTemplateApi,
} from '@island.is/application/types'
import { API_MODULE_ACTIONS } from '../../constants'

type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ABORT }
  | { type: DefaultEvents.EDIT }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}
enum States {
  DRAFT = 'draft',
  REVIEWER_WAITING_TO_ASSIGN = 'reviewerWaitingToAssign',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
  TEST_PHASE = 'testPhase',
  REJECTED = 'rejected',
  FINISHED = 'finished',
}

const contact = z.object({
  name: z.string().nonempty({ message: 'Nafn þarf að vera útfyllt' }),
  email: z.string().email({ message: 'Netfang þarf að vera gilt' }),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { message: 'Símanúmerið þarf að vera gilt' },
  ),
})

const helpDeskContact = z.object({
  email: z.string().email({ message: 'Netfang þarf að vera gilt' }),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { message: 'Símanúmer þarf að vera gilt' },
  ),
})

//TODO: extend contact. Couldn't get it to work easily with contact.extend
const applicant = z.object({
  name: z.string().nonempty({ message: 'Nafn þarf að vera útfyllt' }),
  email: z.string().email({ message: 'Netfang þarf að vera gilt' }),
  phoneNumber: z.string().refine(
    (p) => {
      const phoneNumber = parsePhoneNumberFromString(p, 'IS')
      return phoneNumber && phoneNumber.isValid()
    },
    { message: 'Símanúmer þarf að vera gilt' },
  ),
  nationalId: z.string().refine((k) => kennitala.isValid(k), {
    message: 'Skrá þarf löglega kennitölu, með eða án bandstriks',
  }),
  // .refine((k) => kennitala.isCompany(k), {
  //   message: 'Skrá þarf kennitölu fyrirtækis eða stofnunar',
  // }),
})

const termsOfAgreement = z.object({
  userTerms: z.boolean().refine((v) => v, {}),
})

const endPoint = z.object({
  endPoint: z.string().url().nonempty(),
  endPointExists: z.string().nonempty({
    message: 'Þú verður að vista endapunkt til að halda áfram',
  }),
})

const productionEndPoint = z.object({
  prodEndPoint: z.string().url().nonempty(),
  prodEndPointExists: z.string().nonempty({
    message: 'Þú verður að vista endapunkt til að halda áfram',
  }),
})

const dataSchema = z.object({
  termsOfAgreement: termsOfAgreement,
  applicant: applicant,
  administrativeContact: contact,
  technicalContact: contact,
  helpDesk: helpDeskContact,
  technicalAnswer: z.boolean().refine((v) => v, {
    message: 'Þú verður að samþykkja að forritun og prófunum sé lokið',
  }),
  endPointObject: endPoint,
  testProviderId: z.string().nonempty({
    message: 'Þú verður að stofna aðgang til að halda áfram',
  }),
  prodProviderId: z.string().nonempty({
    message: 'Þú verður að stofna aðgang til að halda áfram',
  }),
  productionEndPointObject: productionEndPoint,
  rejectionReason: z.string(),
  approvedByReviewer: z.enum(['APPROVE', 'REJECT']),
})

const DocumentProviderOnboardingTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Umsókn um að gerast skjalaveitandi',
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn skjalaveitu',
          progress: 0.25,
          status: 'draft',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DocumentProviderApplication').then((val) =>
                  Promise.resolve(val.DocumentProviderOnboarding),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Submit',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEWER_WAITING_TO_ASSIGN,
          },
        },
      },
      [States.REVIEWER_WAITING_TO_ASSIGN]: {
        meta: {
          name: 'Waiting to assign reviewer',
          progress: 0.4,
          status: 'inprogress',
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: API_MODULE_ACTIONS.assignReviewer,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PendingReview').then((val) =>
                  Promise.resolve(val.PendingReview),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.ASSIGN]: { target: States.IN_REVIEW },
        },
      },
      [States.IN_REVIEW]: {
        exit: 'clearAssignees',
        meta: {
          name: States.IN_REVIEW,
          status: 'inprogress',
          progress: 0.5,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/ReviewApplication').then((val) =>
                  Promise.resolve(val.ReviewApplication),
                ),
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: 'Samþykkja',
                  type: 'primary',
                },
                { event: DefaultEvents.REJECT, name: 'Hafna', type: 'reject' },
              ],
              read: 'all',
              write: { answers: ['rejectionReason'] },
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
          [DefaultEvents.APPROVE]: { target: States.TEST_PHASE },
          [DefaultEvents.REJECT]: { target: States.REJECTED },
        },
      },
      [States.REJECTED]: {
        meta: {
          name: 'Rejected',
          status: 'rejected',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: API_MODULE_ACTIONS.applicationRejected,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
              read: 'all',
            },
          ],
        },
      },
      [States.TEST_PHASE]: {
        meta: {
          name: 'TestPhase',
          status: 'inprogress',
          progress: 0.75,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: API_MODULE_ACTIONS.applicationApproved,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/TestPhase').then((val) =>
                  Promise.resolve(val.TestPhase),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: [States.FINISHED],
          },
        },
      },
      [States.FINISHED]: {
        meta: {
          status: 'completed',
          name: 'Finished',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Finished').then((val) =>
                  Promise.resolve(val.Finished),
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
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    //This logic makes it so the application is not accessible to anybody but involved parties

    // This if statement might change depending on the "umboðskerfi"
    if (
      process.env.NODE_ENV === 'development' &&
      application.state === 'inReview'
    ) {
      return Roles.ASSIGNEE
    }
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (application.assignees.includes(id)) {
      return Roles.ASSIGNEE
    }
    //Returns nothing if user is not same as applicant nor is part of the assignes
    return undefined
  },
}

export default DocumentProviderOnboardingTemplate
