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
  InstitutionNationalIds,
} from '@island.is/application/types'
import * as m from '../lib/messages/application'
import { ApiActions, Events, Roles, States } from '../utils/types'
import { CodeOwners } from '@island.is/shared/constants'
import { dataSchema } from './dataSchema'
import {
  coreHistoryMessages,
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import { buildPaymentState } from '@island.is/application/utils'
import { AuthDelegationType } from '@island.is/shared/types'
import { ApiScope } from '@island.is/auth/scopes'
import {
  HMSPaymentCatalogApi,
  IdentityApi,
  MockableHMSPaymentCatalogApi,
  propertiesApi,
} from '../dataProviders'
import { getChargeItems } from '../utils/getChargeItems'
import { conclusion } from './messages'
import { Features } from '@island.is/feature-flags'
import { getHistoryLogSentWithSubjectAndActor } from '../utils/getHistorylogText'
import { Fasteign } from '@island.is/clients/assets'

const determineMessageFromApplicationAnswers = (application: Application) => {
  const properties = getValueViaPath<Array<Fasteign>>(
    application.externalData,
    'getProperties.data',
  )
  const selectedRealEstateId = getValueViaPath<string>(
    application.answers,
    'realEstate.realEstateName',
  )
  const chosenProperty = properties?.find(
    (property) => property.fasteignanumer === selectedRealEstateId,
  )

  return {
    name: m.application.applicationName,
    value: chosenProperty
      ? `- ${chosenProperty?.sjalfgefidStadfang?.birting} (${chosenProperty?.fasteignanumer})`
      : '',
  }
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.REGISTRATION_OF_NEW_PROPERTY_NUMBERS,
  name: determineMessageFromApplicationAnswers,
  codeOwner: CodeOwners.Origo,
  featureFlag: Features.RegistrationOfNewPropertyNumbersEnabled,
  institution: m.application.institutionName,
  translationNamespaces:
    ApplicationConfigurations.RegistrationOfNewPropertyNumbers.translation,
  requiredScopes: [ApiScope.hms],
  dataSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  stateMachineConfig: {
    initial: States.PREREQUISITES,
    states: {
      [States.PREREQUISITES]: {
        meta: {
          name: 'Skilyrði',
          progress: 0,
          status: FormModes.DRAFT,
          actionCard: {
            historyLogs: [
              {
                logMessage: coreHistoryMessages.applicationStarted,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
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
              api: [
                UserProfileApi,
                IdentityApi,
                propertiesApi,
                HMSPaymentCatalogApi,
                MockableHMSPaymentCatalogApi,
              ],
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
          actionCard: {
            tag: {
              label: m.application.actionCardDraft,
              variant: 'blue',
            },
            historyLogs: [
              {
                logMessage: getHistoryLogSentWithSubjectAndActor,
                onEvent: DefaultEvents.SUBMIT,
              },
            ],
          },
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
        organizationId: InstitutionNationalIds.HUSNAEDIS_OG_MANNVIRKJASTOFNUN,
        chargeItems: getChargeItems,
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
          name: 'Completed form',
          progress: 1,
          status: FormModes.COMPLETED,
          lifecycle: DefaultStateLifeCycle,
          actionCard: {
            tag: {
              label: conclusion.actionCardDone,
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
          ],
        },
      },
    },
  },
  mapUserToRole: (
    nationalId: string,
    application: Application,
  ): ApplicationRole | undefined => {
    if (nationalId === application.applicant) {
      return Roles.APPLICANT
    }
    return undefined
  },
}

export default template
