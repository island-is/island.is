import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  NationalRegistryUserApi,
  PassportsApi,
} from '@island.is/application/types'
import { Features } from '@island.is/feature-flags'
import { m } from './messages'
import {
  ApiActions,
  Events,
  Roles,
  sixtyDays,
  States,
  twoDays,
} from './constants'
import { dataSchema } from './dataSchema'
import { CodeOwners } from '@island.is/shared/constants'

const pruneAfter = (time: number) => {
  return {
    shouldBeListed: true,
    shouldBePruned: true,
    whenToPrune: time,
  }
}

const PassportAnnulmentTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.PASSPORT_ANNULMENT,
  name: m.formName.defaultMessage,
  codeOwner: CodeOwners.Juni,
  featureFlag: Features.passportAnnulmentApplication,
  translationNamespaces:
    ApplicationConfigurations.PassportAnnulment.translation,
  dataSchema,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      draft: {
        meta: {
          name: m.formName.defaultMessage,
          status: 'draft',
          progress: 0.33,
          lifecycle: pruneAfter(twoDays),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Draft').then((val) =>
                  Promise.resolve(val.Draft),
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
              api: [PassportsApi, NationalRegistryUserApi],
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: { target: States.DONE },
        },
      },
      [States.DONE]: {
        meta: {
          name: 'Done',
          status: 'completed',
          progress: 1,
          lifecycle: pruneAfter(sixtyDays),
          actionCard: {
            tag: {
              label: m.actionCardDoneTag,
            },
          },
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/Done').then((val) =>
                  Promise.resolve(val.Done),
                ),
              read: {
                externalData: ['submitPassportApplication'],
                answers: [
                  'submitPassportApplication',
                  'childsPersonalInfo',
                  'personalInfo',
                  'passport',
                ],
              },
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

export default PassportAnnulmentTemplate
