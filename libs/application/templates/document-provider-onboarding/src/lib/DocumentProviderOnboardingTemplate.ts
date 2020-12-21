import {
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTypes,
  ApplicationTemplate,
  Application,
} from '@island.is/application/core'
import { assign } from 'xstate'
import * as z from 'zod'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

const contact = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phoneNumber: z.string().min(7),
})

const helpDeskContact = z.object({
  email: z.string().email().nonempty(),
  phoneNumber: z.string().min(7),
})

//TODO: extend contact. Couldn't get it to work easily with contact.extend
const applicant = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phoneNumber: z.string().min(7),
  nationalId: z.string().refine((x) => (x ? nationalIdRegex.test(x) : false), {
    message: 'Skrá þarf löglega kennitölu, með eða án bandstriks', //Question: how should error messages be translated?
  }),
  address: z.string().nonempty(),
  zipCode: z.string().nonempty(),
})

const termsOfAgreement = z.object({
  userTerms: z.boolean().refine((v) => v, {
    //When to show these ?
    message: 'Þú verður að samþykkja notendaskilmála',
  }),
  securityTerms: z.boolean().refine((v) => v, {
    //When to show these ?
    message: 'Þú verður að samþykkja öryggisskilmála ',
  }),
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
    initial: 'draft',
    states: {
      draft: {
        meta: {
          name: 'Umsókn skjalaveitu',
          progress: 0.25,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/DocumentProviderApplication').then((val) =>
                  Promise.resolve(val.DocumentProviderOnboarding),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          SUBMIT: {
            target: 'inReview',
          },
        },
      },
      inReview: {
        entry: assign((context) => {
          return {
            ...context,
            application: {
              ...context.application,
              assignees: ['2311637949'],
            },
          }
        }),
        meta: {
          name: 'In Review',
          progress: 0.5,
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
          APPROVE: { target: 'testPhase' },
          REJECT: { target: 'rejected' },
        },
      },
      rejected: {
        meta: {
          name: 'Rejected',
          progress: 1,
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
      testPhase: {
        meta: {
          name: 'TestPhase',
          progress: 0.75,
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
          SUBMIT: {
            target: 'finished',
          },
        },
      },
      finished: {
        meta: {
          name: 'Finished',
          progress: 1,
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
        type: 'final' as const,
      },
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    //This logic makes it so the application is not accessible to anybody but involved parties
    //TODO: add this to second if statement
    //&& application.assignees.includes('2311637949')

    //This if statement might change depending on the "umboðskerfi"
    if (id === application.applicant) {
      return Roles.APPLICANT
    }
    if (
      application.state === 'inReview' &&
      application.assignees.includes('2311637949')
    ) {
      return Roles.ASSIGNEE
    }
    //Returns nothing if user is not same as applicant nor is part of the assignes
    return undefined
  },
}

export default DocumentProviderOnboardingTemplate
