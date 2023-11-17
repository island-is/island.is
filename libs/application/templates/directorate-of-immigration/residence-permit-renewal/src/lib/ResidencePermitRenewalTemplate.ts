import {
  ApplicationConfigurations,
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  Application,
  DefaultEvents,
  defineTemplateApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  EphemeralStateLifeCycle,
  pruneAfterDays,
} from '@island.is/application/core'
import { Events, States, Roles } from './constants'
import { application as applicationMessage } from './messages'
import { Features } from '@island.is/feature-flags'
import { ApiActions } from '../shared'
import { ResidencePermitRenewalSchema } from './dataSchema'
import {
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
  NationalRegistryMaritalTitleApi,
  ChildrenCustodyInformationApi,
  UserProfileApi,
  UtlendingastofnunPaymentCatalogApi,
  CountriesApi,
  TravelDocumentTypesApi,
  ApplicantCurrentResidencePermitApi,
  ChildrenCurrentResidencePermitApi,
  ApplicantCurrentResidencePermitTypeApi,
  OldStayAbroadListApi,
  OldCriminalRecordListApi,
  OldStudyItemApi,
  OldPassportItemApi,
  OldAgentItemApi,
} from '../dataProviders'
import { buildPaymentState } from '@island.is/application/utils'
import { getChargeItemCodes } from '../utils'

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RESIDENCE_PERMIT_RENEWAL,
  name: applicationMessage.name,
  institution: applicationMessage.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.ResidencePermitRenewal.translation,
  ],
  dataSchema: ResidencePermitRenewalSchema,
  featureFlag: Features.residencePermitRenewal,
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Gagnaöflun',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardPrerequisites,
              variant: 'blue',
            },
          },
          progress: 0.1,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Prerequisites').then((module) =>
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
              delete: true,
              api: [
                NationalRegistryUserApi,
                NationalRegistrySpouseApi,
                NationalRegistryMaritalTitleApi,
                ChildrenCustodyInformationApi,
                UserProfileApi,
                UtlendingastofnunPaymentCatalogApi,
                CountriesApi,
                TravelDocumentTypesApi,
                ApplicantCurrentResidencePermitApi,
                ChildrenCurrentResidencePermitApi,
                ApplicantCurrentResidencePermitTypeApi,
                OldStayAbroadListApi,
                OldCriminalRecordListApi,
                OldStudyItemApi,
                OldPassportItemApi,
                OldAgentItemApi,
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
          name: 'Endurnýja dvalarleyfi',
          status: 'draft',
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDraft,
              variant: 'blue',
            },
          },
          progress: 0.25,
          lifecycle: pruneAfterDays(1),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/ResidencePermitRenewalForm').then((module) =>
                  Promise.resolve(module.ResidencePermitRenewalForm),
                ),
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: 'ASDF',
                  type: 'primary',
                },
              ],
              write: 'all',
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.PAYMENT },
        },
      },
      [States.PAYMENT]: buildPaymentState({
        organizationId: InstitutionNationalIds.UTLENDINGASTOFNUN,
        chargeItemCodes: getChargeItemCodes,
        submitTarget: States.COMPLETED,
        onExit: [
          defineTemplateApi({
            action: ApiActions.submitApplication,
            triggerEvent: DefaultEvents.SUBMIT,
          }),
        ],
      }),
      [States.COMPLETED]: {
        meta: {
          name: 'Completed',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfterDays(3 * 30),
          actionCard: {
            tag: {
              label: applicationMessage.actionCardDone,
              variant: 'blueberry',
            },
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Confirmation').then((val) =>
                  Promise.resolve(val.Confirmation),
                ),
              read: 'all',
            },
          ],
        },
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

export default template
