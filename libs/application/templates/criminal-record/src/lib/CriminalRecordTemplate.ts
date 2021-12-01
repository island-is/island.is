import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  DefaultStateLifeCycle,
  ApplicationConfigurations,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import * as z from 'zod'
import { ApiActions } from '../shared'
import { m } from './messages'

const CriminalRecordSchema = z.object({
  approveExternalData: z.boolean().refine((v) => v),
})

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.CRIMINAL_RECORD,
  name: m.name,
  institution: m.institutionName,
  translationNamespaces: [ApplicationConfigurations.CriminalRecord.translation],
  dataSchema: CriminalRecordSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: 'Umsókn um sakavottorð',
          actionCard: {
            tag: {
              label: m.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
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
                import('../forms/CriminalRecordForm').then((module) =>
                  Promise.resolve(module.CriminalRecordForm),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: {
            target: States.PAYMENT,
          },
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Greiðsla',
          actionCard: {
            tag: {
              label: m.actionCardPayment,
              variant: 'red',
            },
          },
          progress: 0.8,
          lifecycle: DefaultStateLifeCycle,
          //TODO-origo
          // lifecycle: {
          //   shouldBeListed: true,
          //   shouldBePruned: true,
          //   // Applications that stay in this state for 24 hours will be pruned automatically
          //   whenToPrune: 24 * 3600 * 1000,
          // },
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          onExit: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Payment').then((val) => val.Payment),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Áfram', type: 'primary' },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.COMPLETED },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          //TODO-origo
          // lifecycle: {
          //   shouldBeListed: true,
          //   shouldBePruned: true,
          //   // Applications that stay in this state for 24 hours will be pruned automatically
          //   whenToPrune: 24 * 3600 * 1000,
          // },
          actionCard: {
            tag: {
              label: m.actionCardDone,
              variant: 'blueberry',
            },
          },
          onEntry: {
            apiModuleAction: ApiActions.getCriminalRecord,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Approved').then((val) =>
                  Promise.resolve(val.Approved),
                ),
              read: 'all',
            },
            {
              id: Roles.APPLICANT_EXPIRED,
              formLoader: () =>
                import('../forms/ApprovedExpired').then((val) =>
                  Promise.resolve(val.ApprovedExpired),
                ),
              read: 'all',
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
    // Check is application is expired (happens after 24 hours), in which case
    // we will hide the 'View PDF' button
    const oneDayAgo = new Date()
    oneDayAgo.setHours(oneDayAgo.getHours() - 24)
    const isExpired = new Date(application.modified) < oneDayAgo

    if (application.state === States.COMPLETED && isExpired) {
      return Roles.APPLICANT_EXPIRED
    } else {
      return Roles.APPLICANT
    }
  },
}

export default template
