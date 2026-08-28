import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  FormModes,
  UserProfileApi,
  ApplicationConfigurations,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { buildPaymentState } from '@island.is/application/utils'
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import { GetDebtsApi, MockPaymentCatalog } from '../dataProviders'
import { application } from './messages'
import { getSelectedDebts } from '../utils/getSelectedDebts'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PAY_DEBTS,
  name: application.name,
  codeOwner: CodeOwners.Origo,
  institution: application.institutionName,
  translationNamespaces: ApplicationConfigurations.PayDebts.translation,
  dataSchema,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: application.stateMetaNamePrerequisites.defaultMessage,
          progress: 0,
          status: FormModes.DRAFT,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, GetDebtsApi, MockPaymentCatalog],
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
          name: application.stateMetaNameDraft.defaultMessage,
          progress: 0.4,
          status: FormModes.DRAFT,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.PAYMENT,
          },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.FJARSYSLA_RIKISINS,
        // TODO: debt.chargeTypeId is a charge *category* (Gjaldflokkur), not
        // guaranteed to match the FJS catalog's item-level chargeItemCode
        // (Gjaldliður). Blocked on FJS exposing the correct item code (and
        // possibly a debt reference such as payID) before this can be relied
        // on to create a valid charge.
        chargeItems: (application) =>
          getSelectedDebts(application).map((debt) => ({
            code: debt.chargeTypeId,
            amount: debt.amountToPay,
          })),
        submitTarget: States.COMPLETED,
      }),
      [States.COMPLETED]: {
        meta: {
          name: application.stateMetaNameCompleted.defaultMessage,
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
              delete: true,
            },
          ],
        },
      },
    },
  },
  mapUserToRole(
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
