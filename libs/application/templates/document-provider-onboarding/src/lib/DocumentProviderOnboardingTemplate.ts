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

const contact = z.object({
  name: z.string().nonempty(),
  email: z.string().email().nonempty(),
  phoneNumber: z.string().min(7),
  address: z.string().nonempty(),
  zipCode: z.string().nonempty(),
})

const dataSchema = z.object({
  applicant: contact,
  administrativeContact: contact,
  technicalContactA: contact,
  techincalContactB: contact,
  licensee: contact,
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
          progress: 0.33,
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/DocumentProviderApplication').then((val) =>
                  Promise.resolve(val.ContactInfo),
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
          progress: 0.66,
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
              write: 'all',
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
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/Rejected').then((val) =>
                  Promise.resolve(val.Rejected),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },
      },
      testPhase: {
        meta: {
          name: 'TestPhase',
          roles: [
            {
              id: 'applicant',
              formLoader: () =>
                import('../forms/TestPhase').then((val) =>
                  Promise.resolve(val.TestPhase),
                ),
              read: 'all',
            },
          ],
        },
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
