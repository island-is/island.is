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
  defineTemplateApi,
} from '@island.is/application/types'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import { assign } from 'xstate'
import * as m from './messages'
import { NationalRegistryApi, rentalAgreementsApi } from '../dataProviders'
import { Events, Roles, States, TemplateApiActions } from '../types'
import { Contract } from '@island.is/clients/hms-rental-agreement'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope, HmsScope } from '@island.is/auth/scopes'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.TERMINATE_RENTAL_AGREEMENT,
  name: m.miscMessages.applicationName,
  codeOwner: CodeOwners.NordaApplications,
  institution: 'Húsnæðis og mannvirkjastofnun',
  featureFlag: Features.TerminateRentalAgreementEnabled,
  translationNamespaces: [
    ApplicationConfigurations.TerminateRentalAgreement.translation,
  ],
  dataSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.GeneralMandate,
    },
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  requiredScopes: [HmsScope.properties, ApiScope.hms],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
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
              api: [UserProfileApi, NationalRegistryApi, rentalAgreementsApi],
              delete: true,
            },
            {
              id: Roles.NOCONTRACTS,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.Prerequisites),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, NationalRegistryApi, rentalAgreementsApi],
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
          name: 'Main form',
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
            {
              id: Roles.NOCONTRACTS,
              formLoader: () =>
                import('../forms/noContractsForm').then((module) =>
                  Promise.resolve(module.noContractsForm),
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
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          onEntry: [
            defineTemplateApi({
              action: TemplateApiActions.submitApplication,
            }),
          ],
          actionCard: {
            tag: {
              label: m.miscMessages.actionCardDone,
            },
            pendingAction(application) {
              return {
                displayStatus: 'success',
                title:
                  getValueViaPath<string>(
                    application.answers,
                    'terminationType.answer',
                  ) === 'cancelation'
                    ? m.miscMessages.actioncardDoneTitleCancelation
                    : m.miscMessages.actioncardDoneTitleTermination,
              }
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
            },
            {
              // This state is set for development purposes, shouldn't be reachable on prod
              id: Roles.NOCONTRACTS,
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
  mapUserToRole: (
    _nationalId: string,
    application: Application,
  ): ApplicationRole | undefined => {
    const contracts = getValueViaPath<Array<Contract>>(
      application.externalData,
      'getRentalAgreements.data',
    )
    if (contracts?.length === 0) {
      return Roles.NOCONTRACTS
    }

    return Roles.APPLICANT
  },
}

export default template
