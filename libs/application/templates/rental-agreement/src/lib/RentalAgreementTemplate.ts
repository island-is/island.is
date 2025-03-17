import set from 'lodash/set'
import { assign } from 'xstate'
import { pruneAfterDays } from '@island.is/application/core'
import { Features } from '@island.is/feature-flags'
import { AuthDelegationType } from '@island.is/shared/types'
import { CodeOwners } from '@island.is/shared/constants'
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
  defineTemplateApi,
} from '@island.is/application/types'
import { States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '../dataProviders'
import { getAssigneesNationalIdList } from './getAssigneesNationalIdList'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.EDIT }

enum TemplateApiActions {
  sendApplicationSummary = 'sendApplicationSummary',
}

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  codeOwner: CodeOwners.KolibriKotid,
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
          status: 'draft',
          lifecycle: pruneAfterDays(30),
          onExit: defineTemplateApi({
            action: TemplateApiActions.sendApplicationSummary,
          }),
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
            target: States.INREVIEW,
          },
        },
      },
      [States.INREVIEW]: {
        entry: 'assignUsers',
        exit: 'clearAssignees',
        meta: {
          name: 'Summary for review',
          status: 'inprogress',
          lifecycle: pruneAfterDays(30),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/inReviewApplicantForm').then((module) =>
                  Promise.resolve(module.inReviewApplicantForm),
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
                import('../forms/inReviewAssigneesForm').then((module) =>
                  Promise.resolve(module.inReviewAssigneesForm),
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
          status: 'completed',
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
            target: States.INREVIEW,
          },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      assignUsers: assign((context) => {
        const { application } = context
        const assigneesNationalIds = getAssigneesNationalIdList(application)

        if (assigneesNationalIds && assigneesNationalIds.length > 0) {
          set(application, 'assignees', assigneesNationalIds)
        }

        return context
      }),
      clearAssignees: assign((context) => {
        const { application } = context
        set(application, 'assignees', [])
        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant, assignees } = application

    console.log('Assignees: ', assignees)

    if (id === applicant) {
      return Roles.APPLICANT
    }

    if (assignees.includes(id) && id !== applicant) {
      return Roles.ASSIGNEE
    }

    return undefined
  },
}

export default RentalAgreementTemplate
