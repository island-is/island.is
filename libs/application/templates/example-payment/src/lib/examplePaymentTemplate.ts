import {
  DefaultStateLifeCycle,
  EphemeralStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
  defineTemplateApi,
  Application,
  VerifyPaymentApi,
  InstitutionNationalIds,
} from '@island.is/application/types'
import { ApiActions } from '../shared'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { PaymentCatalogApi } from '@island.is/application/types'
import { CatalogItem } from '@island.is/clients/charge-fjs-v2'
import { buildPaymentState } from '@island.is/application/utils'

const getCodes = (application: Application) => {
  // This is where you'd pick and validate that you are going to create a charge for a
  // particular charge item code. Note that creating these charges creates an actual "krafa"
  // with FJS
  const chargeItemCode = getValueViaPath<CatalogItem['chargeItemCode']>(
    application.answers,
    'userSelectedChargeItemCode',
  )
  if (!chargeItemCode) {
    throw new Error('No selected charge item code')
  }
  return [chargeItemCode]
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EXAMPLE_PAYMENT,
  name: m.applicationTitle,
  institution: m.institution,
  dataSchema,
  readyForProduction: false,
  stateMachineConfig: {
    initial: States.DRAFT,
    states: {
      [States.DRAFT]: {
        meta: {
          status: 'draft',
          name: 'Draft',
          progress: 0.4,
          lifecycle: EphemeralStateLifeCycle,
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: async () => (await import('../forms/draft')).draft,
              actions: [
                {
                  event: DefaultEvents.PAYMENT,
                  name: m.payUp,
                  type: 'primary',
                },
              ],
              write: 'all',
              read: 'all',
              api: [PaymentCatalogApi],
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
        organizationId: InstitutionNationalIds.SYSLUMENN,
        chargeItemCodes: getCodes,
      }),
      [States.DONE]: {
        meta: {
          status: 'completed',
          name: 'Done',
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: [
            VerifyPaymentApi.configure({
              order: 0,
            }),
            defineTemplateApi({
              action: ApiActions.submitApplication,
              order: 1,
            }),
          ],
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () => import('../forms/done').then((val) => val.done),
              read: 'all',
            },
          ],
        },
      },
    },
  },
  mapUserToRole(nationalId, { applicant }) {
    if (nationalId === applicant) {
      return Roles.APPLICANT
    }

    return undefined
  },
}

export default template
