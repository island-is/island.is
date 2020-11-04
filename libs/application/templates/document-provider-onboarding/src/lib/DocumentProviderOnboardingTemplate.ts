import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
} from '@island.is/application/core'
import * as z from 'zod'

type Events =
  | { type: 'APPROVE' }
  | { type: 'REJECT' }
  | { type: 'SUBMIT' }
  | { type: 'ABORT' }

const nationalIdRegex = /([0-9]){6}-?([0-9]){4}/

const contact = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phoneNumber: z.string().min(7),
})

const helpDeskContact = z.object({
  email: z.string().email().nonempty(),
  phoneNumber: z.string().min(7),
  chatbot: z.string(),
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

const dataSchema = z.object({
  applicant: applicant,
  administrativeContact: contact,
  technicalContact: contact,
  helpDesk: helpDeskContact,
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
  dataProviders: [],
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
              id: 'applicant',
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
        meta: {
          name: 'In Review',
          progress: 0.5,
          roles: [
            {
              id: 'reviewer',
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
              id: 'applicant',
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
              id: 'applicant',
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
              id: 'applicant',
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
              id: 'applicant',
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
  mapUserToRole(id: string, state: string): ApplicationRole {
    if (state === 'inReview') {
      return 'reviewer'
    }
    return 'applicant'
  },
}

export default DocumentProviderOnboardingTemplate
