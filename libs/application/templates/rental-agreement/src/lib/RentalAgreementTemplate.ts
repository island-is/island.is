import set from 'lodash/set'
import { assign } from 'xstate'
import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
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
  InstitutionNationalIds,
} from '@island.is/application/types'
import { Events } from '../utils/types'
import { States, Roles } from '../utils/enums'
import { getAssigneesNationalIdList } from '../utils/getAssigneesNationalIdList'
import {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
} from '../dataProviders'
import { dataSchema } from './dataSchema'
import { application } from './messages'

enum TemplateApiActions {
  submitApplicationToHmsRentalService = 'submitApplicationToHmsRentalService',
  consumerIndex = 'consumerIndex',
}

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  codeOwner: CodeOwners.NordaApplications,
  name: application.name,
  institution: application.institutionName,
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
          lifecycle: EphemeralStateLifeCycle,
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
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: TemplateApiActions.consumerIndex,
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
                  name: application.goToOverviewButton,
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
          name: States.INREVIEW,
          status: 'inprogress',
          lifecycle: pruneAfterDays(10),
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
                  name: application.goToSigningButton,
                  type: 'primary',
                },
                {
                  event: DefaultEvents.EDIT,
                  name: application.backToOverviewButton,
                  type: 'signGhost',
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
          [DefaultEvents.EDIT]: {
            target: States.DRAFT,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.SIGNING,
          },
        },
      },
      [States.SIGNING]: {
        entry: 'assignToInstitution',
        exit: 'clearAssignees',
        meta: {
          name: States.SIGNING,
          status: 'inprogress',
          lifecycle: pruneAfterDays(10),
          onEntry: defineTemplateApi({
            action: TemplateApiActions.submitApplicationToHmsRentalService,
          }),
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
            {
              id: Roles.INSTITUTION,
              write: 'all',
              read: 'all',
              delete: true,
              actions: [
                {
                  event: DefaultEvents.APPROVE,
                  name: application.approve,
                  type: 'primary',
                },
              ],
            },
          ],
        },
        on: {
          [DefaultEvents.APPROVE]: {
            target: States.COMPLETED,
          },
        },
      },
      [States.COMPLETED]: {
        meta: {
          name: States.COMPLETED,
          status: 'completed',
          lifecycle: DefaultStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/completed').then((module) =>
                  Promise.resolve(module.completedForm),
                ),
              read: 'all',
            },
            {
              id: Roles.INSTITUTION,
              write: 'all',
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
      assignUsers: assign((context) => {
        const { application } = context
        const assigneesNationalIds = getAssigneesNationalIdList(application)

        if (assigneesNationalIds && assigneesNationalIds.length > 0) {
          set(application, 'assignees', assigneesNationalIds)
        }

        return context
      }),
      assignToInstitution: assign((context) => {
        const { application } = context

        set(application, 'assignees', [
          InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
        ])

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

    if (id === InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN) {
      return Roles.INSTITUTION
    }

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
