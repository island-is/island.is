import set from 'lodash/set'
import { assign } from 'xstate'
import { pruneAfterDays } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import {
  Application,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  UserProfileApi,
  ApplicationConfigurations,
  ApplicationRole,
} from '@island.is/application/types'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '../dataProviders'
import { getLandlordsNationalId } from './getLandlordsNationalId'
import { getTenantsNationalId } from './getTenantsByNationalId'

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  name: 'Leigusamningur',
  institution: 'Húsnæðis- og mannvirkjastofnun',
  translationNamespaces: [
    ApplicationConfigurations.RentalAgreement.translation,
  ],
  dataSchema,
  featureFlag: Features.rentalAgreement,
  allowedDelegations: [{ type: AuthDelegationType.GeneralMandate }],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: States.PREREQUISITES,
          progress: 0,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/prerequisitesForm').then((module) =>
                  Promise.resolve(module.PrerequisitesForm),
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
              delete: true,
              api: [
                UserProfileApi,
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DRAFT },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: States.DRAFT,
          progress: 75,
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/draftForm').then((module) =>
                  Promise.resolve(module.draftForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Áfram í yfirlit',
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
              api: [UserProfileApi, NationalRegistryUserApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.SUMMARY,
          },
        },
      },
      [States.SUMMARY]: {
        meta: {
          name: States.SUMMARY,
          progress: 95,
          status: 'inprogress',
          lifecycle: pruneAfterDays(30),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/summaryApplicantForm').then((module) =>
                  Promise.resolve(module.summaryApplicantForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'Áfram í undirritun',
                  type: 'primary',
                },
                {
                  event: DefaultEvents.EDIT,
                  name: 'Breyta umsókn',
                  type: 'signGhost',
                },
              ],
              write: 'all',
              read: 'all',
              delete: true,
              api: [UserProfileApi, NationalRegistryUserApi],
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/summaryAssigneeForm').then((module) =>
                  Promise.resolve(module.summaryAssigneeForm),
                ),
              read: 'all',
              api: [UserProfileApi],
            },
          ],
        },
        on: {
          [DefaultEvents.EDIT]: {
            target: States.DRAFT,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.SIGNING,
          },
        },
      },
      [States.SIGNING]: {
        meta: {
          name: States.SIGNING,
          progress: 100,
          status: 'inprogress',
          lifecycle: pruneAfterDays(30),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/signingForm').then((module) =>
                  Promise.resolve(module.SigningForm),
                ),
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.SIGNING,
          },
          [DefaultEvents.EDIT]: {
            target: States.SUMMARY,
          },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignUsers: assign((context) => {
        const { application } = context

        const LandlordsNationalId = getLandlordsNationalId(application)
        const TenantsNationalId = getTenantsNationalId(application)

        const assigneeIds = [
          ...(LandlordsNationalId || []),
          ...(TenantsNationalId || []),
        ]

        console.log('AssigneeIds', assigneeIds)

        if (assigneeIds && assigneeIds.length > 0) {
          set(application, 'assignees', [assigneeIds])
        }

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant, assignees } = application

    console.log('Assignees', assignees)

    if (id === applicant) {
      return Roles.APPLICANT
    }

    if (assignees.includes(id)) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default RentalAgreementTemplate
