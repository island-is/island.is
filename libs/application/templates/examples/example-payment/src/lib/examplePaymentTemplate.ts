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
  BasicChargeItem,
} from '@island.is/application/types'
import { MockPaymentCatalogWithTwoItems } from '../dataProviders'
import { ApiActions } from '../shared'
import { Events, States, Roles } from './constants'
import { dataSchema } from './dataSchema'
import { m } from './messages'
import { PaymentCatalogApi } from '@island.is/application/types'
import { CatalogItem } from '@island.is/clients/charge-fjs-v2'
import { buildPaymentState } from '@island.is/application/utils'
import { CodeOwners } from '@island.is/shared/constants'

const getCodes = (application: Application): BasicChargeItem[] => {
  // This is where you'd pick and validate that you are going to create a charge for a
  // particular charge item code. Note that creating these charges creates an actual "krafa"
  // with FJS
  // NOTE: This is a simplified example, in a real application you should inspect the application
  // answers and external data to pick the correct charge item code.
  const chargeItemCode = getValueViaPath<CatalogItem['chargeItemCode']>(
    application.answers,
    'userSelectedChargeItemCode',
  )
  if (!chargeItemCode) {
    throw new Error('No selected charge item code')
  }
  return [{ code: chargeItemCode }]
}

const template: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.EXAMPLE_PAYMENT,
  name: m.applicationTitle,
  codeOwner: CodeOwners.Juni,
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
              api: [MockPaymentCatalogWithTwoItems, PaymentCatalogApi],
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
        chargeItems: getCodes,
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
