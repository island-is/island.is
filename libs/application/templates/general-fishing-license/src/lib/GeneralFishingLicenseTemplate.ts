import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
} from '@island.is/application/core'
import { Events, States, Roles } from '../constants'
import { GeneralFishingLicenseSchema } from './dataSchema'
import { application } from './messages'
import { ApiActions } from '../shared'

const pruneAtMidnight = () => {
  const date = new Date()
  const utcDate = new Date(date.toUTCString()) // In case user is not on GMT
  const timeToPrune = utcDate.getTime() - 8492400

  console.log(date, utcDate, date.getTime(), timeToPrune)
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: 3600 * 1000,
  }
}

const GeneralFishingLicenseTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.GENERAL_FISHING_LICENSE,
  name: application.general.name,
  institution: application.general.institutionName,
  readyForProduction: false,
  translationNamespaces: [
    ApplicationConfigurations.GeneralFishingLicense.translation,
  ],
  dataSchema: GeneralFishingLicenseSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 0.3,
          lifecycle: pruneAtMidnight(),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () =>
                await import(
                  '../forms/GeneralFishingLicenseForm/index'
                ).then((val) => Promise.resolve(val.GeneralFishingLicenseForm)),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: { target: States.PAYMENT },
          [DefaultEvents.REJECT]: {
            target: States.DECLINED,
          },
        },
      },
      [States.PAYMENT]: {
        meta: {
          name: 'Payment state',
          actionCard: {
            description: application.labels.actionCardPayment,
          },
          progress: 0.9,
          lifecycle: pruneAtMidnight(),
          onEntry: {
            apiModuleAction: ApiActions.createCharge,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/GeneralFishingLicensePaymentForm').then(
                  (val) => val.GeneralFishingLicensePaymentForm,
                ),
              actions: [
                { event: DefaultEvents.SUBMIT, name: 'Panta', type: 'primary' },
                {
                  event: DefaultEvents.ABORT,
                  name: 'Hætta við',
                  type: 'reject',
                },
              ],
              write: 'all',
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.SUBMITTED },
          [DefaultEvents.ABORT]: { target: States.DRAFT },
        },
      },
      [States.SUBMITTED]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 1,
          // Application is only suppose to live for an hour while building it, change later
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 3600 * 1000,
          },
          onEntry: {
            apiModuleAction: ApiActions.submitApplication,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import(
                  '../forms/GeneralFishingLicenseSubmittedForm'
                ).then((val) =>
                  Promise.resolve(val.GeneralFishingLicenseSubmittedForm),
                ),
              read: 'all',
            },
          ],
        },
        type: 'final' as const,
      },
      [States.DECLINED]: {
        meta: {
          name: 'Declined',
          progress: 1,
          lifecycle: pruneAtMidnight(),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/GeneralFishingLicenseDeclinedForm').then(
                  (val) => val.GeneralFishingLicenseDeclinedForm,
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
    if (id === application.applicant) {
      return Roles.APPLICANT
    }

    return undefined
  },
}

export default GeneralFishingLicenseTemplate
