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
import { Events, Roles, States } from '../utils/constants'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
} from '@island.is/application/core'
import { assign } from 'xstate'
import { NationalRegistryApi, propertiesApi } from '../dataProviders'
import { buildPaymentState } from '@island.is/application/utils'
import { InstitutionNationalIds } from '@island.is/application/types'
import * as m from '../lib/messages'
import { TemplateApiActions } from '../types'
import { getChargeItems } from '../utils/paymentUtils'
import { Features } from '@island.is/feature-flags'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.FIRE_COMPENSATION_APPRAISAL,
  name: m.miscMessages.applicationName,
  codeOwner: CodeOwners.NordaApplications,
  institution: m.miscMessages.institutionName,
  featureFlag: Features.fireCompensationAppraisalEnabled,
  translationNamespaces: [
    ApplicationConfigurations.FireCompensationAppraisal.translation,
  ],
  dataSchema,
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
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Staðfesta',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [UserProfileApi, NationalRegistryApi, propertiesApi],
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
          onEntry: [
            defineTemplateApi({
              action: TemplateApiActions.calculateAmount,
              order: 1,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/mainForm').then((module) =>
                  Promise.resolve(module.MainForm),
                ),
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.overviewMessages.pay,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.PAYMENT]: {
            target: States.PAYMENT,
          },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
        chargeItems: getChargeItems,
      }),
      [States.DONE]: {
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
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completedForm').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
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
    _application: Application,
  ): ApplicationRole | undefined => {
    return Roles.APPLICANT
  },
}

export default template
